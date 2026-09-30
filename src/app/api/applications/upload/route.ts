import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const slot = String(form.get("slot") || "photo").replace(/[^a-z0-9_-]/gi, "").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File foto tidak ditemukan." }, { status: 400 });
    }

    const extension = MIME_EXTENSIONS[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Format foto harus JPG, PNG, atau WebP." },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran foto maksimal 8 MB." },
        { status: 400 },
      );
    }

    const now = new Date();
    const folder = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const relativeDir = path.join("uploads", "applications", folder);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    await mkdir(absoluteDir, { recursive: true });

    const filename = `${slot || "photo"}-${randomUUID()}.${extension}`;
    const absolutePath = path.join(absoluteDir, filename);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(absolutePath, bytes);

    return NextResponse.json({
      url: `/${relativeDir.replace(/\\/g, "/")}/${filename}`,
    });
  } catch (error) {
    console.error("POST /api/applications/upload error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan foto. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
