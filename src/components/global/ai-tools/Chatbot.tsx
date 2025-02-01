"use client";

import { queryKnowledgeBase } from "@/actions/ai-chat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot({ videoId }: { videoId: string }) {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      sender: "user" as const,
      text: userInput,
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    const response = await queryKnowledgeBase(userInput, videoId);
    const botMessage: Message = {
      sender: "bot" as const,
      text: response,
    };

    setChatHistory((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <Card className="w-full h-[500px] flex flex-col bg-card">
      <CardHeader className="border-b p-4">
        <h3 className="font-semibold">AI Assistant</h3>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">Thinking...</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full gap-2"
        >
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !userInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
