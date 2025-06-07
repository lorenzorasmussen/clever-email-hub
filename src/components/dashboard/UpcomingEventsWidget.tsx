
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  start_time: string;
  event_type: string;
  color: string;
}

interface UpcomingEventsWidgetProps {
  events: Event[];
}

export const UpcomingEventsWidget = ({ events }: UpcomingEventsWidgetProps) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
        <CardDescription>Your schedule for today and beyond</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
              <div className={`w-3 h-3 rounded-full mt-2 ${event.color}`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.title}
                </p>
                <p className="text-xs text-gray-600">
                  {formatTime(event.start_time)}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {event.event_type}
                </Badge>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No upcoming events
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
