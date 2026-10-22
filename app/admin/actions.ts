"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

type ContentTable = "news" | "teachers" | "gallery" | "videos";
type RowValues = Record<string, string | number | boolean | null>;

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
  for (const path of ["/admin", "/", "/news", "/teachers", "/gallery", "/videos"]) {
    revalidatePath(path);
  }
}

async function saveRow(table: ContentTable, id: number | null, values: RowValues) {
  const supabase = await requireAdmin();
  const result = id
    ? await supabase.from(table).update(values).eq("id", id)
    : await supabase.from(table).insert(values);

  if (result.error) redirect("/admin?status=save-error");
  await refreshContent();
  redirect("/admin?status=saved");
}

async function deleteRow(table: ContentTable, formData: FormData) {
  const id = rowId(formData);
  if (!id) redirect("/admin?status=save-error");

  const supabase = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) redirect("/admin?status=delete-error");

  await refreshContent();
  redirect("/admin?status=deleted");
}

export async function saveNews(formData: FormData) {
  const title = value(formData, "title_km");
  if (!title) redirect("/admin?status=missing-required");

  await saveRow("news", rowId(formData), {
    title_km: title,
    title_en: nullableValue(formData, "title_en"),
    content_km: nullableValue(formData, "content_km"),
    content_en: nullableValue(formData, "content_en"),
    cover_url: nullableValue(formData, "cover_url"),
    published: formData.get("published") === "on",
  });
}

export async function deleteNews(formData: FormData) {
  await deleteRow("news", formData);
}

export async function saveTeacher(formData: FormData) {
  const name = value(formData, "name_km");
  if (!name) redirect("/admin?status=missing-required");

  await saveRow("teachers", rowId(formData), {
    name_km: name,
    name_en: nullableValue(formData, "name_en"),
    subject_km: nullableValue(formData, "subject_km"),
    subject_en: nullableValue(formData, "subject_en"),
    bio_km: nullableValue(formData, "bio_km"),
    photo_url: nullableValue(formData, "photo_url"),
  });
}

export async function deleteTeacher(formData: FormData) {
  await deleteRow("teachers", formData);
}

export async function saveGalleryItem(formData: FormData) {
  const imageUrl = value(formData, "image_url");
  if (!imageUrl) redirect("/admin?status=missing-required");

  await saveRow("gallery", rowId(formData), {
    title_km: nullableValue(formData, "title_km"),
    title_en: nullableValue(formData, "title_en"),
    image_url: imageUrl,
    category: nullableValue(formData, "category"),
    published: formData.get("published") === "on",
  });
}

export async function deleteGalleryItem(formData: FormData) {
  await deleteRow("gallery", formData);
}

export async function saveVideo(formData: FormData) {
  const title = value(formData, "title_km");
  const youtubeId = value(formData, "youtube_id");
  if (!title || !youtubeId) redirect("/admin?status=missing-required");

  await saveRow("videos", rowId(formData), {
    title_km: title,
    title_en: nullableValue(formData, "title_en"),
    youtube_id: youtubeId,
    description_km: nullableValue(formData, "description_km"),
    published: formData.get("published") === "on",
  });
}

export async function deleteVideo(formData: FormData) {
  await deleteRow("videos", formData);
}