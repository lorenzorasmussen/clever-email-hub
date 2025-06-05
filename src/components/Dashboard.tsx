
import { useState } from "react";
import { Calendar as CalendarIcon, Mail, StickyNote, TrendingUp, Users, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEmails } from "@/hooks/useEmails";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotes } from "@/hooks/useNotes";

export const Dashboard = () => {
  const { emails, isLoading: emailsLoading } = useEmails();
  const { events, isLoading: eventsLoading } = useCalendar();
  const { notes, isLoading: notesLoading } = useNotes();

  // Calculate stats
  const unreadEmails = emails.filter(email => !email.is_read).length;
  const starredEmails = emails.filter(email => email.is_starred).length;
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).length;
  const pinnedNotes = notes.filter(note => note.is_pinned).length;

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start_time) > now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 3);
  };

  const getRecentEmails = () => {
    return emails
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 3);
  };

  const getRecentNotes = () => {
    return notes
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  };

  if (emailsLoading || eventsLoading || notesLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
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
                {events.length} total events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
              <StickyNote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notes.length}</div>
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

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Emails Widget */}
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
                {getRecentEmails().map((email) => (
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

          {/* Upcoming Events Widget */}
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
                {getUpcomingEvents().map((event) => (
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
                {getUpcomingEvents().length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes Widget */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Recent Notes
              </CardTitle>
              <CardDescription>Your latest thoughts and ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentNotes().map((note) => (
                  <div key={note.id} className={`p-3 rounded-lg ${note.color} hover:shadow-sm transition-shadow`}>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {note.title}
                      </h4>
                      {note.is_pinned && (
                        <Star className="h-3 w-3 text-gray-600 fill-current" />
                      )}
                    </div>
                    {note.content && (
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                        {note.content}
                      </p>
                    )}
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No notes yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
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
      </div>
    </div>
  );
};
