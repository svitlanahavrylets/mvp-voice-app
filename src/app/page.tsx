import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-100 to-orange-100 bg-opacity-80 px-4 py-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-800 tracking-tight">
          Welcome to WHISPR
        </h1>

        <p className="text-gray-600 text-lg">
          AI-based Voice-to-Text Tool. Upload your voice, get instant
          transcription.
        </p>
        <p className="text-gray-500 text-sm">
          Please sign in to use the voice-to-text service.
        </p>
      </div>
    </main>
  );
}
