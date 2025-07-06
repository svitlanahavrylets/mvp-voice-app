import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";
import FormData from "form-data";
import fetch from "node-fetch";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const user = existingUser
    ? existingUser
    : await prisma.user.create({ data: { clerkId: userId } });

  const count = await prisma.audioFile.count({ where: { userId: user.id } });

  if (!user.hasPaid && count >= 2) {
    return NextResponse.json(
      { error: "Limit reached", redirectToCheckout: true },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("audio") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filename = `${randomUUID()}_${file.name}`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);
  await writeFile(filePath, buffer);

  const openaiForm = new FormData();
  openaiForm.append("file", buffer, filename);
  openaiForm.append("model", "whisper-1");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: openaiForm,
    }
  );

  const json = (await response.json()) as { text?: string };
  console.log("Whisper result:", json);
  const text = json.text || "No text returned";

  const audioFile = await prisma.audioFile.create({
    data: {
      userId: user.id,
      url: `/uploads/${filename}`,
      text,
    },
  });

  return NextResponse.json(audioFile);
}
