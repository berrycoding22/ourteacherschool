"use client";

import { useRef } from "react";

export default function NewsImagePreview({ src, alt }: { src: string; alt: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return <>
    <button type="button" className="news-image-button" onClick={() => dialogRef.current?.showModal()}>
      មើលរូបភាពពេញ ↗
    </button>
    <dialog
      className="news-image-dialog"
      ref={dialogRef}
      aria-label={`រូបភាពពេញ៖ ${alt}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="news-image-dialog-content">
        <button type="button" className="news-image-close" aria-label="បិទរូបភាព" onClick={() => dialogRef.current?.close()}>×</button>
        <img src={src} alt={alt} />
      </div>
    </dialog>
  </>;
}
