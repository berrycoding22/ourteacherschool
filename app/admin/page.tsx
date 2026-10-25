import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import RecordEditor from "./RecordEditor";
import {
  deleteActivity,
  deleteInquiry,
  deleteNews,
  deleteTeacher,
  deleteVideo,
  saveActivity,
  updateInquiryStatus,
  saveNews,
  saveTeacher,
  saveVideo,
} from "./actions";

type NewsRow = { id: number; title_km: string; title_en: string | null; content_km: string | null; content_en: string | null; cover_url: string | null; published: boolean };
type TeacherRow = { id: number; name_km: string; name_en: string | null; subject_km: string | null; subject_en: string | null; bio_km: string | null; photo_url: string | null };
type ActivityRow = { id: number; title_km: string; description_km: string | null; cover_url: string; activity_date: string | null; published: boolean; activity_photos?: { count: number }[] };
type VideoRow = { id: number; title_km: string; title_en: string | null; youtube_id: string; description_km: string | null; published: boolean };
type InquiryRow = { id: number; guardian_name: string; phone: string; student_name: string | null; interested_class: string | null; message: string | null; status: "new" | "contacted" | "enrolled" | "closed"; created_at: string };
type AdminSection = "overview" | "news" | "teachers" | "activities" | "videos" | "inquiries";
const adminSections: AdminSection[] = ["overview", "news", "teachers", "activities", "videos", "inquiries"];

