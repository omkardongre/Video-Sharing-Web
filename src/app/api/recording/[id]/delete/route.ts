import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const deleted = await client.video.deleteMany({
      where: {
        userId: id,
        source: body.filename,
      },
    });

    if (deleted.count > 0) {
      return NextResponse.json({ status: 200 });
    }
    return NextResponse.json({ status: 404, error: "Video not found" });
  } catch (error) {
    console.error("🔴 Error deleting video entry", error);
    return NextResponse.json({ status: 500, error: "Error deleting video entry" });
  }
}
