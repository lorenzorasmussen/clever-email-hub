import { useState } from "react";
import { Send, Bot, User, Sparkles, Mail, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  suggestions?: string[];
  data?: any;
}

export const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your AI assistant. I can help you manage your emails, calendar, and notes. What would you like to do today?",
      timestamp: "now",
      suggestions: [
        "Show me important emails",
        "What's on my calendar today?",
        "Summarize recent emails",
        "Create a new note"
      ]
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

    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: getAIResponse(inputValue),
      timestamp: new Date().toLocaleTimeString(),
      suggestions: getAISuggestions(inputValue)
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue("");
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("email")) {
      return "I found 12 emails in your inbox. 3 are marked as high priority. Would you like me to show you the important ones first or provide a summary of all recent emails?";
    } else if (lowerInput.includes("calendar")) {
      return "You have 4 events today: Team Standup at 9 AM, Project Review at 2 PM, Client Call at 4 PM, and a Deadline Reminder at 6 PM. Would you like more details about any of these?";
    } else if (lowerInput.includes("note")) {
      return "I can help you create a new note or find existing ones. You currently have 4 notes including 'Meeting Notes - Q4 Planning' and 'AI Features Ideas'. What would you like to do?";
    } else if (lowerInput.includes("summarize")) {
      return "Here's a summary of your recent activity: You have 3 urgent emails requiring action, 2 meetings today, and your notes show ongoing work on Q4 planning. Should I provide detailed summaries for any specific area?";
    }
    
    return "I can help you with emails, calendar events, and notes. Try asking me to show important emails, check your calendar, or create notes.";
  };

  const getAISuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("email")) {
      return ["Show high priority emails", "Archive read emails", "Draft a reply", "Create email filters"];
    } else if (lowerInput.includes("calendar")) {
      return ["Schedule a meeting", "Find free time slots", "Reschedule conflicts", "Set reminders"];
    } else if (lowerInput.includes("note")) {
      return ["Create meeting notes", "Search existing notes", "Organize by tags", "Export notes"];
    }
    
    return ["Show me important emails", "What's on my calendar?", "Create a new note", "Summarize my day"];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Bot className="h-8 w-8 text-blue-600" />
            <Sparkles className="h-4 w-4 text-purple-500 absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Mail className="h-3 w-3" />
            Emails
          </Badge>
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Calendar
          </Badge>
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <FileText className="h-3 w-3" />
            Notes
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-card-foreground'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {message.type === 'ai' ? (
                  <Bot className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className={`text-xs ${message.type === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {message.timestamp}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{message.content}</p>

              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your emails, calendar, or notes..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>AI can help with email management, calendar optimization, and intelligent note-taking</span>
        </div>
      </div>
    </div>
  );
};