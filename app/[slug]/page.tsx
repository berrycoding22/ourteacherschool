import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { defaultVideos, type Video } from "../../lib/videos";

const pageMeta = {
  about: ["ABOUT OUR SCHOOL", "អំពី Our Teacher School"],
  teachers: ["OUR TEACHERS", "គ្រូបង្រៀន"],
  gallery: ["SCHOOL LIFE", "សកម្មភាពសាលា"],
  videos: ["YOUTUBE LEARNING", "វីដេអូបង្រៀន"],
  news: ["LATEST NEWS", "ព័ត៌មាន និងសេចក្តីជូនដំណឹង"],
  contact: ["CONTACT US", "ទំនាក់ទំនងមកកាន់យើង"],
} as const;

const navigation = [
  ["ទំព័រដើម", "/"],
  ["អំពីសាលា", "/about"],
  ["គ្រូបង្រៀន", "/teachers"],
  ["សកម្មភាព", "/gallery"],
  ["វីដេអូបង្រៀន", "/videos"],
  ["ព័ត៌មាន", "/news"],
  ["ទំនាក់ទំនង", "/contact"],
];

type PageSlug = keyof typeof pageMeta;
type Teacher = { id: number; name_km: string; name_en: string | null; subject_km: string | null; subject_en: string | null; bio_km: string | null; photo_url: string | null };
type GalleryItem = { id: number; title_km: string | null; image_url: string; category: string | null };
type News = { id: number; title_km: string; content_km: string | null; cover_url: string | null; created_at: string };


export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in pageMeta)) notFound();
  const pageSlug = slug as PageSlug;
  const [eyebrow, title] = pageMeta[pageSlug];
  const supabase = await createClient();
  let content: React.ReactNode;

  if (pageSlug === "about") content = <About />;
  else if (pageSlug === "contact") content = <Contact />;
  else if (pageSlug === "teachers") {
    const { data } = await supabase.from("teachers").select("id,name_km,name_en,subject_km,subject_en,bio_km,photo_url").order("created_at", { ascending: false });
    content = <Teachers items={(data ?? []) as Teacher[]} />;
  } else if (pageSlug === "gallery") {
    const { data } = await supabase.from("gallery").select("id,title_km,image_url,category").eq("published", true).order("created_at", { ascending: false });
    content = <Gallery items={(data ?? []) as GalleryItem[]} />;
  } else if (pageSlug === "videos") {
    const { data } = await supabase.from("videos").select("id,title_km,youtube_id,description_km").eq("published", true).order("created_at", { ascending: false });
    content = <Videos items={(data ?? []) as Video[]} />;
  } else {
    const { data } = await supabase.from("news").select("id,title_km,content_km,cover_url,created_at").eq("published", true).order("created_at", { ascending: false });
    content = <NewsList items={(data ?? []) as News[]} />;
  }

  return <>
    <header className="site-header">
      <div className="wrap nav-row">
        <Link href="/" className="brand" aria-label="Our Teacher School home"><img src="/logo.png" alt="Our Teacher School logo" /><span><strong>Our Teacher School</strong><small>BUILD YOUR LIFE</small></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/admin" className="admin-link">Admin</Link></nav>
        <details className="mobile-nav">
          <summary aria-label="បើកម៉ឺនុយ">☰</summary>
          <nav className="mobile-menu" aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/admin" className="admin-link">Admin</Link></nav>
        </details>
      </div>
    </header>
    <main className="content-page"><header className="content-hero"><div className="wrap"><div className="section-kicker">{eyebrow}</div><h1>{title}</h1><Link href="/" className="text-link">← ទំព័រដើម</Link></div></header><section className="content-body wrap">{content}</section></main>
    <footer className="footer"><div className="wrap copyright">© {new Date().getFullYear()} Our Teacher School. All rights reserved.</div></footer>
  </>;
}

