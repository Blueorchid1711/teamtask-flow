import { Task } from '@/types/database';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { isPast, isToday } from 'date-fns';

interface StatsChartProps {
  tasks: Task[];
}

export function StatsChart({ tasks }: StatsChartProps) {
  // Calculate stats
  const completedOnTime = tasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    return new Date(t.completed_at) <= new Date(t.deadline);
  }).length;

  const completedLate = tasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    return new Date(t.completed_at) > new Date(t.deadline);
  }).length;

  const pendingOnTime = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const deadline = new Date(t.deadline);
    return !isPast(deadline) || isToday(deadline);
  }).length;

  const overdue = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const deadline = new Date(t.deadline);
    return isPast(deadline) && !isToday(deadline);
  }).length;

  const data = [
    { name: 'Completed On Time', value: completedOnTime, color: 'hsl(var(--chart-2))' },
    { name: 'Completed Late', value: completedLate, color: 'hsl(var(--chart-4))' },
    { name: 'Pending', value: pendingOnTime, color: 'hsl(var(--chart-3))' },
    { name: 'Overdue', value: overdue, color: 'hsl(var(--destructive))' },
  ].filter(d => d.value > 0);

  const totalTasks = tasks.length;
  const completedTasks = completedOnTime + completedLate;

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No task data available</p>
        <p className="text-sm text-muted-foreground mt-1">Create tasks to see statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 border-2 border-foreground bg-secondary/20">
          <p className="text-2xl font-bold">{totalTasks}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Tasks</p>
        </div>
        <div className="p-3 border-2 border-foreground bg-secondary/20">
          <p className="text-2xl font-bold">{completedTasks}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
        </div>
        <div className="p-3 border-2 border-foreground bg-secondary/20">
          <p className="text-2xl font-bold text-chart-2">{completedOnTime}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">On Time</p>
        </div>
        <div className="p-3 border-2 border-foreground bg-destructive/10">
          <p className="text-2xl font-bold text-destructive">{overdue}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Overdue</p>
        </div>
      </div>

      {/* Pie Chart */}
      {data.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '2px solid hsl(var(--foreground))',
                  borderRadius: '0',
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Completion Rate */}
      <div className="p-3 border-2 border-foreground">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Completion Rate</span>
          <span className="font-mono font-bold">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 bg-secondary border border-foreground">
          <div 
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
