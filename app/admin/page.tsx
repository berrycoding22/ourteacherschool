import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import {
  deleteGalleryItem,
  deleteNews,
  deleteTeacher,
  deleteVideo,
  saveGalleryItem,
  saveNews,
  saveTeacher,
  saveVideo,
} from "./actions";

type NewsRow = { id: number; title_km: string; title_en: string | null; content_km: string | null; content_en: string | null; cover_url: string | null; published: boolean };
type TeacherRow = { id: number; name_km: string; name_en: string | null; subject_km: string | null; subject_en: string | null; bio_km: string | null; photo_url: string | null };
type GalleryRow = { id: number; title_km: string | null; title_en: string | null; image_url: string; category: string | null; published: boolean };
type VideoRow = { id: number; title_km: string; title_en: string | null; youtube_id: string; description_km: string | null; published: boolean };

const statusText: Record<string, string> = {
  saved: "បានរក្សាទុកមាតិកា។",
  deleted: "បានលុបមាតិកា។",
  "missing-required": "សូមបំពេញវាលដែលចាំបាច់។",
  "save-error": "រក្សាទុកមិនបានទេ។ សូមពិនិត្យ schema និង RLS policy ក្នុង Supabase។",
  "delete-error": "លុបមិនបានទេ។ សូមពិនិត្យ RLS policy ក្នុង Supabase។",
  "load-error": "មិនអាចអានទិន្នន័យបានទេ។ សូមអនុវត្ត admin policies ក្នុង supabase-schema.sql។",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [{ status }, supabase] = await Promise.all([searchParams, createClient()]);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminGrant, error: grantError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (grantError) return <SetupNotice userId={user.id} needsSchema />;
  if (!adminGrant) return <SetupNotice userId={user.id} />;

  const [newsResult, teachersResult, galleryResult, videosResult] = await Promise.all([
    supabase.from("news").select("id,title_km,title_en,content_km,content_en,cover_url,published").order("created_at", { ascending: false }),
    supabase.from("teachers").select("id,name_km,name_en,subject_km,subject_en,bio_km,photo_url").order("created_at", { ascending: false }),
    supabase.from("gallery").select("id,title_km,title_en,image_url,category,published").order("created_at", { ascending: false }),
    supabase.from("videos").select("id,title_km,title_en,youtube_id,description_km,published").order("created_at", { ascending: false }),
  ]);
  const loadError = [newsResult, teachersResult, galleryResult, videosResult].some((result) => result.error);
  const news = (newsResult.data ?? []) as NewsRow[];
  const teachers = (teachersResult.data ?? []) as TeacherRow[];
  const gallery = (galleryResult.data ?? []) as GalleryRow[];
  const videos = (videosResult.data ?? []) as VideoRow[];

  return (
    <main className="adminpage">
      <div className="wrap admin-wrap">
        <div className="adminbar">
          <div><small>OUR TEACHER SCHOOL</small><h1>Admin Dashboard</h1></div>
          <form action="/api/logout" method="post"><button className="btn" type="submit">Logout</button></form>
        </div>

        <div className="dashboard">
          <Stat n={news.length} t="ព័ត៌មាន" />
          <Stat n={teachers.length} t="គ្រូ" />
          <Stat n={gallery.length} t="រូបភាព" />
          <Stat n={videos.length} t="វីដេអូ" />
        </div>

        {(statusText[status ?? ""] || loadError) && (
          <p className={`admin-message ${status === "saved" || status === "deleted" ? "success" : "error"}`} role="status">
            {loadError ? statusText["load-error"] : statusText[status ?? ""]}
          </p>
        )}

        <nav className="admin-tabs" aria-label="Content sections">
          <a href="#news">ព័ត៌មាន</a><a href="#teachers">គ្រូ</a><a href="#gallery">រូបភាព</a><a href="#videos">វីដេអូ</a>
        </nav>

        <section className="admin-section panel" id="news">
          <SectionHeading title="ព័ត៌មាន" count={news.length} />
          <NewsForm />
          <div className="record-list">{news.map((item) => <NewsForm key={item.id} item={item} />)}</div>
        </section>

        <section className="admin-section panel" id="teachers">
          <SectionHeading title="គ្រូបង្រៀន" count={teachers.length} />
          <TeacherForm />
          <div className="record-list">{teachers.map((item) => <TeacherForm key={item.id} item={item} />)}</div>
        </section>

        <section className="admin-section panel" id="gallery">
          <SectionHeading title="រូបភាពសកម្មភាព" count={gallery.length} />
          <GalleryForm />
          <div className="record-list">{gallery.map((item) => <GalleryForm key={item.id} item={item} />)}</div>
        </section>

        <section className="admin-section panel" id="videos">
          <SectionHeading title="វីដេអូ" count={videos.length} />
          <VideoForm />
          <div className="record-list">{videos.map((item) => <VideoForm key={item.id} item={item} />)}</div>
        </section>
      </div>
    </main>
  );
}

