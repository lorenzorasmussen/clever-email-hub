
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Note = Tables<'notes'>;

export const useNotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData: { title: string; content?: string; tags?: string[] }) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      
      return data;
    } catch (err) {
      console.error('Error creating note:', err);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === id ? data : note
      ));
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      
      return data;
    } catch (err) {
      console.error('Error updating note:', err);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting note:', err);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
};
