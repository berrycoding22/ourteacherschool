"use client";

import { useRef } from "react";

export default function RecordEditor({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return <>
    <article className="record-editor">
      <div><b>{title}</b><small>{meta}</small></div>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>កែប្រែ</button>
    </article>
    <dialog className="record-dialog" ref={dialogRef} aria-label={`កែប្រែ ${title}`}>
      <div className="record-dialog-panel">
        <header><div><small>EDIT CONTENT</small><h2>{title}</h2><p>{meta}</p></div><button type="button" onClick={() => dialogRef.current?.close()} aria-label="បិទ">×</button></header>
        <div className="record-dialog-content">{children}</div>
      </div>
    </dialog>
  </>;
}
