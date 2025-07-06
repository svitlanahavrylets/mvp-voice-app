"use client";

import { useState } from "react";

export function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

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
    } catch (error) {
      alert("Помилка при завантаженні: " + (error as Error).message);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
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
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedFile(file);
          }
        }}
        disabled={loading}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!selectedFile || loading}
      >
        Завантажити
      </button>
      {loading && <p>Завантаження...</p>}
    </div>
  );
}
