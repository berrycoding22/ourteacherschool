"use client";

import { useState } from "react";
import ImagePicker from "./ImagePicker";

type Photo = { id: number; image_url: string; sort_order: number };

export default function ActivityPhotoManager({ photos, updateAction, deleteAction }: { photos: Photo[]; updateAction: (formData: FormData) => void; deleteAction: (formData: FormData) => void }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = photos.find((photo) => photo.id === selectedId);
  const sortedPhotos = [...photos].sort((a, b) => a.sort_order - b.sort_order);

  return <div className="activity-photo-manager">
    <b>រូបភាពក្នុងអាល់ប៊ុម — ជ្រើសរើសរូប ដើម្បីកែ</b>
    <div className="activity-photo-thumbnails">{sortedPhotos.map((photo) => <figure key={photo.id} className={selectedId === photo.id ? "selected" : ""}>
      <button type="button" className="activity-photo-select" onClick={() => setSelectedId(photo.id)} aria-label="កែរូបភាពនេះ"><img src={photo.image_url} alt="រូបភាពសកម្មភាព" /></button>
      <button type="submit" formAction={deleteAction} formNoValidate name="photo_id" value={photo.id}>លុប</button>
    </figure>)}</div>
    {selected && <div className="activity-photo-editor">
      <input type="hidden" name="activity_photo_id" value={selected.id} />
      <ImagePicker key={selected.id} label="កែរូបភាពដែលបានជ្រើស" name="activity_photo_url" value={selected.image_url} fileName="activity_photo_file" />
      <button type="submit" className="button-primary" formAction={updateAction} formNoValidate>រក្សាទុករូបភាពនេះ</button>
    </div>}
  </div>;
}
