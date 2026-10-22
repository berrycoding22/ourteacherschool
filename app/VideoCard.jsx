import Link from "next/link";

export default function VideoCard({ title, youtubeId }) {
  if (!youtubeId) {
    return (
      <Link href="/videos" className="video-card" aria-label={`Watch ${title}`}>
        <div className="video-thumb"><span>▶</span></div>
        <div>
          <h3>{title}</h3>
          <small>Watch on Our Teacher School</small>
        </div>
      </Link>
    );
  }

  return (
    <div className="video-card">
      <h3>{title}</h3>

      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

