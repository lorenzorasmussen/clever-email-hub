
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

export const useEmails = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: emails = [], isLoading, error } = useQuery({
    queryKey: ['emails', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }

      return data as Email[];
    },
    enabled: !!user,
  });

  const updateEmailMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Email> }) => {
      const { error } = await supabase
        .from('emails')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error) => {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    },
  });

  const markAsRead = (emailId: string) => {
    updateEmailMutation.mutate({ id: emailId, updates: { is_read: true } });
  };

  const toggleStar = (emailId: string, isStarred: boolean) => {
    updateEmailMutation.mutate({ id: emailId, updates: { is_starred: !isStarred } });
  };

  return {
    emails,
    isLoading,
    error,
    markAsRead,
    toggleStar,
  };
};
