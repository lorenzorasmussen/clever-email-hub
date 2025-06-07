
import { Mail, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Email {
  id: string;
  sender: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  is_read: boolean;
  is_starred: boolean;
}

interface RecentEmailsWidgetProps {
  emails: Email[];
}

export const RecentEmailsWidget = ({ emails }: RecentEmailsWidgetProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Recent Emails
        </CardTitle>
        <CardDescription>Your latest email updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {email.subject}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  From: {email.sender}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={email.priority === 'high' ? 'destructive' : 'outline'} 
                    className="text-xs"
                  >
                    {email.priority}
                  </Badge>
                  {!email.is_read && (
                    <Badge variant="secondary" className="text-xs">
                      Unread
                    </Badge>
                  )}
                </div>
              </div>
              {email.is_starred && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
          ))}
          {emails.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No emails yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
