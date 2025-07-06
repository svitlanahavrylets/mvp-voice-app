// src/app/dashboard/page.tsx (server component)

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId)
    return <div className="max-w-xl text-right ">Not authorized</div>;

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        hasPaid: false,
      },
    });
  }

  const audioFiles = await prisma.audioFile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return <DashboardClient audioFiles={audioFiles} />;
}
