
import { ArrowLeft, Star, Archive, Trash2, Reply, Forward, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmailViewProps {
  email: any;
  onBack: () => void;
}

export const EmailView = ({ email, onBack }: EmailViewProps) => {
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
              <Star className="h-4 w-4" />
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
            <span className="text-sm text-gray-500">{email.time}</span>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Tag className="h-4 w-4 text-purple-600" />
          AI Insights
        </h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Summary: </span>
            <span className="text-sm text-gray-600">{email.aiSummary}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
            {email.aiTags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            Hi team,
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            I wanted to share the latest updates on our Q4 project milestones. We've made significant progress across all workstreams and are on track to meet our key deliverables.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            <strong>Key Achievements:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Completed user interface redesign (95% done)</li>
            <li>Finished backend API integration</li>
            <li>Successfully tested on staging environment</li>
            <li>Documentation updated and reviewed</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            <strong>Next Steps:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Final user acceptance testing (UAT)</li>
            <li>Security audit completion</li>
            <li>Production deployment planning</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Please let me know if you have any questions or concerns. We'll have our next project review meeting this Friday at 2 PM.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Best regards,<br />
            John Doe
          </p>
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
