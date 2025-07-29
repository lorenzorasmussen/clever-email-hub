
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string | null;
  content: string | null;
  time: string;
  is_read: boolean;
  is_starred: boolean;
  priority: 'high' | 'medium' | 'low';
  ai_summary: string | null;
  ai_tags: string[] | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Mock data until database types are updated
const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'demo@example.com',
    subject: 'Welcome to the platform',
    preview: 'Thank you for joining us...',
    content: 'Welcome to our platform! We are excited to have you.',
    time: new Date().toISOString(),
    is_read: false,
    is_starred: false,
    priority: 'medium',
    ai_summary: null,
    ai_tags: null,
    user_id: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useEmails = () => {
  const { user } = useAuth();
  const [emails, setEmails] = useState<Email[]>(mockEmails);

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, is_read: true, updated_at: new Date().toISOString() }
        : email
    ));
  };

  const toggleStar = (emailId: string, isStarred: boolean) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, is_starred: !isStarred, updated_at: new Date().toISOString() }
        : email
    ));
  };

  return {
    emails,
    isLoading: false,
    error: null,
    markAsRead,
    toggleStar,
  };
};
