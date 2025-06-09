import { useState } from "react";
import { Plus, Search, Filter, CheckCircle2, Circle, Star, Calendar, Tag, Trash2, Edit3, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNotes } from "@/hooks/useNotes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskNoteProps {
  className?: string;
}

export const TaskNote = ({ className }: TaskNoteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "tasks" | "notes" | "completed">("all");
  const [showNewItem, setShowNewItem] = useState(false);
  const [newItemType, setNewItemType] = useState<"note" | "task">("note");
  const [newItem, setNewItem] = useState({ 
    title: "", 
    content: "", 
    isTask: false, 
    isCompleted: false,
    priority: "medium" as "low" | "medium" | "high",
    tags: [] as string[]
  });
  
  const { notes, isLoading, createNote, updateNote, deleteNote, togglePin } = useNotes();

  // Enhanced filtering
  const filteredItems = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case "tasks":
        return note.content?.includes("task:") || note.title.includes("☐") || note.title.includes("☑");
      case "notes":
        return !note.content?.includes("task:") && !note.title.includes("☐") && !note.title.includes("☑");
      case "completed":
        return note.title.includes("☑") || note.content?.includes("completed:true");
      default:
        return true;
    }
  });

  const pinnedItems = filteredItems.filter(item => item.is_pinned);
  const unpinnedItems = filteredItems.filter(item => !item.is_pinned);

  const handleCreateItem = () => {
    if (newItem.title.trim() || newItem.content.trim()) {
      const taskPrefix = newItemType === "task" ? "☐ " : "";
      const taskMetadata = newItemType === "task" ? 
        `\n\ntask:true\npriority:${newItem.priority}\ncompleted:false` : "";
      
      createNote({
        title: taskPrefix + (newItem.title || "Untitled"),
        content: newItem.content + taskMetadata,
        color: newItemType === "task" ? "bg-blue-50 border-l-4 border-l-blue-400" : "bg-yellow-50"
      });
      
      setNewItem({ 
        title: "", 
        content: "", 
        isTask: false, 
        isCompleted: false,
        priority: "medium",
        tags: []
      });
      setShowNewItem(false);
    }
  };

  const toggleTaskComplete = (item: any) => {
    const isCompleted = item.title.includes("☑");
    const newTitle = isCompleted 
      ? item.title.replace("☑", "☐")
      : item.title.replace("☐", "☑");
    
    const newContent = item.content?.replace(
      /completed:(true|false)/,
      `completed:${!isCompleted}`
    ) || "";

    updateNote({
      id: item.id,
      updates: { 
        title: newTitle,
        content: newContent,
        color: isCompleted ? "bg-blue-50 border-l-4 border-l-blue-400" : "bg-green-50 border-l-4 border-l-green-400"
      }
    });
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full", className)} role="main" aria-label="Tasks and Notes">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-primary">Tasks & Notes</h1>
            <Button aria-label="Create new item">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" role="status" aria-live="polite">
            <div className="loading-spinner mx-auto mb-4" aria-hidden="true"></div>
            <p className="text-secondary">Loading your tasks and notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)} role="main" aria-label="Tasks and Notes">
      {/* Enhanced Header with better contrast */}
      <header className="p-6 border-b border-white/10 glass">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Tasks & Notes</h1>
            <p className="text-sm text-secondary mt-1">Organize your thoughts and track your progress</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="btn-primary" aria-label="Create new item">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border border-white/20">
              <DropdownMenuItem 
                onClick={() => {
                  setNewItemType("note");
                  setShowNewItem(true);
                }}
                className="text-primary hover:bg-white/10"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                New Note
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setNewItemType("task");
                  setShowNewItem(true);
                }}
                className="text-primary hover:bg-white/10"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                New Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" aria-hidden="true" />
            <Input
              placeholder="Search tasks and notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-white/20 text-primary placeholder:text-secondary focus:border-white/40"
              aria-label="Search tasks and notes"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {["all", "tasks", "notes", "completed"].map((filter) => (
              <Button
                key={filter}
                variant={filterType === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType(filter as any)}
                className={cn(
                  "capitalize transition-all duration-200",
                  filterType === filter 
                    ? "btn-primary" 
                    : "text-secondary hover:text-primary hover:bg-white/10"
                )}
                aria-pressed={filterType === filter}
                aria-label={`Filter by ${filter}`}
              >
                <Filter className="h-3 w-3 mr-1" aria-hidden="true" />
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* New Item Form with better accessibility */}
      {showNewItem && (
        <div className="p-6 border-b border-white/10 glass-card" role="dialog" aria-labelledby="new-item-title">
          <h2 id="new-item-title" className="text-lg font-medium text-primary mb-3">
            Create New {newItemType === "task" ? "Task" : "Note"}
          </h2>
          <div className="space-y-3">
            <Input
              placeholder={`${newItemType === "task" ? "Task" : "Note"} title...`}
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="glass border-white/20 text-primary placeholder:text-secondary"
              aria-label={`${newItemType === "task" ? "Task" : "Note"} title`}
            />
            <Textarea
              placeholder={`Add ${newItemType === "task" ? "task details" : "note content"}...`}
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              rows={4}
              className="glass border-white/20 text-primary placeholder:text-secondary"
              aria-label={`${newItemType === "task" ? "Task" : "Note"} content`}
            />
            {newItemType === "task" && (
              <div className="flex gap-2">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer border-white/20 text-secondary hover:border-white/40"
                  onClick={() => setNewItem({ ...newItem, priority: newItem.priority === "low" ? "medium" : newItem.priority === "medium" ? "high" : "low" })}
                >
                  Priority: {newItem.priority}
                </Badge>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleCreateItem} className="btn-primary">
                Create {newItemType === "task" ? "Task" : "Note"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowNewItem(false)}
                className="text-secondary hover:text-primary hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Items Grid */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Pinned Items */}
        {pinnedItems.length > 0 && (
          <section className="mb-8" aria-labelledby="pinned-section">
            <h2 id="pinned-section" className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
              Pinned Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onTogglePin={togglePin}
                  onToggleComplete={toggleTaskComplete}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          </section>
        )}

        {/* Other Items */}
        {unpinnedItems.length > 0 && (
          <section aria-labelledby="other-section">
            <h2 id="other-section" className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              {filterType === "all" ? "All Items" : 
               filterType === "tasks" ? "Tasks" :
               filterType === "notes" ? "Notes" : "Completed Items"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpinnedItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onTogglePin={togglePin}
                  onToggleComplete={toggleTaskComplete}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          </section>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12" role="status">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-primary text-lg mb-2">No items found</p>
              <p className="text-secondary mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Create your first task or note to get started!"}
              </p>
              <Button 
                onClick={() => setShowNewItem(true)} 
                className="btn-primary"
                aria-label="Create your first item"
              >
                <Plus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    content: string | null;
    color: string;
    is_pinned: boolean;
    created_at: string;
  };
  onTogglePin: (args: { id: string; isPinned: boolean }) => void;
  onToggleComplete: (item: any) => void;
  onDelete: (id: string) => void;
}

const ItemCard = ({ item, onTogglePin, onToggleComplete, onDelete }: ItemCardProps) => {
  const isTask = item.title.includes("☐") || item.title.includes("☑");
  const isCompleted = item.title.includes("☑");
  const priority = item.content?.match(/priority:(\w+)/)?.[1] || "medium";
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 border-red-400/30";
      case "low": return "text-green-400 border-green-400/30";
      default: return "text-yellow-400 border-yellow-400/30";
    }
  };

  return (
    <article 
      className={cn(
        "glass-card p-4 transition-all duration-300 hover:shadow-xl group",
        isCompleted && "opacity-75",
        item.color
      )}
      role="article"
      aria-labelledby={`item-title-${item.id}`}
    >
      <header className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {isTask && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(item);
              }}
              className="mt-1 transition-colors duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded"
              aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <Circle className="h-5 w-5 text-secondary hover:text-primary" />
              )}
            </button>
          )}
          <h3 
            id={`item-title-${item.id}`}
            className={cn(
              "font-medium text-primary line-clamp-2 break-words",
              isCompleted && "line-through text-secondary"
            )}
          >
            {item.title.replace(/^[☐☑]\s*/, "")}
          </h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-white/10"
              aria-label="Item options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass border border-white/20">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin({ id: item.id, isPinned: item.is_pinned });
              }}
              className="text-primary hover:bg-white/10"
            >
              <Star className={cn("h-4 w-4 mr-2", item.is_pinned && "fill-current text-yellow-400")} />
              {item.is_pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {item.content && (
        <div className="mb-3">
          <p className="text-sm text-secondary line-clamp-3 whitespace-pre-wrap break-words">
            {item.content.replace(/\n\ntask:.*$/s, "")}
          </p>
        </div>
      )}

      <footer className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <time 
            dateTime={item.created_at}
            className="text-secondary"
          >
            {formatDate(item.created_at)}
          </time>
          {isTask && (
            <Badge 
              variant="outline" 
              className={cn("text-xs", getPriorityColor(priority))}
              aria-label={`Priority: ${priority}`}
            >
              {priority}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {isTask && (
            <Tag className="h-3 w-3 text-blue-400" aria-label="Task" />
          )}
          {item.is_pinned && (
            <Star className="h-3 w-3 text-yellow-400 fill-current" aria-label="Pinned" />
          )}
        </div>
      </footer>
    </article>
  );
};
