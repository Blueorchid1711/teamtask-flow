import { useState, useRef } from 'react';
import { Task, TaskStatus } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { format } from 'date-fns';

interface TaskFormProps {
  task?: Task | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'pending');
  const [deadline, setDeadline] = useState(
    task?.deadline 
      ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm")
  );
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const uploadFiles = async (taskId: string) => {
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${taskId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('task-attachments')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('task-attachments')
        .getPublicUrl(fileName);

      await supabase.from('task_attachments').insert({
        task_id: taskId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);

    try {
      if (task) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: title.trim(),
            description: description.trim() || null,
            status,
            deadline: new Date(deadline).toISOString(),
            completed_at: status === 'completed' ? new Date().toISOString() : null,
          })
          .eq('id', task.id);

        if (error) throw error;

        // Upload new files
        if (files.length > 0) {
          setUploading(true);
          await uploadFiles(task.id);
        }

        toast.success('Task updated!');
      } else {
        // Create new task
        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert({
            user_id: user!.id,
            title: title.trim(),
            description: description.trim() || null,
            status,
            deadline: new Date(deadline).toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        // Upload files
        if (files.length > 0 && newTask) {
          setUploading(true);
          await uploadFiles(newTask.id);
        }

        toast.success('Task created!');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="border-2 border-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          className="border-2 border-foreground min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
            <SelectTrigger className="border-2 border-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-foreground">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border-2 border-foreground"
            required
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Attachments</Label>
        <div 
          className="border-2 border-dashed border-foreground/50 p-4 text-center cursor-pointer hover:border-foreground transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload files (images, PDFs, docs)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2 mt-2">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 border border-foreground/30 bg-secondary/30"
              >
                <div className="flex items-center gap-2 truncate">
                  {getFileIcon(file)}
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-foreground/20">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-2 border-foreground"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="flex-1 border-2 border-foreground shadow-xs hover:shadow-sm"
        >
          {saving ? (uploading ? 'Uploading...' : 'Saving...') : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
