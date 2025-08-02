
import { useState } from "react";
import { 
  Plus, Search, Filter, CheckCircle2, Circle, Star, Calendar, Tag, Trash2, 
  Edit3, MoreHorizontal, CalendarIcon, Download, Users, BarChart3, Clock,
  ArrowUpDown, FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const TaskNote = () => {
  const {
    tasks,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    createTask,
    updateTask,
    deleteTask,
    exportTasks,
    getProductivityMetrics
  } = useTaskManagement();

  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: null as Date | null,
    category: 'General',
    tags: [] as string[]
  });

  const metrics = getProductivityMetrics();

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      createTask({
        ...newTask,
        dueDate: newTask.dueDate?.toISOString() || null
      });
      setNewTask({
        title: '',
        content: '',
        priority: 'medium',
        dueDate: null,
        category: 'General',
        tags: []
      });
      setShowNewTask(false);
    }
  };

  const toggleTaskComplete = (taskId: string, isCompleted: boolean) => {
    updateTask(taskId, { isCompleted: !isCompleted });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border border-destructive/20';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const categories = ['General', 'Business', 'Development', 'Personal', 'Marketing'];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with metrics */}
      <div className="p-6 border-b border-border bg-background/95 backdrop-blur-xl">
        {/* Productivity Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.completionRate}%</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.completedTasks}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.pendingTasks}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.overdueTasks}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Tasks & Notes</h1>
            <p className="text-sm text-muted-foreground">Manage your work efficiently</p>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportTasks('json')}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportTasks('csv')}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task with details and due date
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Task description..."
                    value={newTask.content}
                    onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Set due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTask} className="flex-1">
                      Create Task
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTask(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 p-6 overflow-y-auto">
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "bg-card border border-border rounded-lg p-4 transition-all hover:shadow-md",
                  task.isCompleted && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id, task.isCompleted)}
                    className="mt-1 transition-colors hover:scale-110"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={cn(
                        "font-medium text-foreground",
                        task.isCompleted && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </h3>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {task.content && (
                      <p className="text-sm text-muted-foreground mt-1">{task.content}</p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      
                      <Badge variant="outline">
                        {task.category}
                      </Badge>
                      
                      {task.dueDate && (
                        <Badge variant="outline" className="text-orange-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), "MMM dd")}
                        </Badge>
                      )}
                      
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-card p-8 rounded-lg border border-border max-w-md mx-auto">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first task to get started with productivity tracking
              </p>
              <Button onClick={() => setShowNewTask(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
