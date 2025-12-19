import { useState } from 'react';
import { Task, AppRole } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isPast, isToday } from 'date-fns';
import { Edit, Trash2, Clock, CheckCircle, AlertTriangle, PlayCircle, MessageSquare, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TaskDetailDialog } from './TaskDetailDialog';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  canEdit: (task: Task) => boolean;
  onRefresh: () => void;
  currentUserId?: string;
  userRole: AppRole | null;
}

export function TaskList({ tasks, loading, onEdit, canEdit, onRefresh, currentUserId, userRole }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setDeletingId(taskId);
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    
    if (error) {
      toast.error('Failed to delete task');
    } else {
      toast.success('Task deleted');
      onRefresh();
    }
    setDeletingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && isPast(new Date(task.deadline)) && !isToday(new Date(task.deadline));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-secondary-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border-2 border-foreground/20 animate-pulse">
            <div className="h-4 bg-muted w-1/3 mb-2"></div>
            <div className="h-3 bg-muted w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30">
        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">No tasks yet</p>
        <p className="text-muted-foreground text-sm">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => {
          const overdue = isOverdue(task);
          const canEditThis = canEdit(task);
          const isOwn = task.user_id === currentUserId;
          
          return (
            <div
              key={task.id}
              className={`p-4 border-2 border-foreground transition-all hover:shadow-sm cursor-pointer ${
                overdue ? 'bg-destructive/5' : ''
              } ${isOwn ? 'border-l-4' : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{task.title}</h3>
                    {isOwn && (
                      <Badge variant="outline" className="text-xs border border-foreground">
                        Your Task
                      </Badge>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getStatusVariant(overdue ? 'overdue' : task.status)} className="gap-1 border border-foreground">
                      {getStatusIcon(overdue ? 'overdue' : task.status)}
                      {overdue ? 'Overdue' : task.status.replace('_', ' ')}
                    </Badge>
                    
                    <span className={`text-xs flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-3 h-3" />
                      {getPriorityLabel(task.priority)}
                    </span>
                    
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(task.deadline), 'MMM d, yyyy')}
                    </span>

                    {task.profiles && (
                      <span className="text-xs text-muted-foreground">
                        by {task.profiles.full_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedTask(task)}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  
                  {canEditThis && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(task)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingId === task.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TaskDetailDialog
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        canEdit={selectedTask ? canEdit(selectedTask) : false}
        currentUserId={currentUserId}
        onRefresh={onRefresh}
      />
    </>
  );
}
