
import { Calendar as CalendarIcon, Mail, StickyNote, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  unreadEmails: number;
  starredEmails: number;
  todaysEvents: number;
  totalEvents: number;
  totalNotes: number;
  pinnedNotes: number;
}

export const DashboardStats = ({
  unreadEmails,
  starredEmails,
  todaysEvents,
  totalEvents,
  totalNotes,
  pinnedNotes
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unread Emails</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadEmails}</div>
          <p className="text-xs text-muted-foreground">
            {starredEmails} starred emails
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysEvents}</div>
          <p className="text-xs text-muted-foreground">
            {totalEvents} total events
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notes</CardTitle>
          <StickyNote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNotes}</div>
          <p className="text-xs text-muted-foreground">
            {pinnedNotes} pinned notes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productivity</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">
            +12% from last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
