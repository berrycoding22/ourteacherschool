import Link from "next/link";
import VideoCard from "./VideoCard";
import { createClient } from "../lib/supabase/server";
import { defaultVideos, type Video } from "../lib/videos";
import { submitEnrollmentInquiry } from "./enrollment-actions";
import NewsImagePreview from "./NewsImagePreview";
import MobileContactBar from "./MobileContactBar";

const nav = [
  ["ទំព័រដើម", "/"],
  ["អំពីសាលា", "/about"],
  ["កម្មវិធីសិក្សា", "/programs"],
  ["គ្រូបង្រៀន", "/teachers"],
  ["សកម្មភាព", "/gallery"],
  ["វីដេអូបង្រៀន", "/videos"],
  ["ព័ត៌មាន", "/news"],
  ["FAQ", "/faq"],
  ["ទំនាក់ទំនង", "/contact"],
];

const locations = [
  { text: "ផ្ទះលេខ 15 និង 16បេ ខាងក្រោយសាលាប៊ែលធី ច្រមុះជ្រូកស្ទឹងមានជ័យ (ចម្ងាយ 200m)", href: "https://maps.app.goo.gl/Roy3xcjboCw7keM57" },
  { text: "ផ្ទះលេខ 241 និងផ្ទះលេខ 355 ផ្លូវលេខ 11 ក្នុងបុរីពិភពថ្មីចម្ការដូង", href: "https://maps.app.goo.gl/5RYnJe8KpaPzhQCFA" },
];
type ActivityAlbum = { id: number; title_km: string; description_km: string | null; cover_url: string; activity_date: string | null; activity_photos?: { count: number }[] };
type News = { id: number; title_km: string; content_km: string | null; cover_url: string | null; created_at: string };

