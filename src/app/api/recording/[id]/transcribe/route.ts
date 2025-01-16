import { client } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const content = JSON.parse(body.content);

    const transcribed = await client.video.update({
      where: {
        userId: id,
        source: body.filename,
      },
      data: {
        title: content.title,
        description: content.summary,
        summary: body.transcript,
      },
    });

    if (transcribed) {
      console.log(
        "🟢 Transcription successful, updating Voiceflow knowledge base..."
      );

      const options = {
        method: "POST",
        url: process.env.VOICEFLOW_KNOWLEDGE_BASE_API,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: process.env.VOICEFLOW_API_KEY,
        },
        data: {
          data: {
            schema: {
              searchableFields: ["title", "transcript"],
              metadataFields: ["title", "transcript"],
            },
            name: content.title,
            items: [
              {
                title: content.title,
                transcript: body.transcript,
              },
            ],
          },
        },
      };

      const updateKB = await axios.request(options);

      if (updateKB.status === 200) {
        console.log("🟢 Knowledge base updated successfully");
        return NextResponse.json({ status: 200 });
      } else {
        console.error("🔴 Failed to update knowledge base", updateKB.data);
        return NextResponse.json({
          status: 500,
          error: "Failed to update knowledge base",
        });
      }
    } else {
      console.error("🔴 Transcription update failed");
      return NextResponse.json({
        status: 500,
        error: "Transcription update failed",
      });
    }
  } catch (error) {
    console.error("🔴 Error processing request", error);
    return NextResponse.json({
      status: 500,
      error: "Error processing request",
    });
  }
}