function About() { return <div className="content-prose"><h2>កសាងចំណេះដឹង បង្កើតអនាគត</h2><p>Our Teacher School បង្កើតឡើងក្នុងឆ្នាំ 2002 ដោយមានគោលបំណងផ្តល់ការអប់រំប្រកបដោយគុណភាព និងបរិយាកាសសិក្សាដែលយកចិត្តទុកដាក់ចំពោះសិស្សគ្រប់រូប។</p><div className="content-highlights"><div><b>2002</b><span>ឆ្នាំចាប់ផ្តើម</span></div><div><b>02</b><span>ទីតាំងសាលា</span></div><div><b>100%</b><span>ការយកចិត្តទុកដាក់</span></div></div><p>យើងជួយសិស្សអភិវឌ្ឍចំណេះដឹង ជំនាញ និងទំនុកចិត្ត ដើម្បីត្រៀមខ្លួនសម្រាប់អនាគត។</p></div>; }
function Contact() { return <div className="contact-page-grid"><div className="contact-page-card"><h2>លេខទូរស័ព្ទ</h2><strong><a href="https://t.me/ourteacherschool1" target="_blank" rel="noreferrer">010 744 440</a></strong><strong><a href="https://t.me/+85577244440" target="_blank" rel="noreferrer">077 244 440</a></strong></div><div className="contact-page-card"><h2><a href="https://maps.app.goo.gl/Roy3xcjboCw7keM57" target="_blank" rel="noreferrer">ទីតាំងទី ១</a></h2><p><a href="https://maps.app.goo.gl/Roy3xcjboCw7keM57" target="_blank" rel="noreferrer">ផ្ទះលេខ 15 និង 16បេ ខាងក្រោយសាលាប៊ែលធី ច្រមុះជ្រូកស្ទឹងមានជ័យ (ចម្ងាយ 200m)</a></p></div><div className="contact-page-card"><h2><a href="https://maps.app.goo.gl/5RYnJe8KpaPzhQCFA" target="_blank" rel="noreferrer">ទីតាំងទី ២</a></h2><p><a href="https://maps.app.goo.gl/5RYnJe8KpaPzhQCFA" target="_blank" rel="noreferrer">ផ្ទះលេខ 241 និងផ្ទះលេខ 355 ផ្លូវលេខ 11 ក្នុងបុរីពិភពថ្មីចម្ការដូង</a></p></div></div>; }
function Empty({ children }: { children: React.ReactNode }) { return <div className="content-empty">{children}</div>; }
function Teachers({ items }: { items: Teacher[] }) {
  if (!items.length) return <Empty>មិនទាន់មានព័ត៌មានគ្រូបង្រៀនទេ។ សូមបន្ថែមព័ត៌មាននៅក្នុង Admin Dashboard។</Empty>;

  return <div className="teacher-grid">{items.map((item) => (
    <article className="teacher-card" key={item.id}>
      <div className="teacher-photo-wrap">
        {item.photo_url ? <img src={item.photo_url} alt={`រូបលោកគ្រូ/អ្នកគ្រូ ${item.name_km}`} /> : <div className="teacher-avatar" aria-label="រូបតំណាងគ្រូ">👩‍🏫</div>}
        <span className="teacher-photo-badge">OUR TEACHER</span>
      </div>
      <div className="teacher-card-body">
        <div className="teacher-overline"><i /> គ្រូបង្រៀន OUR TEACHER SCHOOL</div>
        <div className="teacher-role">{item.subject_km || item.subject_en || "គ្រូបង្រៀន"}</div>
        <h2>{item.name_km}</h2>
        {item.name_en && <small>{item.name_en}</small>}
        <div className="teacher-divider"><span /></div>
        {item.bio_km ? <div className="teacher-bio"><span>ជីវប្រវត្តិ និងប្រវត្តិសិក្សា</span><p>{item.bio_km}</p></div> : <p className="teacher-values">ចំណេះដឹង · វិន័យ · ការរីកចម្រើន</p>}
      </div>
    </article>
  ))}</div>;
}
function Gallery({ items }: { items: GalleryItem[] }) { if (!items.length) return <Empty>មិនទាន់មានរូបភាពសកម្មភាពទេ។ សូមបន្ថែមរូបភាពនៅក្នុង Admin Dashboard។</Empty>; return <div className="gallery-grid">{items.map((item) => <figure key={item.id}><img src={item.image_url} alt={item.title_km || "School activity"} /><figcaption>{item.title_km || item.category || "សកម្មភាពសាលា"}</figcaption></figure>)}</div>; }
function Videos({ items }: { items: Video[] }) { const videos = items.length ? items : defaultVideos; return <div className="content-video-grid">{videos.map((item) => <article className="content-video-card" key={item.id}><h2>{item.title_km}</h2><div className="video-wrapper"><iframe src={`https://www.youtube.com/embed/${item.youtube_id}`} title={item.title_km} loading="lazy" allowFullScreen /></div>{item.description_km && <p>{item.description_km}</p>}</article>)}</div>; }
function NewsList({ items }: { items: News[] }) { if (!items.length) return <Empty>មិនទាន់មានព័ត៌មានថ្មីទេ។ សូមពិនិត្យម្តងទៀតនៅពេលក្រោយ។</Empty>; return <div className="news-list">{items.map((item) => <article className="news-item" key={item.id}>{item.cover_url && <img src={item.cover_url} alt={item.title_km} />}<div><time>{new Intl.DateTimeFormat("km-KH", { dateStyle: "long" }).format(new Date(item.created_at))}</time><h2>{item.title_km}</h2>{item.content_km && <p>{item.content_km}</p>}</div></article>)}</div>; }
