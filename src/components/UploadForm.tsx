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
      alert("Result: " + data.text);
    } catch (error) {
      alert("Upload error: " + (error as Error).message);
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
    <section className="bg-white  px-4 sm:px-8 md:px-16 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-lg text-gray-600 mt-2">
            AI-based Voice-to-Text Tool. Upload your voice, get instant
            transcription.
          </p>
        </div>

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
            className="border border-gray-300 rounded p-2 w-full max-w-md"
          />

          {selectedFile && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-red-500 text-sm underline"
              >
                Cancel selection
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded disabled:opacity-50"
            disabled={!selectedFile || loading}
          >
            Upload
          </button>

          {loading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
      </div>
    </section>
  );
}
