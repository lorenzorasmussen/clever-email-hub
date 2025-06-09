
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  content?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  dueDate?: string;
}

interface TasksWidgetProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
}

export const TasksWidget = ({ tasks, onTaskClick }: TasksWidgetProps) => {
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const overdueTasks = pendingTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date()
  );
  const todayTasks = pendingTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-yellow-400" />;
      default:
        return <Circle className="h-3 w-3 text-green-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400/30 bg-red-400/10 text-red-400';
      case 'medium': return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400';
      default: return 'border-green-400/30 bg-green-400/10 text-green-400';
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Task Overview
        </CardTitle>
        <CardDescription>Track your progress and upcoming deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 glass rounded-lg">
            <div className="text-2xl font-bold text-primary">{pendingTasks.length}</div>
            <div className="text-xs text-secondary">Pending</div>
          </div>
          <div className="text-center p-3 glass rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{todayTasks.length}</div>
            <div className="text-xs text-secondary">Due Today</div>
          </div>
          <div className="text-center p-3 glass rounded-lg">
            <div className="text-2xl font-bold text-red-400">{overdueTasks.length}</div>
            <div className="text-xs text-secondary">Overdue</div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-secondary">Upcoming Tasks</h4>
          {pendingTasks.slice(0, 5).map((task) => (
            <div 
              key={task.id} 
              className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              onClick={() => onTaskClick?.(task.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onTaskClick?.(task.id);
                }
              }}
            >
              <Circle className="h-4 w-4 text-secondary group-hover:text-primary transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate group-hover:text-white transition-colors">
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-secondary">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs border", getPriorityColor(task.priority))}
                >
                  <span className="flex items-center gap-1">
                    {getPriorityIcon(task.priority)}
                    {task.priority}
                  </span>
                </Badge>
              </div>
            </div>
          ))}
          
          {pendingTasks.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-primary font-medium">All caught up!</p>
              <p className="text-xs text-secondary">No pending tasks</p>
            </div>
          )}

          {pendingTasks.length > 5 && (
            <Button 
              variant="ghost" 
              className="w-full text-secondary hover:text-primary hover:bg-white/10"
              onClick={() => onTaskClick?.('view-all')}
            >
              View all {pendingTasks.length} tasks
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
