import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Buffer } from "buffer";
import FormDataNode from "form-data";
import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";

export const dynamic = "force-dynamic";

type CloudinaryUploadResponse = {
  secure_url: string;
};

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
  const file = formData.get("file") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const cloudForm = new FormDataNode();
  cloudForm.append("file", buffer, file.name);
  cloudForm.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: cloudForm as unknown as RequestInit["body"],
    }
  );

  const cloudinaryJson =
    (await cloudinaryRes.json()) as CloudinaryUploadResponse;
  const uploadedUrl = cloudinaryJson.secure_url;

  if (!uploadedUrl) {
    return NextResponse.json(
      { error: "Upload to Cloudinary failed" },
      { status: 500 }
    );
  }

  const whisperForm = new FormDataNode();
  whisperForm.append("file", buffer, file.name);
  whisperForm.append("model", "whisper-1");

  const whisperRes = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: whisperForm,
    }
  );

  const whisperJson = (await whisperRes.json()) as { text?: string };
  const text = whisperJson.text || "No text returned";

  const audioFile = await prisma.audioFile.create({
    data: {
      userId: user.id,
      url: uploadedUrl,
      text,
    },
  });

  return NextResponse.json(audioFile);
}
