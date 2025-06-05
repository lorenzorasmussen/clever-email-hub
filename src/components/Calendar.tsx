
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCalendar } from "@/hooks/useCalendar";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, isLoading } = useCalendar();

  const today = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Filter today's events
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
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
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

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
              {todaysEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No events scheduled for today</p>
                </div>
              ) : (
                todaysEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{formatTime(event.start_time)}</span>
                        <span>•</span>
                        <span>{getDuration(event.start_time, event.end_time)}</span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                    <Badge variant={event.event_type === "meeting" ? "default" : "secondary"}>
                      {event.event_type}
                    </Badge>
                  </div>
                ))
              )}
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
            <h3 className="font-semibold text-gray-900 mb-3">Upcoming Events</h3>
            <div className="space-y-2">
              {events
                .filter(event => new Date(event.start_time) > new Date())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="text-sm text-gray-600">
                    {new Date(event.start_time).toLocaleDateString()}: {event.title} ({formatTime(event.start_time)})
                  </div>
                ))}
              {events.filter(event => new Date(event.start_time) > new Date()).length === 0 && (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
