"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

type ContentTable = "news" | "teachers" | "gallery" | "videos";
type RowValues = Record<string, string | number | boolean | null>;
const imageBucket = "school-images";

function value(formData: FormData, name: string) {
  const field = formData.get(name);
  return typeof field === "string" ? field.trim() : "";
}

function nullableValue(formData: FormData, name: string) {
  return value(formData, name) || null;
}

function rowId(formData: FormData) {
  const rawId = value(formData, "id");
  if (!rawId) return null;
  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function adminPath(formData: FormData, status: string) {
  const section = value(formData, "section");
  const allowedSections = ["news", "teachers", "gallery", "activities", "videos", "inquiries"];
  const params = new URLSearchParams({ status });
  if (allowedSections.includes(section)) params.set("section", section);
  return `/admin?${params.toString()}`;
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) redirect("/admin?status=not-authorized");
  return supabase;
}

async function refreshContent() {
  for (const path of ["/admin", "/", "/news", "/teachers", "/gallery", "/activities", "/videos", "/inquiries"]) {
    revalidatePath(path);
  }
}

async function imageValue(formData: FormData, urlField: string, folder: string) {
  const existingUrl = nullableValue(formData, urlField);
  const file = formData.get("image_file");
  if (!(file instanceof File) || file.size === 0) return existingUrl;

  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
    redirect(adminPath(formData, "invalid-image"));
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const supabase = await requireAdmin();
  const { error } = await supabase.storage.from(imageBucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) redirect(adminPath(formData, "upload-error"));

  return supabase.storage.from(imageBucket).getPublicUrl(path).data.publicUrl;
}

async function saveRow(table: ContentTable, id: number | null, values: RowValues, formData: FormData) {
  const supabase = await requireAdmin();
  const result = id
    ? await supabase.from(table).update(values).eq("id", id)
    : await supabase.from(table).insert(values);

  if (result.error) redirect(adminPath(formData, "save-error"));
  await refreshContent();
  redirect(adminPath(formData, "saved"));
}

async function deleteRow(table: ContentTable, formData: FormData) {
  const id = rowId(formData);
  if (!id) redirect(adminPath(formData, "save-error"));

  const supabase = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) redirect(adminPath(formData, "delete-error"));

  await refreshContent();
  redirect(adminPath(formData, "deleted"));
}

export async function saveNews(formData: FormData) {
  const title = value(formData, "title_km");
  if (!title) redirect(adminPath(formData, "missing-required"));
  const coverUrl = await imageValue(formData, "cover_url", "news");

  await saveRow("news", rowId(formData), {
    title_km: title,
    title_en: nullableValue(formData, "title_en"),
    content_km: nullableValue(formData, "content_km"),
    content_en: nullableValue(formData, "content_en"),
    cover_url: coverUrl,
    published: formData.get("published") === "on",
  }, formData);
}

export async function deleteNews(formData: FormData) {
  await deleteRow("news", formData);
}

export async function saveTeacher(formData: FormData) {
  const name = value(formData, "name_km");
  if (!name) redirect(adminPath(formData, "missing-required"));
  const photoUrl = await imageValue(formData, "photo_url", "teachers");

  await saveRow("teachers", rowId(formData), {
    name_km: name,
    name_en: nullableValue(formData, "name_en"),
    subject_km: nullableValue(formData, "subject_km"),
    subject_en: nullableValue(formData, "subject_en"),
    bio_km: nullableValue(formData, "bio_km"),
    photo_url: photoUrl,
  }, formData);
}

export async function deleteTeacher(formData: FormData) {
  await deleteRow("teachers", formData);
}

export async function saveGalleryItem(formData: FormData) {
  const imageUrl = await imageValue(formData, "image_url", "gallery");
  if (!imageUrl) redirect(adminPath(formData, "missing-required"));

  await saveRow("gallery", rowId(formData), {
    title_km: nullableValue(formData, "title_km"),
    title_en: nullableValue(formData, "title_en"),
    image_url: imageUrl,
    category: nullableValue(formData, "category"),
    published: formData.get("published") === "on",
  }, formData);
}

export async function deleteGalleryItem(formData: FormData) {
  await deleteRow("gallery", formData);
}