function SetupNotice({ userId, needsSchema = false }: { userId: string; needsSchema?: boolean }) {
  return (
    <main className="adminpage">
      <div className="wrap">
        <section className="panel admin-setup">
          <h1 className="setup-title">
            <span className="setup-khmer">គ្រប់គ្រង</span> Admin
          </h1>
          <p className="setup-copy">
            {needsSchema
              ? "សូមអនុវត្ត supabase-schema.sql ក្នុង Supabase SQL Editor ជាមុនសិន។"
              : "សូមអនុញ្ញាត account នេះជាអ្នកគ្រប់គ្រងក្នុង Supabase SQL Editor។"}
          </p>
          <form action="/api/logout" method="post" className="setup-logout">
            <button className="btn btn-ghost" type="submit">Logout</button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Stat({ n, t }: { n: number; t: string }) {
  return <div className="stat"><b>{n}</b><span>{t}</span></div>;
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return <div className="admin-section-heading"><div><h2>{title}</h2><span>{count} items</span></div></div>;
}

function Field({ label, name, value, required = false, type = "text" }: { label: string; name: string; value?: string | null; required?: boolean; type?: string }) {
  return <label className="admin-field">{label}<input name={name} type={type} defaultValue={value ?? ""} required={required} /></label>;
}

function TextArea({ label, name, value }: { label: string; name: string; value?: string | null }) {
  return <label className="admin-field admin-field-wide">{label}<textarea name={name} rows={3} defaultValue={value ?? ""} /></label>;
}

function Published({ checked }: { checked: boolean }) {
  return <label className="admin-check"><input name="published" type="checkbox" defaultChecked={checked} /> បង្ហាញលើ Website</label>;
}

function FormButtons({ editing, deleteAction, id }: { editing: boolean; deleteAction?: (formData: FormData) => Promise<void>; id?: number }) {
  return <div className="admin-form-actions">
    <button className="btn btn-gold" type="submit">{editing ? "រក្សាទុកការកែប្រែ" : "បន្ថែម"}</button>
    {editing && deleteAction && <button className="btn btn-danger" type="submit" formAction={deleteAction} name="id" value={id}>លុប</button>}
  </div>;
}

function NewsForm({ item }: { item?: NewsRow }) {
  return <form action={saveNews} className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <Field label="ចំណងជើង (ខ្មែរ)" name="title_km" value={item?.title_km} required />
    <Field label="ចំណងជើង (English)" name="title_en" value={item?.title_en} />
    <Field label="Cover image URL" name="cover_url" value={item?.cover_url} type="url" />
    <TextArea label="មាតិកា (ខ្មែរ)" name="content_km" value={item?.content_km} />
    <TextArea label="មាតិកា (English)" name="content_en" value={item?.content_en} />
    <Published checked={item?.published ?? false} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteNews : undefined} id={item?.id} />
  </form>;
}

function TeacherForm({ item }: { item?: TeacherRow }) {
  return <form action={saveTeacher} className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <Field label="ឈ្មោះ (ខ្មែរ)" name="name_km" value={item?.name_km} required />
    <Field label="ឈ្មោះ (English)" name="name_en" value={item?.name_en} />
    <Field label="មុខវិជ្ជា (ខ្មែរ)" name="subject_km" value={item?.subject_km} />
    <Field label="មុខវិជ្ជា (English)" name="subject_en" value={item?.subject_en} />
    <Field label="Photo URL" name="photo_url" value={item?.photo_url} type="url" />
    <TextArea label="ជីវប្រវត្តិ និងប្រវត្តិសិក្សា" name="bio_km" value={item?.bio_km} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteTeacher : undefined} id={item?.id} />
  </form>;
}

function GalleryForm({ item }: { item?: GalleryRow }) {
  return <form action={saveGalleryItem} className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <Field label="Image URL" name="image_url" value={item?.image_url} required type="url" />
    <Field label="ចំណងជើង (ខ្មែរ)" name="title_km" value={item?.title_km} />
    <Field label="ចំណងជើង (English)" name="title_en" value={item?.title_en} />
    <Field label="ប្រភេទ" name="category" value={item?.category} />
    <Published checked={item?.published ?? true} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteGalleryItem : undefined} id={item?.id} />
  </form>;
}

function VideoForm({ item }: { item?: VideoRow }) {
  return <form action={saveVideo} className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <Field label="ចំណងជើង (ខ្មែរ)" name="title_km" value={item?.title_km} required />
    <Field label="ចំណងជើង (English)" name="title_en" value={item?.title_en} />
    <Field label="YouTube video ID" name="youtube_id" value={item?.youtube_id} required />
    <TextArea label="ការពិពណ៌នា" name="description_km" value={item?.description_km} />
    <Published checked={item?.published ?? true} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteVideo : undefined} id={item?.id} />
  </form>;
}
