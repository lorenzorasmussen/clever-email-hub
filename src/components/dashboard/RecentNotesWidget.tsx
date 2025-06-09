
import { StickyNote, Star, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content?: string;
  color: string;
  is_pinned: boolean;
  created_at: string;
}

interface RecentNotesWidgetProps {
  notes: Note[];
}

export const RecentNotesWidget = ({ notes }: RecentNotesWidgetProps) => {
  // Separate tasks and notes
  const tasks = notes.filter(note => 
    note.title.includes("☐") || note.title.includes("☑") || note.content?.includes("task:true")
  );
  const regularNotes = notes.filter(note => 
    !note.title.includes("☐") && !note.title.includes("☑") && !note.content?.includes("task:true")
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderTaskItem = (task: Note) => {
    const isCompleted = task.title.includes("☑");
    const priority = task.content?.match(/priority:(\w+)/)?.[1] || "medium";
    
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high": return "text-red-400 border-red-400/30";
        case "low": return "text-green-400 border-green-400/30";
        default: return "text-yellow-400 border-yellow-400/30";
      }
    };

    return (
      <div key={task.id} className="flex items-start gap-3 p-3 glass rounded-lg hover:bg-white/5 transition-colors">
        <div className="mt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          ) : (
            <Circle className="h-4 w-4 text-secondary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-sm font-medium line-clamp-1 break-words",
            isCompleted ? "line-through text-secondary" : "text-primary"
          )}>
            {task.title.replace(/^[☐☑]\s*/, "")}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <time className="text-xs text-secondary">
              {formatDate(task.created_at)}
            </time>
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
              {priority}
            </Badge>
          </div>
        </div>
        {task.is_pinned && (
          <Star className="h-3 w-3 text-yellow-400 fill-current mt-1" />
        )}
      </div>
    );
  };

  const renderNoteItem = (note: Note) => (
    <div key={note.id} className={`p-3 rounded-lg hover:bg-white/5 transition-colors ${note.color} glass`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-primary line-clamp-1 break-words">
          {note.title}
        </h4>
        {note.is_pinned && (
          <Star className="h-3 w-3 text-yellow-400 fill-current flex-shrink-0" />
        )}
      </div>
      {note.content && (
        <p className="text-xs text-secondary mt-1 line-clamp-2 break-words">
          {note.content}
        </p>
      )}
      <time className="text-xs text-secondary mt-2 block">
        {formatDate(note.created_at)}
      </time>
    </div>
  );

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          Recent Notes & Tasks
        </CardTitle>
        <CardDescription>Your latest thoughts and todo items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Tasks Section */}
        {tasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-secondary mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Recent Tasks ({tasks.length})
            </h4>
            <div className="space-y-2">
              {tasks.slice(0, 3).map(renderTaskItem)}
            </div>
          </div>
        )}

        {/* Recent Notes Section */}
        {regularNotes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-secondary mb-3 flex items-center gap-2">
              <StickyNote className="h-3 w-3" />
              Recent Notes ({regularNotes.length})
            </h4>
            <div className="space-y-2">
              {regularNotes.slice(0, 3).map(renderNoteItem)}
            </div>
          </div>
        )}

        {notes.length === 0 && (
          <div className="text-center py-6">
            <StickyNote className="h-12 w-12 text-secondary mx-auto mb-2 opacity-50" />
            <p className="text-sm text-primary">No notes or tasks yet</p>
            <p className="text-xs text-secondary">Create your first item to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
