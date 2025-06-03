
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
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Bot className="h-8 w-8 text-blue-600" />
            <Sparkles className="h-4 w-4 text-purple-500 absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-600">Your intelligent email, calendar & notes companion</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Mail className="h-3 w-3 mr-1" />
            12 Emails
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Calendar className="h-3 w-3 mr-1" />
            4 Events Today
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            <FileText className="h-3 w-3 mr-1" />
            4 Notes
          </Badge>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
            {message.type === "ai" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            
            <div className={`max-w-2xl ${message.type === "user" ? "order-first" : ""}`}>
              <div className={`p-4 rounded-lg ${
                message.type === "user" 
                  ? "bg-blue-600 text-white ml-auto" 
                  : "bg-white shadow-sm border border-gray-100"
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              
              {message.suggestions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">{message.timestamp}</p>
            </div>
            
            {message.type === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your emails, calendar, or notes..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="px-6">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => handleSuggestionClick("Show me important emails")}
            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors"
          >
            📧 Important emails
          </button>
          <button
            onClick={() => handleSuggestionClick("What's on my calendar today?")}
            className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded-full text-green-700 transition-colors"
          >
            📅 Today's schedule
          </button>
          <button
            onClick={() => handleSuggestionClick("Summarize my recent emails")}
            className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 rounded-full text-purple-700 transition-colors"
          >
            ✨ Summarize emails
          </button>
        </div>
      </div>
    </div>
  );
};
