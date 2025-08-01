
import { useState } from "react";
import { Calendar as CalendarIcon, Mail, StickyNote, TrendingUp, Users, Clock, Star, ArrowUpRight, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoData } from "@/components/DemoDataProvider";

export const EnhancedDashboard = () => {
  const { demoData } = useDemoData();
  const { emails, events, notes } = demoData;

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
      .slice(0, 4);
  };

  const getRecentEmails = () => {
    return emails
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 4);
  };

  const getRecentNotes = () => {
    return notes
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Good morning! 👋</h1>
              <p className="text-muted-foreground">Here's what's happening with your productivity today.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Brain className="h-3 w-3" />
                AI Insights
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Unread Emails</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{unreadEmails}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                {starredEmails} starred
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Today's Events</CardTitle>
              <CalendarIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{todaysEvents}</div>
              <p className="text-xs text-muted-foreground">
                {events.length} total scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Active Notes</CardTitle>
              <StickyNote className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{notes.length}</div>
              <p className="text-xs text-muted-foreground">
                {pinnedNotes} pinned
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">AI Insights</CardTitle>
              <Sparkles className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">8</div>
              <p className="text-xs text-muted-foreground">
                Smart suggestions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Recent Emails Widget */}
          <Card className="col-span-1 bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Recent Emails
              </CardTitle>
              <CardDescription>Your latest messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {getRecentEmails().map((email) => (
                   <div key={email.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <p className="text-sm font-medium text-card-foreground truncate">
                           {email.subject}
                         </p>
                         {!email.is_read && (
                           <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                         )}
                       </div>
                       <p className="text-xs text-muted-foreground truncate">
                         {email.sender}
                       </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={email.priority === 'high' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {email.priority}
                        </Badge>
                        {email.ai_summary && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Brain className="h-2 w-2" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                    {email.is_starred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Widget */}
          <Card className="col-span-1 bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Your schedule ahead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {getUpcomingEvents().map((event) => (
                   <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                     <div className={`w-3 h-3 rounded-full mt-2 bg-blue-500`}></div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-card-foreground truncate">
                         {event.title}
                       </p>
                       <p className="text-xs text-muted-foreground mb-1">
                         {formatTime(event.start_time)}
                       </p>
                      <Badge variant="outline" className="text-xs">
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                ))}
                 {getUpcomingEvents().length === 0 && (
                   <div className="text-center py-8">
                     <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                     <p className="text-sm text-muted-foreground">No upcoming events</p>
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes Widget */}
          <Card className="col-span-1 bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-purple-600" />
                Recent Notes
              </CardTitle>
              <CardDescription>Your latest thoughts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                 {getRecentNotes().map((note) => (
                   <div key={note.id} className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 hover:shadow-sm transition-all cursor-pointer group">
                     <div className="flex items-start justify-between gap-2">
                       <h4 className="text-sm font-medium text-card-foreground line-clamp-1">
                         {note.title}
                       </h4>
                       {note.is_pinned && (
                         <Star className="h-3 w-3 text-muted-foreground fill-current" />
                       )}
                     </div>
                     {note.content && (
                       <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                         {note.content}
                       </p>
                     )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get things done faster with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                 <Mail className="h-6 w-6 text-blue-600" />
                 <span className="text-sm">Compose Email</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                 <CalendarIcon className="h-6 w-6 text-green-600" />
                 <span className="text-sm">New Event</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                 <StickyNote className="h-6 w-6 text-purple-600" />
                 <span className="text-sm">Quick Note</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                 <Brain className="h-6 w-6 text-amber-600" />
                 <span className="text-sm">AI Assist</span>
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
