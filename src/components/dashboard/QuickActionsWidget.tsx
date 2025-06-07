
import { Calendar as CalendarIcon, Mail, StickyNote, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const QuickActionsWidget = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get things done faster</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Mail className="h-6 w-6" />
            <span className="text-sm">Compose Email</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <CalendarIcon className="h-6 w-6" />
            <span className="text-sm">New Event</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <StickyNote className="h-6 w-6" />
            <span className="text-sm">Quick Note</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Users className="h-6 w-6" />
            <span className="text-sm">Schedule Meeting</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
