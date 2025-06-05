
import { ArrowLeft, Star, Archive, Trash2, Reply, Forward, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Email } from "@/hooks/useEmails";

interface EmailViewProps {
  email: Email;
  onBack: () => void;
}

export const EmailView = ({ email, onBack }: EmailViewProps) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" size="sm">
              <Star className={`h-4 w-4 ${email.is_starred ? "text-yellow-500 fill-current" : ""}`} />
            </Button>
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

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">{email.subject}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">From: {email.sender}</span>
            <span className="text-sm text-gray-500">{formatTime(email.time)}</span>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {(email.ai_summary || (email.ai_tags && email.ai_tags.length > 0)) && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-600" />
            AI Insights
          </h3>
          <div className="space-y-2">
            {email.ai_summary && (
              <div>
                <span className="text-sm font-medium text-gray-700">Summary: </span>
                <span className="text-sm text-gray-600">{email.ai_summary}</span>
              </div>
            )}
            {email.ai_tags && email.ai_tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                {email.ai_tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="prose max-w-none">
          {email.content ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {email.content}
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed">
              {email.preview || "No content available for this email."}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Button>
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline">
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
};