export default async function Home({ searchParams }: { searchParams: Promise<{ inquiry?: string }> }) {
  const [{ inquiry }, supabase] = await Promise.all([searchParams, createClient()]);
  const [videosResult, activitiesResult, newsResult] = await Promise.all([
    supabase.from("videos").select("id,title_km,youtube_id,description_km").eq("published", true).order("created_at", { ascending: false }).limit(3),
    supabase.from("activity_albums").select("id,title_km,description_km,cover_url,activity_date,activity_photos(count)").eq("published", true).order("activity_date", { ascending: false }).limit(3),
    supabase.from("news").select("id,title_km,content_km,cover_url,created_at").eq("published", true).order("created_at", { ascending: false }).limit(1),
  ]);
  const featuredVideos = ((videosResult.data?.length ? videosResult.data : defaultVideos.slice(0, 3)) as Video[]);
  const featuredActivities = (activitiesResult.data ?? []) as ActivityAlbum[];
  const latestNews = (newsResult.data?.[0] ?? null) as News | null;

  return (
    <main>
      <header className="site-header">
        <div className="wrap nav-row">
          <Link href="/" className="brand" aria-label="Our Teacher School home">
            <img src="/logo.png" alt="Our Teacher School logo" />
            <span><strong>Our Teacher School</strong><small>BUILD YOUR LIFE</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <details className="mobile-nav">
            <summary aria-label="បើកម៉ឺនុយ">☰</summary>
            <nav className="mobile-menu" aria-label="Mobile navigation">
              {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
          </details>
        </div>
      </header>

      <section className="hero-home">
        <div className="hero-glow" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">OUR TEACHER SCHOOL · ESTD 2002</div>
            <h1>កសាងចំណេះដឹង<br /><em>បង្កើតអនាគត</em></h1>
            <p>ផ្តល់ការអប់រំប្រកបដោយគុណភាព បរិយាកាសសិក្សាល្អ និងការយកចិត្តទុកដាក់ ដើម្បីជួយសិស្សឱ្យរីកចម្រើនទាំងចំណេះដឹង ជំនាញ និងទំនុកចិត្ត។</p>
            <div className="hero-actions">
              <Link href="/about" className="btn btn-gold">ស្វែងយល់អំពីសាលា</Link>
              <Link href="/videos" className="btn btn-outline">▶ មើលវីដេអូ</Link>
            </div>
          </div>
          <div className="hero-card">
            <img src="/logo-hero.png" alt="Our Teacher School" />
            <div><span>OUR MISSION</span><strong>Learn · Grow · Succeed</strong></div>
          </div>
        </div>
      </section>

      <section className="quick-stats">
        <div className="wrap stats-grid">
          <Stat number="2002" label="ឆ្នាំចាប់ផ្តើម" />
          <Stat number="02" label="ទីតាំងសាលា" />
          <Stat number="100%" label="ការយកចិត្តទុកដាក់" />
          <Stat number="∞" label="ឱកាសសិក្សា" />
        </div>
      </section>

      <section className="section home-intro">
        <div className="wrap two-col">
          <div>
            <div className="section-kicker">WELCOME TO OUR TEACHER SCHOOL</div>
            <h2>សាលារៀនដែលផ្តោតលើ<br />ការបំប៉នសិស្សឲ្យរីកចម្រើន</h2>
          </div>
          <div className="intro-copy">
            <p>Our Teacher School បង្កើតឡើងដោយមានគោលបំណងជួយសិស្សឱ្យទទួលបានការអប់រំដែលមានគុណភាព និងអាចយកចំណេះដឹងទៅប្រើប្រាស់ក្នុងជីវិតពិត។</p>
            <Link href="/about" className="text-link">អានបន្ថែមអំពីសាលា →</Link>
          </div>
        </div>
      </section>

      <section className="section programs-section" id="programs">
        <div className="wrap">
          <div className="programs-heading"><div><div className="section-kicker">OUR PROGRAMS</div><h2>កម្មវិធីបំប៉ន<br />និងជំនាញសិក្សា</h2></div><p>សាលាបង្រៀនថ្នាក់បំប៉នបន្ថែមក្រៅម៉ោង ដើម្បីជួយសិស្សពង្រឹងចំណេះដឹង និងជំនាញសម្រាប់អនាគត។</p></div>
          <div className="program-grid">
            <article><span>01</span><h3>ថ្នាក់មត្តេយ្យ</h3><p>ថ្នាក់មត្តេយ្យត្រៀមចូលថ្នាក់ទី ១ ដោយផ្តោតលើមូលដ្ឋានចាំបាច់សម្រាប់កុមារ។</p></article>
            <article><span>02</span><h3>ថ្នាក់ទី ១ ដល់ ១២</h3><p>ថ្នាក់បំប៉នសម្រាប់សិស្សគ្រប់កម្រិត ដើម្បីពង្រឹងការសិក្សា និងត្រៀមប្រឡង។</p></article>
            <article><span>03</span><h3>ភាសាបរទេស</h3><p>កម្មវិធីភាសាអង់គ្លេស ចិន និងភាសាបរទេសផ្សេងៗ សម្រាប់ការទំនាក់ទំនងទំនើប។</p></article>
            <article><span>04</span><h3>កុំព្យូទ័ររដ្ឋបាល</h3><p>បណ្តុះជំនាញកុំព្យូទ័រអនុវត្តជាក់ស្តែង ដែលមានប្រយោជន៍សម្រាប់ការសិក្សា និងការងារ។</p></article>
          </div>
          <div className="computer-program"><div className="computer-program-intro"><div className="computer-icon">💻</div><div><div className="section-kicker">COMPUTER ADMINISTRATION</div><h3>ត្រៀមជំនាញកុំព្យូទ័រ<br />សម្រាប់សាកលវិទ្យាល័យ និងការងារ</h3><p>សិក្សាត្រឹមតែរយៈពេល ៣ ខែ ដើម្បីប្រើប្រាស់កុំព្យូទ័របានស្ទាត់ជំនាញ និងអនុវត្តបានក្នុងជីវិតប្រចាំថ្ងៃ។</p><Link href="#enroll" className="text-link">ចុះឈ្មោះរៀនកុំព្យូទ័រ →</Link></div></div><div className="computer-skills"><div><b>⌨</b><span>Typing</span><small>វាយអក្សរខ្មែរ និងអង់គ្លេសបានស្ទាត់</small></div><div><b>W</b><span>Microsoft Word</span><small>ឯកសារ លិខិតរដ្ឋបាល តារាង និងការបោះពុម្ព</small></div><div><b>X</b><span>Microsoft Excel</span><small>Sheet, Formula, Table និងលំហាត់ការងារជាក់ស្តែង</small></div><div><b>P</b><span>PowerPoint</span><small>Slide, Design, Animation, SmartArt និង Chart</small></div></div></div>
          <div className="programs-note"><div><b>គ្រូបង្រៀនមានគរុកោសល្យ និងបទពិសោធន៍</b><span>យកចិត្តទុកដាក់ចំពោះសិស្សគ្រប់រូប ដើម្បីឲ្យការសិក្សារីកចម្រើនប្រកបដោយទំនុកចិត្ត។</span></div><div className="programs-note-actions"><Link href="/programs" className="text-link">មើលកម្មវិធីលម្អិត →</Link><Link href="#enroll" className="btn btn-navy">ចុះឈ្មោះចូលរៀន →</Link></div></div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="wrap"><SectionHeading kicker="OUR COMMUNITY" title="ការជឿទុកចិត្តពីមាតាបិតា និងសិស្ស" href="/faq" /><div className="testimonial-grid"><Testimonial quote="គ្រូយកចិត្តទុកដាក់ និងពន្យល់មេរៀនបានងាយយល់។ កូនខ្ញុំមានទំនុកចិត្តក្នុងការរៀនកាន់តែខ្លាំង។" name="មាតាបិតាសិស្ស" role="ថ្នាក់បំប៉ន" /><Testimonial quote="ខ្ញុំអាចប្រើ Word, Excel និង PowerPoint បានល្អ បន្ទាប់ពីរៀនថ្នាក់កុំព្យូទ័ររយៈពេល ៣ ខែ។" name="សិស្ស Our Teacher School" role="ថ្នាក់កុំព្យូទ័រ" /><Testimonial quote="បរិយាកាសសិក្សាល្អ មានវិន័យ ហើយគ្រូតែងតែជួយណែនាំសិស្សគ្រប់រូប។" name="មាតាបិតាសិស្ស" role="កម្មវិធីភាសា" /></div></div>
      </section>

      <section className="section faq-preview-section"><div className="wrap faq-preview"><div><div className="section-kicker">HELP CENTER</div><h2>សំណួរដែលគេសួរញឹកញាប់</h2><p>ស្វែងរកព័ត៌មានអំពីការចុះឈ្មោះ ថ្នាក់សិក្សា និងការទំនាក់ទំនងជាមួយសាលា។</p><Link className="btn btn-navy" href="/faq">មើល FAQ ទាំងអស់ →</Link></div><div className="faq-mini"><details open><summary>សាលាទទួលចុះឈ្មោះពេលណា?</summary><p>សាលាទទួលចុះឈ្មោះសិស្សជារៀងរាល់ថ្ងៃ។</p></details><details><summary>តើមានថ្នាក់អ្វីខ្លះ?</summary><p>មានថ្នាក់មត្តេយ្យ បំប៉នទី១–១២ ភាសាបរទេស និងកុំព្យូទ័រ។</p></details><details><summary>តើអាចសួរព័ត៌មានបន្ថែមបានទេ?</summary><p>អាចទំនាក់ទំនងតាមទូរស័ព្ទ Telegram ឬ Facebook របស់សាលា។</p></details></div></div></section>

      <section className="section soft-section">
        <div className="wrap">
          <SectionHeading kicker="SCHOOL LIFE" title="សកម្មភាពថ្មីៗ" href="/gallery" />
          <div className="feature-grid">{featuredActivities.length ? featuredActivities.map((activity) => <Activity key={activity.id} activity={activity} />) : <><Activity icon="📚" title="ការរៀន និងការអនុវត្ត" text="ចែករំលែកបរិយាកាសរៀន និងសកម្មភាពអប់រំប្រចាំថ្ងៃរបស់សិស្ស។" /><Activity icon="🎓" title="សកម្មភាពសិស្ស" text="សកម្មភាពដែលជួយបង្កើនជំនាញ ការច្នៃប្រឌិត និងទំនុកចិត្ត។" /><Activity icon="🏆" title="ព្រឹត្តិការណ៍សាលា" text="ព្រឹត្តិការណ៍ និងសមិទ្ធផលសំខាន់ៗរបស់សាលា និងសិស្ស។" /></>}</div>
        </div>
      </section>

      <section className="section video-section">
        <div className="wrap">
          <SectionHeading kicker="YOUTUBE LEARNING" title="វីដេអូបង្រៀន និងចំណេះដឹង" href="/videos" />
          <div className="video-grid">
            {featuredVideos.map((video) => <VideoCard key={video.id} title={video.title_km} youtubeId={video.youtube_id} />)}
          </div>
        </div>
      </section>

      <section className="section news-section">
        <div className="wrap two-col news-layout">
          <div>
            <div className="section-kicker">LATEST NEWS</div>
            <h2>ព័ត៌មាន និង<br />សេចក្តីជូនដំណឹង</h2>
            <p>ព័ត៌មានថ្មីៗរបស់សាលានឹងបង្ហាញនៅទីនេះ។</p>
            <Link href="/news" className="btn btn-navy">មើលព័ត៌មានទាំងអស់</Link>
          </div>
          <div className="news-placeholder">
            {latestNews ? <><div className="news-date">{new Intl.DateTimeFormat("km-KH", { dateStyle: "long" }).format(new Date(latestNews.created_at))}</div>{latestNews.cover_url && <><img className="home-news-image" src={latestNews.cover_url} alt={latestNews.title_km} /><NewsImagePreview src={latestNews.cover_url} alt={latestNews.title_km} /></>}<h3>{latestNews.title_km}</h3>{latestNews.content_km && <p>{latestNews.content_km}</p>}<Link href="/news" className="text-link">មើលព័ត៌មាន →</Link></> : <><div className="news-date">LATEST</div><h3>ព័ត៌មានថ្មីៗពី Our Teacher School</h3><p>កន្លែងសម្រាប់បង្ហាញព័ត៌មាន សកម្មភាព និងសេចក្តីជូនដំណឹងសំខាន់ៗ។</p><Link href="/news" className="text-link">មើលព័ត៌មាន →</Link></>}
          </div>
        </div>
      </section>

      <section className="section enrollment-section" id="enroll">
        <div className="wrap enrollment-layout">
          <div><div className="section-kicker light">ENROLLMENT</div><h2>ចង់ចុះឈ្មោះ<br />ឬស្នើព័ត៌មាន?</h2><p>បំពេញព័ត៌មានខាងក្រោម ហើយក្រុមការងារសាលានឹងទាក់ទងមកអ្នកវិញឆាប់ៗ។</p></div>
          <form action={submitEnrollmentInquiry} className="enrollment-form">
            <label>ឈ្មោះអ្នកអាណាព្យាបាល<input name="guardian_name" required /></label>
            <label>លេខទូរស័ព្ទ<input name="phone" type="tel" required /></label>
            <label>ឈ្មោះសិស្ស (ជម្រើស)<input name="student_name" /></label>
            <label>ថ្នាក់ដែលចាប់អារម្មណ៍<input name="interested_class" placeholder="ឧ. ថ្នាក់ទី ៧" /></label>
            <label className="enrollment-field-wide">សារ ឬសំណួរ (ជម្រើស)<textarea name="message" rows={3} /></label>
            {inquiry === "sent" && <p className="enrollment-message success">បានទទួលព័ត៌មានរួចហើយ។ សូមអរគុណ!</p>}
            {inquiry === "missing" && <p className="enrollment-message error">សូមបំពេញឈ្មោះ និងលេខទូរស័ព្ទ។</p>}
            {inquiry === "error" && <p className="enrollment-message error">មិនអាចផ្ញើបានទេ។ សូមព្យាយាមម្តងទៀត។</p>}
            <button className="btn btn-gold" type="submit">ផ្ញើសំណើ →</button>
          </form>
        </div>
      </section>

      <section className="contact-strip">
        <div className="wrap contact-grid">
          <div><div className="section-kicker light">CONTACT US</div><h2>ចង់ស្វែងយល់បន្ថែម?</h2><p>ទំនាក់ទំនងមកកាន់សាលា ដើម្បីទទួលបានព័ត៌មានបន្ថែមអំពីការសិក្សា និងទីតាំង។</p></div>
          <div className="contact-details">
            <strong>
              ☎ <a href="https://t.me/ourteacherschool1" target="_blank" rel="noreferrer">010 744 440</a>
              {" · "}
              <a href="https://t.me/+85577244440" target="_blank" rel="noreferrer">077 244 440</a>
            </strong>
            {locations.map((location) => <a key={location.href} href={location.href} target="_blank" rel="noreferrer">📍 {location.text}</a>)}
            <Link href="/contact" className="btn btn-gold">ទំនាក់ទំនងសាលា →</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div><img src="/logo.png" alt="Our Teacher School logo" className="footer-logo" /><p>Our Teacher School<br />Build Your Life · Since 2002</p></div>
          <div><h3>Quick Links</h3>{nav.slice(1, 5).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
          <div><h3>Social</h3><a href="https://www.facebook.com/ourteacherschool" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.youtube.com/@ourteacherschool1" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.tiktok.com/@ourteacherschool" target="_blank" rel="noreferrer">TikTok</a></div>
        </div>
        <div className="wrap copyright">© {new Date().getFullYear()} Our Teacher School. All rights reserved.</div>
      </footer>
      <MobileContactBar />
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) { return <div><strong>{number}</strong><span>{label}</span></div>; }
function SectionHeading({ kicker, title, href, external }: { kicker: string; title: string; href: string; external?: boolean }) {
  return <div className="section-heading"><div><div className="section-kicker">{kicker}</div><h2>{title}</h2></div>{external ? <a href={href} target="_blank" rel="noreferrer" className="text-link">YouTube ↗</a> : <Link href={href} className="text-link">មើលទាំងអស់ →</Link>}</div>;
}
function Activity({ icon, title, text, activity }: { icon?: string; title?: string; text?: string; activity?: ActivityAlbum }) {
  const href = activity ? `/activities/${activity.id}` : "/gallery";
  return <article className="activity-card">{activity ? <Link href={href} className="activity-image activity-cover"><img src={activity.cover_url} alt={activity.title_km} /><span>📷 {activity.activity_photos?.[0]?.count ?? 0}</span></Link> : <div className="activity-image">{icon}</div>}<div className="activity-body"><h3>{activity?.title_km || title}</h3><p>{activity?.description_km || text}</p><Link href={href} className="text-link">មើលសកម្មភាព →</Link></div></article>;
}
function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) { return <figure className="testimonial-card"><blockquote>“{quote}”</blockquote><figcaption><b>{name}</b><span>{role}</span></figcaption></figure>; }