async function uploadActivityPhotos(formData: FormData, albumId: number) {
  const files = formData.getAll("activity_images").filter((file): file is File => file instanceof File && file.size > 0);
  if (!files.length) return;

  if (files.some((file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
    redirect(adminPath(formData, "invalid-image"));
  }

  const supabase = await requireAdmin();
  const { data: existingPhotos, error: existingPhotosError } = await supabase
    .from("activity_photos")
    .select("id")
    .eq("album_id", albumId);
  if (existingPhotosError) redirect(adminPath(formData, "save-error"));

  const photos = [] as { album_id: number; image_url: string; sort_order: number }[];
  for (const [index, file] of files.entries()) {
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `activities/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(imageBucket).upload(path, file, { contentType: file.type, upsert: false });
    if (error) redirect(adminPath(formData, "upload-error"));
    photos.push({ album_id: albumId, image_url: supabase.storage.from(imageBucket).getPublicUrl(path).data.publicUrl, sort_order: index });
  }

  const { error } = await supabase.from("activity_photos").insert(photos);
  if (error) redirect(adminPath(formData, "save-error"));

  const existingIds = (existingPhotos ?? []).map((photo) => photo.id);
  if (existingIds.length) {
    const { error: deleteError } = await supabase.from("activity_photos").delete().in("id", existingIds);
    if (deleteError) redirect(adminPath(formData, "save-error"));
  }
}

export async function saveActivity(formData: FormData) {
  const title = value(formData, "title_km");
  const coverUrl = await imageValue(formData, "cover_url", "activities");
  if (!title || !coverUrl) redirect(adminPath(formData, "missing-required"));

  const id = rowId(formData);
  const supabase = await requireAdmin();
  const values = {
    title_km: title,
    description_km: nullableValue(formData, "description_km"),
    cover_url: coverUrl,
    activity_date: nullableValue(formData, "activity_date"),
    published: formData.get("published") === "on",
  };
  const result = id
    ? await supabase.from("activity_albums").update(values).eq("id", id).select("id").single()
    : await supabase.from("activity_albums").insert(values).select("id").single();
  if (result.error || !result.data) redirect(adminPath(formData, "save-error"));

  await uploadActivityPhotos(formData, result.data.id as number);
  await refreshContent();
  redirect(adminPath(formData, "saved"));
}

export async function deleteActivity(formData: FormData) {
  const id = rowId(formData);
  if (!id) redirect(adminPath(formData, "save-error"));
  const supabase = await requireAdmin();
  const { error } = await supabase.from("activity_albums").delete().eq("id", id);
  if (error) redirect(adminPath(formData, "delete-error"));
  await refreshContent();
  redirect(adminPath(formData, "deleted"));
}

export async function deleteActivityPhoto(formData: FormData) {
  const rawPhotoId = value(formData, "photo_id");
  const photoId = Number(rawPhotoId);
  if (!Number.isSafeInteger(photoId) || photoId < 1) redirect(adminPath(formData, "save-error"));
  const supabase = await requireAdmin();
  const { error } = await supabase.from("activity_photos").delete().eq("id", photoId);
  if (error) redirect(adminPath(formData, "delete-error"));
  await refreshContent();
  redirect(adminPath(formData, "saved"));
}

export async function updateInquiryStatus(formData: FormData) {
  const id = rowId(formData);
  const status = value(formData, "status");
  if (!id || !["new", "contacted", "enrolled", "closed"].includes(status)) redirect(adminPath(formData, "save-error"));
  const supabase = await requireAdmin();
  const { error } = await supabase.from("enrollment_inquiries").update({ status }).eq("id", id);
  if (error) redirect(adminPath(formData, "save-error"));
  await refreshContent();
  redirect(adminPath(formData, "saved"));
}

export async function deleteInquiry(formData: FormData) {
  const id = rowId(formData);
  if (!id) redirect(adminPath(formData, "save-error"));
  const supabase = await requireAdmin();
  const { error } = await supabase.from("enrollment_inquiries").delete().eq("id", id);
  if (error) redirect(adminPath(formData, "delete-error"));
  await refreshContent();
  redirect(adminPath(formData, "deleted"));
}

export async function saveVideo(formData: FormData) {
  const title = value(formData, "title_km");
  const youtubeId = value(formData, "youtube_id");
  if (!title || !youtubeId) redirect(adminPath(formData, "missing-required"));

  await saveRow("videos", rowId(formData), {
    title_km: title,
    title_en: nullableValue(formData, "title_en"),
    youtube_id: youtubeId,
    description_km: nullableValue(formData, "description_km"),
    published: formData.get("published") === "on",
  }, formData);
}

export async function deleteVideo(formData: FormData) {
  await deleteRow("videos", formData);
}
