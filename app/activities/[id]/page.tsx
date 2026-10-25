import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

type Album = { id: number; title_km: string; description_km: string | null; cover_url: string; activity_date: string | null };
type Photo = { id: number; image_url: string; caption_km: string | null };

export default async function ActivityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albumId = Number(id);
  if (!Number.isSafeInteger(albumId) || albumId < 1) notFound();

  const supabase = await createClient();
  const [{ data: album }, { data: photos }] = await Promise.all([
    supabase.from("activity_albums").select("id,title_km,description_km,cover_url,activity_date").eq("id", albumId).eq("published", true).maybeSingle(),
    supabase.from("activity_photos").select("id,image_url,caption_km").eq("album_id", albumId).order("sort_order"),
  ]);
  if (!album) notFound();
  const activity = album as Album;
  const gallery = photos as Photo[] | null;

  return <main className="content-page"><header className="content-hero"><div className="wrap"><div className="section-kicker">SCHOOL ACTIVITY</div><h1>{activity.title_km}</h1><Link href="/gallery" className="text-link">← ត្រឡប់ទៅសកម្មភាព</Link></div></header><section className="content-body wrap activity-detail">
    <img className="activity-detail-cover" src={activity.cover_url} alt={activity.title_km} />
    <div className="activity-detail-copy"><time>{activity.activity_date ? new Intl.DateTimeFormat("km-KH", { dateStyle: "long" }).format(new Date(`${activity.activity_date}T00:00:00`)) : "សកម្មភាពសាលា"}</time>{activity.description_km && <p>{activity.description_km}</p>}</div>
    {!!gallery?.length && <div className="activity-photo-grid">{gallery.map((photo) => <figure key={photo.id}><img src={photo.image_url} alt={photo.caption_km || activity.title_km} />{photo.caption_km && <figcaption>{photo.caption_km}</figcaption>}</figure>)}</div>}
  </section></main>;
}
