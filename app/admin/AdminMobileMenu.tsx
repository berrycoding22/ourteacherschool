"use client";

import { useRef } from "react";

export default function AdminMobileMenu({ children }: { children: React.ReactNode }) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  return <details className="admin-mobile-nav" ref={menuRef} onClick={(event) => {
    if ((event.target as HTMLElement).closest("a")) menuRef.current?.removeAttribute("open");
  }}>
    <summary aria-label="បើកម៉ឺនុយគ្រប់គ្រង">☰</summary>
    {children}
  </details>;
}
