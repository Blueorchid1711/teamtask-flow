import { useState, useEffect } from 'react';
import { Task, TaskAttachment, TaskComment } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { FileText, Image, File, Download, Send, Clock, User, Paperclip } from 'lucide-react';

interface TaskDetailDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit: boolean;
  currentUserId?: string;
  onRefresh: () => void;
}

export function TaskDetailDialog({ task, isOpen, onClose, canEdit, currentUserId, onRefresh }: TaskDetailDialogProps) {
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      fetchAttachments();
      fetchComments();
    }
  }, [task, isOpen]);

  const fetchAttachments = async () => {
    if (!task) return;
    const { data } = await supabase
      .from('task_attachments')
      .select('*')
      .eq('task_id', task.id)
      .order('uploaded_at', { ascending: false });
    setAttachments(data || []);
  };

  const fetchComments = async () => {
    if (!task) return;
    setLoading(true);
    const { data } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_id', task.id)
      .order('created_at', { ascending: true });
    
    // Fetch profiles separately
    const userIds = [...new Set((data || []).map(c => c.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', userIds);
    
    const profileMap = new Map((profilesData || []).map(p => [p.user_id, p]));
    const commentsWithProfiles = (data || []).map(comment => ({
      ...comment,
      profiles: profileMap.get(comment.user_id),
    })) as TaskComment[];
    
    setComments(commentsWithProfiles);
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !task || !currentUserId) return;

    setSubmitting(true);
    const { error } = await supabase.from('task_comments').insert({
      task_id: task.id,
      user_id: currentUserId,
      content: newComment.trim(),
    });

    if (error) {
      toast.error('Failed to add comment');
    } else {
      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    }
    setSubmitting(false);
  };

  const getFileIcon = (fileType: string | null) => {
    if (fileType?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType?.includes('pdf') || fileType?.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-2 border-foreground max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b-2 border-foreground pb-4">
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Task Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Deadline: {format(new Date(task.deadline), 'MMMM d, yyyy h:mm a')}
            </div>

            {task.profiles && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                Created by: {task.profiles.full_name}
              </div>
            )}

            <Badge 
              variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}
              className="border border-foreground"
            >
              {task.status.replace('_', ' ')}
            </Badge>

            {task.description && (
              <div className="p-3 bg-secondary/30 border border-foreground/20">
                <p className="text-sm whitespace-pre-wrap">{task.description}</p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </h3>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 border border-foreground/30 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getFileIcon(attachment.file_type)}
                      <span className="text-sm">{attachment.file_name}</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-3">
            <h3 className="font-semibold">Comments</h3>
            
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border border-dashed border-foreground/30">
                No comments yet
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-secondary/30 border border-foreground/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {comment.profiles?.full_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="border-2 border-foreground min-h-[60px]"
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="border-2 border-foreground shadow-xs"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
