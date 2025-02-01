"use server";

interface ChatSettings {
  model: string;
  temperature: number;
  system: string;
}

interface ChatRequest {
  chunkLimit: number;
  synthesis: boolean;
  settings: ChatSettings;
  filters: {
    videoId: string;
  };
  question: string;
}

export async function queryKnowledgeBase(
  userQuestion: string,
  videoId: string
): Promise<string> {
  if (
    !process.env.VOICEFLOW_KNOWLEDGE_BASE_QUERY_URL ||
    !process.env.VOICEFLOW_API_KEY
  ) {
    throw new Error("Missing Voiceflow configuration");
  }

  try {
    const chatRequest: ChatRequest = {
      chunkLimit: 2,
      synthesis: true,
      settings: {
        model: "claude-instant-v1",
        temperature: 0.1,
        system:
          "You are an AI FAQ assistant. Information will be provided to help answer the user's questions. Always summarize your response to be as brief and concise as possible, keeping responses under a couple of sentences. Do not reference the provided material directly in your response.",
      },
      filters: { videoId },
      question: userQuestion,
    };

    const response = await fetch(
      process.env.VOICEFLOW_KNOWLEDGE_BASE_QUERY_URL,
      {
        method: "POST",
        headers: {
          Authorization: process.env.VOICEFLOW_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatRequest),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.output) {
      return data.output;
    }

    return "I can only answer questions related to this video";
  } catch (error) {
    console.error("Error querying knowledge base:", error);
    return "There was an error processing your request.";
  }
}
