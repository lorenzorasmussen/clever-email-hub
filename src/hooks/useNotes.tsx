
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  content: string | null;
  color: string;
  is_pinned: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Mock data until database types are updated
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome Note',
    content: 'This is your first note. Start creating!',
    color: 'bg-yellow-100',
    is_pinned: false,
    user_id: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>(mockNotes);

  const createNote = (noteData: { title: string; content: string; color?: string }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      color: noteData.color || 'bg-yellow-100',
      is_pinned: false,
      user_id: user?.id || 'demo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
    toast({
      title: "Success",
      description: "Note created successfully",
    });
  };

  const updateNote = ({ id, updates }: { id: string; updates: Partial<Note> }) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updated_at: new Date().toISOString() }
        : note
    ));
    toast({
      title: "Success",
      description: "Note updated successfully",
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Success",
      description: "Note deleted successfully",
    });
  };

  const togglePin = ({ id, isPinned }: { id: string; isPinned: boolean }) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, is_pinned: !isPinned, updated_at: new Date().toISOString() }
        : note
    ));
  };

  return {
    notes,
    isLoading: false,
    error: null,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  };
};
