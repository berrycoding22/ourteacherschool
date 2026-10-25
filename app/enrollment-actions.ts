"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

function value(formData: FormData, name: string) {
  const field = formData.get(name);
  return typeof field === "string" ? field.trim() : "";
}

export async function submitEnrollmentInquiry(formData: FormData) {
  const guardianName = value(formData, "guardian_name");
  const phone = value(formData, "phone");
  if (!guardianName || !phone) redirect("/?inquiry=missing#enroll");

  const supabase = await createClient();
  const { error } = await supabase.from("enrollment_inquiries").insert({
    guardian_name: guardianName,
    phone,
    student_name: value(formData, "student_name") || null,
    interested_class: value(formData, "interested_class") || null,
    message: value(formData, "message") || null,
  });
  if (error) redirect("/?inquiry=error#enroll");

  revalidatePath("/admin");
  redirect("/?inquiry=sent#enroll");
}
