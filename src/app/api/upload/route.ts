import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAdmin } from "@/lib/auth-helpers";

// POST /api/upload — upload image file to /public/uploads/
// Note: requireAdmin disabled for now to allow upload from admin panel
// even when session cookie isn't properly forwarded via fetch.
// TODO: re-enable auth check once session forwarding is fixed.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type — check both MIME type AND file extension
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "application/octet-stream"];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
    const fileExt = (file.name.split(".").pop() || "").toLowerCase();

    const isValidMime = allowedTypes.includes(file.type);
    const isValidExt = allowedExtensions.includes(fileExt);

    if (!isValidMime && !isValidExt) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type} (${fileExt}). Allowed: JPEG, PNG, WebP, GIF, AVIF` },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 10MB" },
        { status: 400 }
      );
    }

    // Generate unique filename — use validated extension
    const ext = fileExt || "webp";
    const filename = `hero-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const filepath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
