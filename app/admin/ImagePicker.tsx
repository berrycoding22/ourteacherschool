"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Ratio = "original" | "1" | "1.333333" | "1.777778";
const ratios: { value: Ratio; label: string }[] = [{ value: "original", label: "ទំហំដើម" }, { value: "1", label: "1 : 1" }, { value: "1.333333", label: "4 : 3" }, { value: "1.777778", label: "16 : 9" }];

export default function ImagePicker({ label, name, value, fileName = "image_file" }: { label: string; name: string; value?: string | null; fileName?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [preview, setPreview] = useState(value ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [ratio, setRatio] = useState<Ratio>("1.333333");
  const [zoom, setZoom] = useState(100);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [notice, setNotice] = useState("");

  useEffect(() => setPreview(value ?? ""), [value]);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file)); setNotice(""); setIsEditing(true);
  }

  function resetEditor() {
    setZoom(100); setX(0); setY(0); setBrightness(100); setContrast(100); setRatio("1.333333"); setNotice("");
  }

  function createEditedImage() {
    const image = imageRef.current;
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    const selectedRatio = ratio === "original" ? image.naturalWidth / image.naturalHeight : Number(ratio);
    const width = 1600;
    const height = Math.round(width / selectedRatio);
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    const baseScale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const scaledWidth = image.naturalWidth * baseScale * (zoom / 100);
    const scaledHeight = image.naturalHeight * baseScale * (zoom / 100);
    const overflowX = Math.max(0, scaledWidth - width);
    const overflowY = Math.max(0, scaledHeight - height);
    const left = (width - scaledWidth) / 2 + (x / 100) * (overflowX / 2);
    const top = (height - scaledHeight) / 2 + (y / 100) * (overflowY / 2);
    try {
      context.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      context.drawImage(image, left, top, scaledWidth, scaledHeight);
      canvas.toBlob((blob) => {
        if (!blob || !fileInputRef.current) return;
        const file = new File([blob], `edited-${Date.now()}.jpg`, { type: "image/jpeg" });
        const files = new DataTransfer(); files.items.add(file);
        fileInputRef.current.files = files.files;
        setPreview(URL.createObjectURL(file)); setIsEditing(false);
        setNotice("រូបភាពបានកែរួច។ ចុច “រក្សាទុក” ខាងក្រោម ដើម្បីបង្ហាញលើ Website។");
      }, "image/jpeg", .92);
    } catch {
      setNotice("មិនអាចកែ URL រូបភាពនេះបានទេ។ សូម Download រូប ហើយ Upload វាមកវិញដើម្បីកែ។");
    }
  }

  const filter = `brightness(${brightness}%) contrast(${contrast}%)`;
  const ratioStyle = ratio === "original" ? undefined : { aspectRatio: ratio };

  return <>
    <label className="admin-field">{label} URL (ជម្រើស)<input name={name} type="url" defaultValue={value ?? ""} onChange={(event) => { setPreview(event.target.value); setNotice(""); }} /></label>
    <label className="admin-field">Upload រូបភាពពីកុំព្យូទ័រ<input ref={fileInputRef} name={fileName} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={selectFile} /></label>
    {preview && <div className="admin-image-preview"><img src={preview} alt={`Preview ${label}`} /><span>Preview រូបភាព</span><button type="button" onClick={() => { setIsEditing(true); setNotice(""); }}>កែរូបភាព</button></div>}
    {isEditing && preview && <section className="image-editor" aria-label={`កែ ${label}`}>
      <div className="image-editor-heading"><div><b>កែរូបភាព</b><small>កំណត់ crop និងពន្លឺ មុនពេលរក្សាទុក</small></div><button type="button" onClick={() => setIsEditing(false)} aria-label="បិទ">×</button></div>
      <div className="image-editor-preview" style={ratioStyle}><img ref={imageRef} src={preview} crossOrigin="anonymous" alt="កំពុងកែរូបភាព" style={{ filter, transform: `translate(${x / 2}%, ${y / 2}%) scale(${zoom / 100})` }} /></div>
      <div className="image-editor-controls">
        <label>ទំហំ Crop<select value={ratio} onChange={(event) => setRatio(event.target.value as Ratio)}>{ratios.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <Range label="ពង្រីក" value={zoom} min={100} max={220} onChange={setZoom} suffix="%" />
        <Range label="ផ្លាស់ទីឆ្វេង/ស្តាំ" value={x} min={-100} max={100} onChange={setX} />
        <Range label="ផ្លាស់ទីឡើង/ចុះ" value={y} min={-100} max={100} onChange={setY} />
        <Range label="Brightness" value={brightness} min={40} max={160} onChange={setBrightness} suffix="%" />
        <Range label="Contrast" value={contrast} min={40} max={180} onChange={setContrast} suffix="%" />
      </div>
      <div className="image-editor-actions"><button type="button" className="button-secondary" onClick={resetEditor}>កំណត់ឡើងវិញ</button><button type="button" className="button-primary" onClick={createEditedImage}>រក្សាទុករូបដែលបានកែ</button></div>
    </section>}
    {notice && <p className="image-editor-notice">{notice}</p>}
  </>;
}

function Range({ label, value, min, max, onChange, suffix = "" }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void; suffix?: string }) {
  return <label>{label}<span>{value}{suffix}</span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
