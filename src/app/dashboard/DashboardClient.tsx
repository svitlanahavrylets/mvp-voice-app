"use client";

import { useState } from "react";
import { UploadForm } from "@/components/UploadForm";
import SideBar from "../../components/SideBar";
import type { AudioFile } from "@prisma/client";

interface DashboardClientProps {
  audioFiles: AudioFile[];
}

export default function DashboardClient({
  audioFiles: initialAudioFiles,
}: DashboardClientProps) {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(initialAudioFiles);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 w-full bg-gray-50 p-4 border-r rounded-md">
        <SideBar audioFiles={audioFiles} />
      </div>

      <div className="flex-1 p-6 space-y-8">
        <UploadForm
          onUploadSuccess={(newFile: AudioFile) =>
            setAudioFiles((prev) => [newFile, ...prev])
          }
        />
        <div className="space-y-4">
          {audioFiles.map((file) => (
            <div key={file.id} className="border p-4 rounded shadow">
              <p className="text-sm text-gray-600">
                {new Date(file.createdAt).toLocaleString()}
              </p>
              <p className="text-lg font-medium text-gray-800">
                {file.text || "No text"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
