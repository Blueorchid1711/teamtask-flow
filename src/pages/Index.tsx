import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckSquare, Users, BarChart3, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with deadlines and attachments',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Comment on tasks and see team progress in real-time',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Visual charts showing task completion and team performance',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Role-Based Access',
      description: 'Admin, Manager, and Employee roles with proper permissions',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-foreground shadow-xs bg-background">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
            </div>
            <Link to="/auth">
              <Button className="border-2 border-foreground shadow-sm hover:shadow-md">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Content */}
        <section className="py-20 border-b-2 border-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Task Management
              <br />
              <span className="text-muted-foreground">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A brutalist task tracker for teams. Manage tasks, track deadlines,
              collaborate with comments, and visualize progress with analytics.
            </p>
            <Link to="/auth">
              <Button size="lg" className="border-2 border-foreground shadow-md hover:shadow-lg text-lg px-8 py-6">
                Start Tracking
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border-2 border-foreground shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 p-3 border-2 border-foreground inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Role Permissions */}
        <section className="py-16 border-t-2 border-foreground bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Role Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 border-2 border-foreground bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Admin</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    View all tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Edit any task
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Delete any task
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Manage all users
                  </li>
                </ul>
              </div>

              <div className="p-6 border-2 border-foreground bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Manager</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    View all tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Edit own tasks only
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Comment on any task
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-4 h-4 text-center">—</span>
                    Tasks are private
                  </li>
                </ul>
              </div>

              <div className="p-6 border-2 border-foreground bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Employee</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    View peer tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Edit own tasks only
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Comment on tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Upload attachments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckSquare className="w-5 h-5" />
            <span className="font-bold">TaskFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Brutalist task management for modern teams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
