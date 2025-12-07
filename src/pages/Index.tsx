import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckSquare, Users, BarChart3, Shield, ArrowRight, Zap, Clock, FileText } from 'lucide-react';

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
      icon: <CheckSquare className="w-8 h-8 text-primary" />,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with deadlines and attachments',
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Team Collaboration',
      description: 'Comment on tasks and see team progress in real-time',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: 'Analytics Dashboard',
      description: 'Visual charts showing task completion and team performance',
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Role-Based Access',
      description: 'Admin, Manager, and Employee roles with proper permissions',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '10K+', label: 'Tasks Managed' },
    { value: '500+', label: 'Teams' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg shadow-md">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
              <a href="#roles" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Roles</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">About</a>
            </nav>
            <Link to="/auth">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md font-semibold px-6">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full mb-6 shadow-lg">
                Enterprise Task Management
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Streamline Your
                <br />
                <span className="text-secondary">Workflow Today</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                A professional task management solution for modern teams. 
                Manage tasks, track deadlines, and visualize progress with powerful analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg text-lg px-8 py-6 font-semibold">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 font-semibold">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful features designed to help your team stay organized and productive
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="mb-5 p-4 bg-accent rounded-xl inline-block group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground mb-2">Lightning Fast</h3>
                  <p className="text-muted-foreground text-sm">Instant updates and real-time synchronization across all devices</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground mb-2">Deadline Tracking</h3>
                  <p className="text-muted-foreground text-sm">Never miss a deadline with smart reminders and notifications</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground mb-2">File Attachments</h3>
                  <p className="text-muted-foreground text-sm">Attach documents, images, and files directly to your tasks</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Role Permissions */}
        <section id="roles" className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Access Control</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
                Role-Based Permissions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Secure access control with customized permissions for every team member
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="relative p-8 bg-card rounded-xl border-2 border-primary shadow-lg">
                <div className="absolute -top-4 left-8">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Full Access
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div className="p-3 bg-primary rounded-lg">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">Admin</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">View all tasks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Edit any task</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Delete any task</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Manage all users</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-secondary rounded-lg">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">Manager</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">View all tasks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Edit own tasks only</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Comment on any task</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-5 h-5 text-center flex-shrink-0">—</span>
                    <span>Tasks are private</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-muted rounded-lg">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">Employee</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">View peer tasks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Edit own tasks only</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Comment on tasks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground">Upload attachments</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of teams already using TaskFlow to boost their productivity
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg text-lg px-10 py-6 font-semibold">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className="bg-foreground text-background py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <CheckSquare className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">TaskFlow</span>
              </div>
              <p className="text-background/70 mb-6 max-w-md">
                Professional task management for modern enterprises. 
                Streamline your workflow and boost team productivity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
                <li><a href="#roles" className="hover:text-background transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#about" className="hover:text-background transition-colors">About</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/50 text-sm">
            © 2024 TaskFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
