import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
  console.log("userId", userId);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-center">
      <h1 className="text-2xl font-bold text-gray-800">
        🧠 Вітаю в MVP Voice App!
        <br />
        Увійди, щоб користуватись голосовим сервісом 🎤
      </h1>
    </main>
  );
}
