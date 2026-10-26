"use client";

import { useRef, useState } from "react";

export default function NewsImagePreview({ src, alt }: { src: string; alt: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);

  return <>
    <button type="button" className="news-image-button" onClick={() => { setZoomed(false); dialogRef.current?.showModal(); }}>
      មើលរូបភាពពេញ ↗
    </button>
    <dialog
      className="news-image-dialog"
      ref={dialogRef}
      aria-label={`រូបភាពពេញ៖ ${alt}`}
      onClose={() => setZoomed(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className={`news-image-dialog-content${zoomed ? " is-zoomed" : ""}`}>
        <button type="button" className="news-image-zoom" onClick={() => setZoomed((current) => !current)}>{zoomed ? "បង្រួម" : "ពង្រីក"}</button>
        <button type="button" className="news-image-close" aria-label="បិទរូបភាព" onClick={() => dialogRef.current?.close()}>×</button>
        <img src={src} alt={alt} onClick={() => setZoomed((current) => !current)} />
      </div>
    </dialog>
  </>;
}
