"use client";

import { useEffect, useState } from "react";

export default function ImagePicker({ label, name, value }: { label: string; name: string; value?: string | null }) {
  const [preview, setPreview] = useState(value ?? "");

  useEffect(() => setPreview(value ?? ""), [value]);

  return <>
    <label className="admin-field">{label} URL (ជម្រើស)<input name={name} type="url" defaultValue={value ?? ""} onChange={(event) => setPreview(event.target.value)} /></label>
    <label className="admin-field">Upload រូបភាពពីកុំព្យូទ័រ<input name="image_file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => {
      const file = event.target.files?.[0];
      if (file) setPreview(URL.createObjectURL(file));
    }} /></label>
    {preview && <div className="admin-image-preview"><img src={preview} alt={`Preview ${label}`} /><span>Preview រូបភាព</span></div>}
  </>;
}
