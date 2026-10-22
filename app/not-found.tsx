import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section" style={{ padding: "120px 0" }}>
      <div className="wrap" style={{ maxWidth: 720, textAlign: "center" }}>
        <div className="section-kicker">404</div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", margin: "18px 0 12px" }}>Page not found</h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.8, marginBottom: 28 }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="btn btn-gold">Back to home</Link>
      </div>
    </main>
  );
}
