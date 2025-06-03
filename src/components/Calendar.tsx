
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: "meeting" | "reminder" | "event";
  color: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    time: "9:00 AM",
    duration: "30 min",
    type: "meeting",
    color: "bg-blue-500"
  },
  {
    id: "2",
    title: "Project Review",
    time: "2:00 PM",
    duration: "1 hour",
    type: "meeting",
    color: "bg-green-500"
  },
  {
    id: "3",
    title: "Client Call",
    time: "4:00 PM",
    duration: "45 min",
    type: "meeting",
    color: "bg-purple-500"
  },
  {
    id: "4",
    title: "Deadline Reminder",
    time: "6:00 PM",
    duration: "",
    type: "reminder",
    color: "bg-red-500"
  }
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            Calendar
          </h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-medium text-gray-900">{formatDate(currentDate)}</h2>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Today's Schedule */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Today's Schedule</h3>
            <div className="space-y-3">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{event.time}</span>
                      {event.duration && (
                        <>
                          <span>•</span>
                          <span>{event.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant={event.type === "meeting" ? "default" : "secondary"}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">Schedule Meeting</h4>
              <p className="text-sm text-gray-600">Quickly schedule a new meeting with AI assistance</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">Find Free Time</h4>
              <p className="text-sm text-gray-600">AI-powered scheduling suggestions</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">This Week</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Tomorrow: Board Meeting (10:00 AM)</div>
              <div className="text-sm text-gray-600">Wednesday: Product Demo (3:00 PM)</div>
              <div className="text-sm text-gray-600">Friday: Team Retrospective (1:00 PM)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
