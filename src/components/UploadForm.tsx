"use client";

import { useState } from "react";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("audio", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.redirectToCheckout) {
        await handleUpgrade();
        return;
      }
    }

    const data = await res.json();
    alert("Результат: " + data.text);
    setLoading(false);
  };

  const handleUpgrade = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Завантаження..." : "Розпізнати аудіо"}
      </button>
    </div>
  );
}
