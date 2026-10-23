import Link from "next/link";
import VideoCard from "./VideoCard";

const nav = [
  ["ទំព័រដើម", "/"],
  ["អំពីសាលា", "/about"],
  ["គ្រូបង្រៀន", "/teachers"],
  ["សកម្មភាព", "/gallery"],
  ["វីដេអូ", "/videos"],
  ["ព័ត៌មាន", "/news"],
  ["ទំនាក់ទំនង", "/contact"],
];

const locations = [
  { text: "ផ្ទះលេខ 15 និង 16បេ ខាងក្រោយសាលាប៊ែលធី ច្រមុះជ្រូកស្ទឹងមានជ័យ (ចម្ងាយ 200m)", href: "https://maps.app.goo.gl/Roy3xcjboCw7keM57" },
  { text: "ផ្ទះលេខ 241 និងផ្ទះលេខ 355 ផ្លូវលេខ 11 ក្នុងបុរីពិភពថ្មីចម្ការដូង", href: "https://maps.app.goo.gl/5RYnJe8KpaPzhQCFA" },
];

export default function Home() {
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
            <Link href="/admin" className="admin-link">Admin</Link>
          </nav>
          <details className="mobile-nav">
            <summary aria-label="បើកម៉ឺនុយ">☰</summary>
            <nav className="mobile-menu" aria-label="Mobile navigation">
              {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
              <Link href="/admin" className="admin-link">Admin</Link>
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

      <section className="section soft-section">
        <div className="wrap">
          <SectionHeading kicker="SCHOOL LIFE" title="សកម្មភាពថ្មីៗ" href="/gallery" />
          <div className="feature-grid">
            <Activity icon="📚" title="ការរៀន និងការអនុវត្ត" text="ចែករំលែកបរិយាកាសរៀន និងសកម្មភាពអប់រំប្រចាំថ្ងៃរបស់សិស្ស។" />
            <Activity icon="🎓" title="សកម្មភាពសិស្ស" text="សកម្មភាពដែលជួយបង្កើនជំនាញ ការច្នៃប្រឌិត និងទំនុកចិត្ត។" />
            <Activity icon="🏆" title="ព្រឹត្តិការណ៍សាលា" text="ព្រឹត្តិការណ៍ និងសមិទ្ធផលសំខាន់ៗរបស់សាលា និងសិស្ស។" />
          </div>
        </div>
      </section>

      <section className="section video-section">
        <div className="wrap">
          <SectionHeading kicker="YOUTUBE LEARNING" title="វីដេអូបង្រៀន និងចំណេះដឹង" href="https://www.youtube.com/@ourteacherschool1" external />
          <div className="video-grid">
            <VideoCard title="💁‍♀️ហេតុអ្វីបានជាសិស្សានុសិស្សពិបាកក្នុងការដោះស្រាយចំណោទ?" youtubeId="vrsz0mPgqMM" />
            <VideoCard title="💁‍♀️ហេតុអ្វីបានជាសិស្សខ្សោយការអាន និងសរសេរភាសាខ្មែរ?" youtubeId="oJs5lGB-CUo" />
            <VideoCard title="ថ្នាក់ទី២​ មេរៀនទី២០ ព្យព្ជានៈផ្ញើជើង | អ្នកគ្រូ សារ៉ាត់ ប្រាស្នា" youtubeId="opwNDRbL1Q0" />
            <VideoCard title="ថ្នាក់ទី៣​ ចំណោត ប្រមាណវិធីចែក | អ្នកគ្រូ សារ៉ាត់ ប្រាស្នា" youtubeId="VJs3nA5GJB0" />
            <VideoCard title="ថ្នាក់ទី៤ គណិតវិទ្យា ចំណោទប្រមាណវិធីគុណ | អ្នកគ្រូ ណាល់ មុន្នីនាថ" youtubeId="QLpjpW8sHnE" />
            <VideoCard title="ថ្នាក់ទី៦ ចំណោទ(ទំព័រទី២៨) | អ្នកគ្រូ ប៉ន ចាន់ស្រីណែត" youtubeId="VKhmuJeCst4?list=PLQlRIEGekd-HUht0LFH4o-CgMGfcKwwrX" />
            <VideoCard title="ថ្នាក់ទី៧ គណិតវិទ្យា ការសរសេរចំនួនទសភាគខួបជាប្រភាគ | អ្នកគ្រូ ផង់ ស្រីនាត" youtubeId="K2Q9BBvugVA" />
            <VideoCard title="ថ្នាក់ទី ៨ គីមីវិទ្យា គណនាម៉ាសសូលុយស្យុងនិងម៉ាសទឹក | អ្នកគ្រូ ម៉េស ស្រីនីត" youtubeId="R70oRXMjjJo" />
            <VideoCard title="ថ្នាក់ទី៩ គណិតវិទ្យា ឬសការ៉េ តគ្នា | លោកគ្រូ ប់ែត ម៉េងហុង" youtubeId="vArYnYAcp-M?list=PLQlRIEGekd-EOEtUEL8KvT0M9ri_i2dx9" />
            <VideoCard title="ថ្នាក់ទី ៩ គណិតវិទ្យា ដោះស្រាយប្រព័ន្ធវិសមីការ | អ្នកគ្រូ ឈឺន កញ្ញា" youtubeId="kgYUnV5d1U4" />
            <VideoCard title="ថ្នាក់ទី៩ វិញ្ញាសាររូបវិទ្យា ត្រៀមប្រឡងឌីប្លូម ២០២៥ | អ្នកគ្រូ សំហឿន នីតា" youtubeId="ZV1Sg41N9wM?list=PLQlRIEGekd-GrzhchDmXZB4oak82wCet3" />
            <VideoCard title="ថ្នាក់ទី១០ រូបវិទ្យា ការគណនាប្រេកង់តង់ស្យុងឆ្លាស់ | លោកគ្រូ ថាត បូរី" youtubeId="vIX7U3nnQW4" />
            <VideoCard title="កំណែវិញ្ញាសារត្រៀមប្របាក់ឌុបឆ្នាំ ២០២២ សម្រាប់ប្អូនៗរៀនត្រៀមបាក់ឌុប | អ្នកគ្រូ ជា សុខនា" youtubeId="WPR8TYzxzsM" />
            <VideoCard title="ថ្នាក់ទី១២ គីមីវិទ្យា ការសំយោគអេស្ទែ | អ្នកគ្រូ យឹម សុឃន់" youtubeId="Ft6KTOuS69U" />
            <VideoCard title="ថ្នាក់ទី១២ គណិតវិទ្យា គណនាអាំងតេក្រាល | អ្នកគ្រូ កាក់ តី" youtubeId="ES21NEdiDuQ" />

          </div>
        </div>
      </section>

      <section className="section news-section">
        <div className="wrap two-col news-layout">
          <div>
            <div className="section-kicker">LATEST NEWS</div>
            <h2>ព័ត៌មាន និង<br />សេចក្តីជូនដំណឹង</h2>
            <p>ព័ត៌មានថ្មីៗរបស់សាលានឹងបង្ហាញនៅទីនេះ។ នៅពេល Admin បញ្ចូលព័ត៌មានថ្មី វានឹងបង្ហាញលើ Homepage ដោយស្វ័យប្រវត្តិ។</p>
            <Link href="/news" className="btn btn-navy">មើលព័ត៌មានទាំងអស់</Link>
          </div>
          <div className="news-placeholder">
            <div className="news-date">LATEST</div>
            <h3>ព័ត៌មានថ្មីៗពី Our Teacher School</h3>
            <p>កន្លែងសម្រាប់បង្ហាញព័ត៌មាន សកម្មភាព និងសេចក្តីជូនដំណឹងសំខាន់ៗ។</p>
            <Link href="/news" className="text-link">មើលព័ត៌មាន →</Link>
          </div>
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
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) { return <div><strong>{number}</strong><span>{label}</span></div>; }
function SectionHeading({ kicker, title, href, external }: { kicker: string; title: string; href: string; external?: boolean }) {
  return <div className="section-heading"><div><div className="section-kicker">{kicker}</div><h2>{title}</h2></div>{external ? <a href={href} target="_blank" rel="noreferrer" className="text-link">YouTube ↗</a> : <Link href={href} className="text-link">មើលទាំងអស់ →</Link>}</div>;
}
function Activity({ icon, title, text }: { icon: string; title: string; text: string }) { return <article className="activity-card"><div className="activity-image">{icon}</div><div className="activity-body"><h3>{title}</h3><p>{text}</p><Link href="/gallery" className="text-link">មើលសកម្មភាព →</Link></div></article>; }

