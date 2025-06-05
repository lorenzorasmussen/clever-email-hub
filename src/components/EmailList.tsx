
import { useState } from "react";
import { Search, Filter, Star, Archive, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEmails, Email } from "@/hooks/useEmails";

interface EmailListProps {
  onEmailSelect: (email: Email) => void;
}

export const EmailList = ({ onEmailSelect }: EmailListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const { emails, isLoading, markAsRead, toggleStar } = useEmails();

  const filteredEmails = emails.filter(email =>
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

  const handleEmailClick = (email: Email) => {
    if (!email.is_read) {
      markAsRead(email.id);
    }
    onEmailSelect(email);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
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
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emails...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {filteredEmails.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500">No emails found</p>
              <p className="text-sm text-gray-400">Your emails will appear here once you receive them</p>
            </div>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`border-b border-gray-100 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                !email.is_read ? "bg-blue-50" : ""
              }`}
              onClick={() => handleEmailClick(email)}
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
                    <span className={`font-medium text-sm ${!email.is_read ? "text-gray-900" : "text-gray-700"}`}>
                      {email.sender}
                    </span>
                    <Badge variant="outline" className={getPriorityColor(email.priority)}>
                      {email.priority}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-auto">{formatTime(email.time)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id, email.is_starred);
                      }}
                    >
                      <Star className={`h-4 w-4 ${email.is_starred ? "text-yellow-500 fill-current" : "text-gray-400"}`} />
                    </button>
                  </div>
                  
                  <h3 className={`text-sm mb-1 ${!email.is_read ? "font-semibold text-gray-900" : "text-gray-800"}`}>
                    {email.subject}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {email.preview}
                  </p>

                  {/* AI Summary */}
                  {email.ai_summary && (
                    <div className="bg-purple-50 p-2 rounded text-xs mb-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Tag className="h-3 w-3 text-purple-600" />
                        <span className="font-medium text-purple-700">AI Summary:</span>
                      </div>
                      <p className="text-purple-600">{email.ai_summary}</p>
                    </div>
                  )}

                  {/* AI Tags */}
                  {email.ai_tags && email.ai_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {email.ai_tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
