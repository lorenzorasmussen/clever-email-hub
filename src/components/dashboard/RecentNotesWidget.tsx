
import { StickyNote, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Note {
  id: string;
  title: string;
  content?: string;
  color: string;
  is_pinned: boolean;
}

interface RecentNotesWidgetProps {
  notes: Note[];
}

export const RecentNotesWidget = ({ notes }: RecentNotesWidgetProps) => {
  return (
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
          {notes.map((note) => (
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
  );
};