const statusText: Record<string, string> = {
  saved: "បានរក្សាទុកមាតិកា។",
  deleted: "បានលុបមាតិកា។",
  "missing-required": "សូមបំពេញវាលដែលចាំបាច់។",
  "invalid-image": "សូមជ្រើសរូបភាពដែលមានទំហំមិនលើស 5MB។",
  "upload-error": "Upload រូបភាពមិនបានទេ។ សូមអនុវត្ត Storage setup ក្នុង supabase-schema.sql។",
  "save-error": "រក្សាទុកមិនបានទេ។ សូមពិនិត្យ schema និង RLS policy ក្នុង Supabase។",
  "delete-error": "លុបមិនបានទេ។ សូមពិនិត្យ RLS policy ក្នុង Supabase។",
  "load-error": "មិនអាចអានទិន្នន័យបានទេ។ សូមអនុវត្ត admin policies ក្នុង supabase-schema.sql។",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; section?: string }> }) {
  const [{ status, section }, supabase] = await Promise.all([searchParams, createClient()]);
  const activeSection: AdminSection = adminSections.includes(section as AdminSection) ? section as AdminSection : "overview";
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminGrant, error: grantError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (grantError) return <SetupNotice userId={user.id} needsSchema />;
  if (!adminGrant) return <SetupNotice userId={user.id} />;

  const [newsResult, teachersResult, activitiesResult, videosResult, inquiriesResult] = await Promise.all([
    supabase.from("news").select("id,title_km,title_en,content_km,content_en,cover_url,published").order("created_at", { ascending: false }),
    supabase.from("teachers").select("id,name_km,name_en,subject_km,subject_en,bio_km,photo_url").order("created_at", { ascending: false }),
    supabase.from("activity_albums").select("id,title_km,description_km,cover_url,activity_date,published,activity_photos(count)").order("activity_date", { ascending: false }),
    supabase.from("videos").select("id,title_km,title_en,youtube_id,description_km,published").order("created_at", { ascending: false }),
    supabase.from("enrollment_inquiries").select("id,guardian_name,phone,student_name,interested_class,message,status,created_at").order("created_at", { ascending: false }),
  ]);
  const loadError = [newsResult, teachersResult, activitiesResult, videosResult, inquiriesResult].some((result) => result.error);
  const news = (newsResult.data ?? []) as NewsRow[];
  const teachers = (teachersResult.data ?? []) as TeacherRow[];
  const activities = (activitiesResult.data ?? []) as ActivityRow[];
  const videos = (videosResult.data ?? []) as VideoRow[];
  const inquiries = (inquiriesResult.data ?? []) as InquiryRow[];

  return (
    <main className="adminpage">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/" className="admin-brand"><img src="/logo.png" alt="Our Teacher School" /><span><b>Our Teacher</b><small>ADMIN CONSOLE</small></span></Link>
          <div className="admin-sidebar-label">CONTENT MANAGEMENT</div>
          <nav className="admin-side-nav admin-desktop-nav" aria-label="Content sections">
            <Link href="/admin" className={activeSection === "overview" ? "active" : ""}><i>⌘</i> ទិដ្ឋភាពទូទៅ</Link>
            <Link href="/admin?section=news" className={activeSection === "news" ? "active" : ""}><i>◼</i> ព័ត៌មាន <span>{news.length}</span></Link>
            <Link href="/admin?section=teachers" className={activeSection === "teachers" ? "active" : ""}><i>♙</i> គ្រូបង្រៀន <span>{teachers.length}</span></Link>
            <Link href="/admin?section=activities" className={activeSection === "activities" ? "active" : ""}><i>▧</i> សកម្មភាព <span>{activities.length}</span></Link>
            <Link href="/admin?section=videos" className={activeSection === "videos" ? "active" : ""}><i>▶</i> វីដេអូបង្រៀន <span>{videos.length}</span></Link>
            <Link href="/admin?section=inquiries" className={activeSection === "inquiries" ? "active" : ""}><i>✉</i> សំណើចុះឈ្មោះ <span>{inquiries.filter((item) => item.status === "new").length}</span></Link>
          </nav>
          <details className="admin-mobile-nav">
            <summary aria-label="បើកម៉ឺនុយគ្រប់គ្រង">☰</summary>
            <nav className="admin-side-nav" aria-label="Content sections">
              <Link href="/admin" className={activeSection === "overview" ? "active" : ""}><i>⌘</i> ទិដ្ឋភាពទូទៅ</Link>
              <Link href="/admin?section=news" className={activeSection === "news" ? "active" : ""}><i>◼</i> ព័ត៌មាន <span>{news.length}</span></Link>
              <Link href="/admin?section=teachers" className={activeSection === "teachers" ? "active" : ""}><i>♙</i> គ្រូបង្រៀន <span>{teachers.length}</span></Link>
              <Link href="/admin?section=activities" className={activeSection === "activities" ? "active" : ""}><i>▧</i> សកម្មភាព <span>{activities.length}</span></Link>
              <Link href="/admin?section=videos" className={activeSection === "videos" ? "active" : ""}><i>▶</i> វីដេអូបង្រៀន <span>{videos.length}</span></Link>
              <Link href="/admin?section=inquiries" className={activeSection === "inquiries" ? "active" : ""}><i>✉</i> សំណើចុះឈ្មោះ <span>{inquiries.filter((item) => item.status === "new").length}</span></Link>
            </nav>
          </details>
          <div className="admin-sidebar-footer"><Link href="/" target="_blank">↗ មើល Website</Link><form action="/api/logout" method="post"><button type="submit">⇥ Logout</button></form></div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div><small>CONTROL CENTER</small><h1>Admin Dashboard</h1><p>គ្រប់គ្រងមាតិកា Our Teacher School នៅកន្លែងតែមួយ។</p></div>
            <div className="admin-profile"><span>●</span><div><b>Administrator</b><small>Online</small></div></div>
          </header>

          {activeSection === "overview" && <><section className="admin-overview">
            <div><span>WELCOME BACK</span><h2>រៀបចំមាតិកាសាលា<br />បានរហ័ស និងមានរបៀបរៀបរយ</h2></div>
            <Link className="btn btn-gold" href="/admin?section=news">+ បន្ថែមព័ត៌មាន</Link>
          </section>

          <div className="dashboard">
            <Stat n={news.length} t="ព័ត៌មាន" icon="◼" tone="blue" />
            <Stat n={teachers.length} t="គ្រូបង្រៀន" icon="♙" tone="purple" />
            <Stat n={activities.length} t="សកម្មភាព" icon="▧" tone="gold" />
            <Stat n={videos.length} t="វីដេអូ" icon="▶" tone="teal" />
            <Stat n={inquiries.filter((item) => item.status === "new").length} t="សំណើថ្មី" icon="✉" tone="blue" />
          </div></>}

          {(statusText[status ?? ""] || loadError) && (
            <p className={`admin-message ${status === "saved" || status === "deleted" ? "success" : "error"}`} role="status">
              {loadError ? statusText["load-error"] : statusText[status ?? ""]}
            </p>
          )}

          <nav className="admin-tabs" aria-label="Content sections"><Link href="/admin?section=news">ព័ត៌មាន</Link><Link href="/admin?section=teachers">គ្រូ</Link><Link href="/admin?section=activities">សកម្មភាព</Link><Link href="/admin?section=videos">វីដេអូ</Link><Link href="/admin?section=inquiries">សំណើចុះឈ្មោះ</Link></nav>

        {activeSection === "news" && <section className="admin-section panel" id="news">
          <SectionHeading title="ព័ត៌មាន" count={news.length} />
          <NewsForm section="news" />
          <div className="record-list">{news.map((item) => <RecordEditor key={item.id} title={item.title_km} meta={item.published ? "Published" : "Draft"}><NewsForm item={item} section="news" /></RecordEditor>)}</div>
        </section>}

        {activeSection === "teachers" && <section className="admin-section panel" id="teachers">
          <SectionHeading title="គ្រូបង្រៀន" count={teachers.length} />
          <TeacherForm section="teachers" />
          <div className="record-list">{teachers.map((item) => <RecordEditor key={item.id} title={item.name_km} meta={item.subject_km || item.name_en || "គ្រូបង្រៀន"}><TeacherForm item={item} section="teachers" /></RecordEditor>)}</div>
        </section>}

        {activeSection === "activities" && <section className="admin-section panel" id="activities">
          <SectionHeading title="អាល់ប៊ុមសកម្មភាព" count={activities.length} />
          <ActivityForm section="activities" />
          <div className="record-list">{activities.map((item) => <RecordEditor key={item.id} title={item.title_km} meta={`${item.activity_photos?.[0]?.count ?? 0} រូបភាព`}><ActivityForm item={item} section="activities" /></RecordEditor>)}</div>
        </section>}

        {activeSection === "videos" && <section className="admin-section panel" id="videos">
          <SectionHeading title="វីដេអូបង្រៀន" count={videos.length} />
          <VideoForm section="videos" />
          <div className="record-list">{videos.map((item) => <RecordEditor key={item.id} title={item.title_km} meta={item.published ? "Published" : "Draft"}><VideoForm item={item} section="videos" /></RecordEditor>)}</div>
        </section>}

        {activeSection === "inquiries" && <section className="admin-section panel" id="inquiries">
          <SectionHeading title="សំណើចុះឈ្មោះ និងស្នើព័ត៌មាន" count={inquiries.length} />
          <div className="record-list">{inquiries.map((item) => <RecordEditor key={item.id} title={item.guardian_name} meta={`${item.phone} · ${inquiryStatusText[item.status]}`}><InquiryForm item={item} section="inquiries" /></RecordEditor>)}</div>
        </section>}
        </div>
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

function Stat({ n, t, icon, tone }: { n: number; t: string; icon: string; tone: string }) {
  return <div className={`stat stat-${tone}`}><i>{icon}</i><div><b>{n}</b><span>{t}</span></div></div>;
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

function ImageFields({ label, name, value }: { label: string; name: string; value?: string | null }) {
  return <>
    <Field label={`${label} URL (ជម្រើស)`} name={name} value={value} type="url" />
    <label className="admin-field">Upload រូបភាពពីកុំព្យូទ័រ<input name="image_file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
  </>;
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

function NewsForm({ item, section }: { item?: NewsRow; section: AdminSection }) {
  return <form action={saveNews} encType="multipart/form-data" className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <input type="hidden" name="section" value={section} />
    <Field label="ចំណងជើង (ខ្មែរ)" name="title_km" value={item?.title_km} required />
    <Field label="ចំណងជើង (English)" name="title_en" value={item?.title_en} />
    <ImageFields label="Cover image" name="cover_url" value={item?.cover_url} />
    <TextArea label="មាតិកា (ខ្មែរ)" name="content_km" value={item?.content_km} />
    <TextArea label="មាតិកា (English)" name="content_en" value={item?.content_en} />
    <Published checked={item?.published ?? false} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteNews : undefined} id={item?.id} />
  </form>;
}

function TeacherForm({ item, section }: { item?: TeacherRow; section: AdminSection }) {
  return <form action={saveTeacher} encType="multipart/form-data" className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <input type="hidden" name="section" value={section} />
    <Field label="ឈ្មោះ (ខ្មែរ)" name="name_km" value={item?.name_km} required />
    <Field label="ឈ្មោះ (English)" name="name_en" value={item?.name_en} />
    <Field label="មុខវិជ្ជា (ខ្មែរ)" name="subject_km" value={item?.subject_km} />
    <Field label="មុខវិជ្ជា (English)" name="subject_en" value={item?.subject_en} />
    <ImageFields label="Photo" name="photo_url" value={item?.photo_url} />
    <TextArea label="ជីវប្រវត្តិ និងប្រវត្តិសិក្សា" name="bio_km" value={item?.bio_km} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteTeacher : undefined} id={item?.id} />
  </form>;
}

function ActivityForm({ item, section }: { item?: ActivityRow; section: AdminSection }) {
  return <form action={saveActivity} encType="multipart/form-data" className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <input type="hidden" name="section" value={section} />
    <Field label="ចំណងជើងសកម្មភាព (ខ្មែរ)" name="title_km" value={item?.title_km} required />
    <Field label="កាលបរិច្ឆេទ" name="activity_date" value={item?.activity_date} type="date" />
    <ImageFields label="រូបភាព Cover" name="cover_url" value={item?.cover_url} />
    <label className="admin-field">ជំនួសរូបភាពក្នុងអាល់ប៊ុម<input name="activity_images" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple /></label>
    <TextArea label="ការពិពណ៌នាសកម្មភាព" name="description_km" value={item?.description_km} />
    <Published checked={item?.published ?? true} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteActivity : undefined} id={item?.id} />
  </form>;
}

const inquiryStatusText: Record<InquiryRow["status"], string> = { new: "ថ្មី", contacted: "បានទាក់ទង", enrolled: "បានចុះឈ្មោះ", closed: "បិទ" };

function InquiryForm({ item, section }: { item: InquiryRow; section: AdminSection }) {
  return <form action={updateInquiryStatus} className="content-form record-form">
    <input type="hidden" name="id" value={item.id} />
    <input type="hidden" name="section" value={section} />
    <div className="inquiry-details"><b>អ្នកអាណាព្យាបាល៖</b> {item.guardian_name}<br /><b>លេខទូរស័ព្ទ៖</b> <a href={`tel:${item.phone}`}>{item.phone}</a><br />{item.student_name && <><b>ឈ្មោះសិស្ស៖</b> {item.student_name}<br /></>}{item.interested_class && <><b>ថ្នាក់ចាប់អារម្មណ៍៖</b> {item.interested_class}<br /></>}{item.message && <><b>សារ៖</b><p>{item.message}</p></>}</div>
    <label className="admin-field">ស្ថានភាព<select name="status" defaultValue={item.status}><option value="new">ថ្មី</option><option value="contacted">បានទាក់ទង</option><option value="enrolled">បានចុះឈ្មោះ</option><option value="closed">បិទ</option></select></label>
    <FormButtons editing deleteAction={deleteInquiry} id={item.id} />
  </form>;
}

function VideoForm({ item, section }: { item?: VideoRow; section: AdminSection }) {
  return <form action={saveVideo} className={`content-form ${item ? "record-form" : "new-form"}`}>
    {item && <input type="hidden" name="id" value={item.id} />}
    <input type="hidden" name="section" value={section} />
    <Field label="ចំណងជើង (ខ្មែរ)" name="title_km" value={item?.title_km} required />
    <Field label="ចំណងជើង (English)" name="title_en" value={item?.title_en} />
    <Field label="YouTube Video ID" name="youtube_id" value={item?.youtube_id} required />
    <TextArea label="ការពិពណ៌នា" name="description_km" value={item?.description_km} />
    <Published checked={item?.published ?? true} />
    <FormButtons editing={Boolean(item)} deleteAction={item ? deleteVideo : undefined} id={item?.id} />
  </form>;
}
