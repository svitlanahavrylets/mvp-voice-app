import { prisma } from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { UploadForm } from "@/components/UploadForm";
import SideBar from "../../components/SideBar";
import type { AudioFile } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return <div>Not authorized</div>;
  console.log("Clerk userId:", userId);

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return <div>Not authorized</div>;

  const audioFiles: AudioFile[] = await prisma.audioFile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  console.log("audioFiles:", audioFiles);

  return (
    <div className="flex">
      {audioFiles.length === 0 ? (
        <p>Немає аудіофайлів</p>
      ) : (
        <SideBar audioFiles={audioFiles} />
      )}
      <div className="flex-1 p-6 space-y-8">
        <UploadForm />
        <div className="space-y-4">
          {audioFiles.map((file) => (
            <div key={file.id} className="border p-4 rounded">
              <p className="text-sm text-gray-600">
                {file.createdAt.toLocaleString()}
              </p>
              <p className="text-lg">{file.text || "Немає тексту"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
