
import { useState } from "react";
import { Search, Filter, Star, Archive, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  aiTags: string[];
  aiSummary: string;
  priority: "high" | "medium" | "low";
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "John Doe",
    subject: "Project Update - Q4 Progress",
    preview: "Hi team, I wanted to share the latest updates on our Q4 project milestones...",
    time: "2:30 PM",
    isRead: false,
    isStarred: true,
    aiTags: ["Work", "Project", "Important"],
    aiSummary: "Project status update with Q4 milestones and upcoming deadlines",
    priority: "high"
  },
  {
    id: "2",
    sender: "Newsletter Daily",
    subject: "Your Weekly Tech Digest",
    preview: "This week in tech: AI breakthroughs, new frameworks, and industry insights...",
    time: "1:15 PM",
    isRead: true,
    isStarred: false,
    aiTags: ["Newsletter", "Tech", "Reading"],
    aiSummary: "Weekly technology news and industry updates",
    priority: "low"
  },
  {
    id: "3",
    sender: "Sarah Wilson",
    subject: "Meeting Reschedule Request",
    preview: "Hi, I need to reschedule our meeting tomorrow due to a conflict...",
    time: "12:45 PM",
    isRead: false,
    isStarred: false,
    aiTags: ["Meeting", "Schedule", "Urgent"],
    aiSummary: "Request to reschedule tomorrow's meeting due to scheduling conflict",
    priority: "high"
  },
  {
    id: "4",
    sender: "GitHub",
    subject: "Security Alert: New login detected",
    preview: "We detected a new login to your GitHub account from a new device...",
    time: "11:20 AM",
    isRead: true,
    isStarred: false,
    aiTags: ["Security", "GitHub", "Alert"],
    aiSummary: "Security notification about new device login to GitHub account",
    priority: "medium"
  }
];

interface EmailListProps {
  onEmailSelect: (email: Email) => void;
}

export const EmailList = ({ onEmailSelect }: EmailListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const filteredEmails = mockEmails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Action Bar */}
        {selectedEmails.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedEmails.length} selected
            </span>
            <div className="flex gap-1 ml-auto">
              <Button variant="ghost" size="sm">
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={`border-b border-gray-100 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              !email.isRead ? "bg-blue-50" : ""
            }`}
            onClick={() => onEmailSelect(email)}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedEmails.includes(email.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleEmailSelection(email.id);
                }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium text-sm ${!email.isRead ? "text-gray-900" : "text-gray-700"}`}>
                    {email.sender}
                  </span>
                  <Badge variant="outline" className={getPriorityColor(email.priority)}>
                    {email.priority}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-auto">{email.time}</span>
                  {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>
                
                <h3 className={`text-sm mb-1 ${!email.isRead ? "font-semibold text-gray-900" : "text-gray-800"}`}>
                  {email.subject}
                </h3>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {email.preview}
                </p>

                {/* AI Summary */}
                <div className="bg-purple-50 p-2 rounded text-xs mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Tag className="h-3 w-3 text-purple-600" />
                    <span className="font-medium text-purple-700">AI Summary:</span>
                  </div>
                  <p className="text-purple-600">{email.aiSummary}</p>
                </div>

                {/* AI Tags */}
                <div className="flex flex-wrap gap-1">
                  {email.aiTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
