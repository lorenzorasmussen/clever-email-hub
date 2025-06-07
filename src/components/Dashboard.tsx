
import { useEmails } from "@/hooks/useEmails";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotes } from "@/hooks/useNotes";
import { DashboardStats } from "./dashboard/DashboardStats";
import { RecentEmailsWidget } from "./dashboard/RecentEmailsWidget";
import { UpcomingEventsWidget } from "./dashboard/UpcomingEventsWidget";
import { RecentNotesWidget } from "./dashboard/RecentNotesWidget";
import { QuickActionsWidget } from "./dashboard/QuickActionsWidget";

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

        <DashboardStats
          unreadEmails={unreadEmails}
          starredEmails={starredEmails}
          todaysEvents={todaysEvents}
          totalEvents={events.length}
          totalNotes={notes.length}
          pinnedNotes={pinnedNotes}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <RecentEmailsWidget emails={getRecentEmails()} />
          <UpcomingEventsWidget events={getUpcomingEvents()} />
          <RecentNotesWidget notes={getRecentNotes()} />
        </div>

        <QuickActionsWidget />
      </div>
    </div>
  );
};
