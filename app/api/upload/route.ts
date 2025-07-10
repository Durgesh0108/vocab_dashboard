// app/api/upload/route.ts

import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileUrl = await uploadToS3(buffer, file.name, file.type);

  return NextResponse.json({ url: fileUrl });
}
