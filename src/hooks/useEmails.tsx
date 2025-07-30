
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Email = Tables<'emails'>;

export const useEmails = () => {
  const { user } = useAuth();
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', emailId);

      if (error) throw error;
      
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, is_read: true }
          : email
      ));
    } catch (error) {
      console.error('Error marking email as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark email as read",
        variant: "destructive"
      });
    }
  };

  const toggleStar = async (emailId: string, isStarred: boolean) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: !isStarred })
        .eq('id', emailId);

      if (error) throw error;
      
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, is_starred: !isStarred }
          : email
      ));
    } catch (error) {
      console.error('Error toggling star:', error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [user]);

  return {
    emails,
    isLoading,
    error,
    markAsRead,
    toggleStar,
  };
};
