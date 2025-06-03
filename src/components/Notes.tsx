import { useState } from "react";
import { Plus, Search, Pin, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  createdAt: string;
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes - Q4 Planning",
    content: "Key discussion points:\n- Budget allocation for next quarter\n- New team member onboarding\n- Product roadmap updates\n- Marketing strategy review",
    color: "bg-yellow-100",
    isPinned: true,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "AI Features Ideas",
    content: "Brainstorming session results:\n- Smart email categorization\n- Automated response suggestions\n- Calendar conflict detection\n- Priority inbox sorting",
    color: "bg-blue-100",
    isPinned: false,
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    title: "Shopping List",
    content: "Groceries:\n- Milk\n- Eggs\n- Bread\n- Fruits\n- Vegetables\n- Coffee",
    color: "bg-green-100",
    isPinned: false,
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    title: "Book Recommendations",
    content: "Must read:\n- 'The Pragmatic Programmer'\n- 'Clean Code'\n- 'Designing Data-Intensive Applications'\n- 'The Phoenix Project'",
    color: "bg-purple-100",
    isPinned: true,
    createdAt: "2024-01-12"
  }
];

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  const handleCreateNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title || "Untitled",
        content: newNote.content,
        color: "bg-yellow-100",
        isPinned: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "" });
      setShowNewNote(false);
    }
  };

  const togglePin = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
          <Button onClick={() => setShowNewNote(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <div className="p-4 border-b border-gray-200 bg-yellow-50">
          <div className="space-y-3">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Start typing your note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateNote}>Save</Button>
              <Button variant="outline" onClick={() => setShowNewNote(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Pin className="h-4 w-4" />
              Pinned
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onTogglePin={togglePin} />
              ))}
            </div>
          </div>
        )}

        {/* Other Notes */}
        {unpinnedNotes.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Others
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onTogglePin={togglePin} />
              ))}
            </div>
          </div>
        )}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notes found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  onTogglePin: (noteId: string) => void;
}

const NoteCard = ({ note, onTogglePin }: NoteCardProps) => {
  return (
    <div className={`${note.color} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">{note.title}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
        >
          <Pin className={`h-4 w-4 ${note.isPinned ? "fill-current" : ""}`} />
        </Button>
      </div>
      <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap mb-3">
        {note.content}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{note.createdAt}</span>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Palette className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
