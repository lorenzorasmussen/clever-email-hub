
import { useState } from "react";
import { Bot, MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

export const PersistentAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your AI assistant. How can I help you today?",
      timestamp: "now"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "I can help you with emails, calendar events, and notes. What would you like to do?",
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue("");
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background/95 backdrop-blur-sm border-l border-border shadow-xl z-40">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/30">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-xs ${message.type === "user" ? "order-first" : ""}`}>
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-card border border-border shadow-sm"
                  }`}>
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-sm"
              />
              <Button onClick={handleSendMessage} size="sm" className="px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
