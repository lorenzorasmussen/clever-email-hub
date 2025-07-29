
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  event_type: 'meeting' | 'reminder' | 'event';
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Mock data until database types are updated
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    event_type: 'meeting',
    color: 'blue',
    user_id: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  const createEvent = (eventData: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
      user_id: user?.id || 'demo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Success",
      description: "Event created successfully",
    });
  };

  const updateEvent = ({ id, updates }: { id: string; updates: Partial<CalendarEvent> }) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...updates, updated_at: new Date().toISOString() }
        : event
    ));
    toast({
      title: "Success",
      description: "Event updated successfully",
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  return {
    events,
    isLoading: false,
    error: null,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  };
};
