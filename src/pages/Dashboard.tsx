import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Task, Profile } from '@/types/database';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { StatsChart } from '@/components/StatsChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LogOut, Plus, CheckSquare, Shield, Briefcase, Users, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchProfiles();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) {
      toast.error('Failed to load tasks');
    } else {
      // Fetch profiles separately and merge
      const userIds = [...new Set((data || []).map(t => t.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);
      
      const profileMap = new Map((profilesData || []).map(p => [p.user_id, p]));
      const tasksWithProfiles = (data || []).map(task => ({
        ...task,
        profiles: profileMap.get(task.user_id) || undefined,
      })) as Task[];
      
      setTasks(tasksWithProfiles);
    }
    setLoadingTasks(false);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (!error && data) {
      setProfiles(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleTaskCreated = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleEditTask = (task: Task) => {
    if (role !== 'admin' && task.user_id !== user?.id) {
      toast.error('You can only edit your own tasks');
      return;
    }
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const canEditTask = (task: Task) => {
    return role === 'admin' || task.user_id === user?.id;
  };

  const roleIcons = {
    admin: <Shield className="w-4 h-4" />,
    manager: <Briefcase className="w-4 h-4" />,
    employee: <Users className="w-4 h-4" />,
  };

  const roleLabels = {
    admin: 'Admin',
    manager: 'Manager',
    employee: 'Employee',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-xl font-mono">Loading...</div>
      </div>
    );
  }

  // Filter tasks for chart (only employees, not managers)
  const employeeTasks = tasks.filter(task => {
    // In a real app, you'd check the user's role, but for now we show all
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-foreground shadow-xs bg-background">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
            </div>

            <div className="flex items-center gap-4">
              {role && (
                <Badge variant="outline" className="border-2 border-foreground px-3 py-1 gap-2">
                  {roleIcons[role]}
                  {roleLabels[role]}
                </Badge>
              )}
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-2 border-foreground shadow-xs hover:shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-foreground shadow-sm">
              <CardHeader className="border-b-2 border-foreground">
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  Task Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <StatsChart tasks={tasks} />
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-foreground shadow-sm">
              <CardHeader className="border-b-2 border-foreground">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Tasks
                  </CardTitle>
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setEditingTask(null)}
                        className="border-2 border-foreground shadow-xs hover:shadow-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-2 border-foreground max-w-2xl">
                      <DialogHeader className="border-b-2 border-foreground pb-4">
                        <DialogTitle>
                          {editingTask ? 'Edit Task' : 'Create New Task'}
                        </DialogTitle>
                      </DialogHeader>
                      <TaskForm 
                        task={editingTask} 
                        onSuccess={handleTaskCreated}
                        onCancel={() => {
                          setIsFormOpen(false);
                          setEditingTask(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TaskList 
                  tasks={tasks}
                  loading={loadingTasks}
                  onEdit={handleEditTask}
                  canEdit={canEditTask}
                  onRefresh={fetchTasks}
                  currentUserId={user?.id}
                  userRole={role}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
