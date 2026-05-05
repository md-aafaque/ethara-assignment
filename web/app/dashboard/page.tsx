"use client";
// web/app/dashboard/page.tsx
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useTeam } from '@/context/TeamContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  myTasks: any[];
}

export default function DashboardPage() {
  const { activeTeam, teams, isLoading: teamsLoading } = useTeam();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const url = activeTeam ? `/dashboard?teamId=${activeTeam.id}` : '/dashboard';
        const data = await apiFetch(url);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!teamsLoading) {
      fetchStats();
    }
  }, [activeTeam, teamsLoading]);

  if (teamsLoading || isLoading) return <div className="flex h-full items-center justify-center text-slate-500">Loading your stats...</div>;

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="bg-blue-50 p-6 rounded-full">
          <ListTodo className="h-12 w-12 text-blue-600" />
        </div>
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Ethera AI</h1>
          <p className="text-slate-500 mt-2">To get started, you'll need to create or join a team. Teams are where projects and tasks live.</p>
        </div>
        <Link 
          href="/teams"
          className="flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Create your first team
        </Link>
      </div>
    );
  }

  const cards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Assigned to Me', value: stats?.myTasks.length || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here is what's happening in your teams.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
              <div className={`${card.bg} rounded-lg p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Tasks Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
          <Link href="/my-tasks" className="flex items-center text-sm font-medium text-blue-600 hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Task Title</th>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {stats?.myTasks.slice(0, 5).map((task: any) => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                  <td className="px-6 py-4">{task.project.name}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                      task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {stats?.myTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No tasks assigned to you yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
