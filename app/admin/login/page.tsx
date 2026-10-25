import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: loginError } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) redirect("/admin");
    redirect("/admin/login?error=1");
  }

  return <main className="login-page">
    <div className="login-glow login-glow-one" /><div className="login-glow login-glow-two" />
    <section className="login-card" aria-labelledby="login-title">
      <header className="login-card-header"><div className="login-logo-wrap"><img src="/logo.png" alt="Our Teacher School" /></div><div><span>OUR TEACHER SCHOOL</span><b>ADMIN CONSOLE</b></div></header>
      <div className="login-copy"><div className="login-kicker"><i /> SECURE ACCESS</div><h1 id="login-title">សូមស្វាគមន៍<br /><em>អ្នកគ្រប់គ្រង</em></h1><p>ចូលគណនីរបស់អ្នក ដើម្បីគ្រប់គ្រងព័ត៌មាន និងមាតិកានៅលើ website។</p></div>
      <form action={login} className="login-form">
        <label><span>Email address</span><input name="email" type="email" placeholder="name@example.com" autoComplete="email" required /></label>
        <label><span>Password</span><input name="password" type="password" placeholder="បញ្ចូលពាក្យសម្ងាត់" autoComplete="current-password" required /></label>
        {loginError && <p className="login-error" role="alert">Email ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមព្យាយាមម្តងទៀត។</p>}
        <button type="submit">ចូលទៅកាន់ Admin <span>→</span></button>
      </form>
      <footer className="login-footer"><a href="/">← ត្រឡប់ទៅ Website</a><small>មានបញ្ហាក្នុងការចូល? សូមទាក់ទងអ្នកគ្រប់គ្រងសាលា។</small></footer>
    </section>
  </main>;
}
