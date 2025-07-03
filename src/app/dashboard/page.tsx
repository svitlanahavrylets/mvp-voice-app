import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your dashboard </h1>
      <p className="mt-4 text-gray-700">
        This is your personal dashboard where you can manage your voice
        services.
      </p>
    </div>
  );
}
