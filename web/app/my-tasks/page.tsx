"use client";
// web/app/my-tasks/page.tsx
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useTeam } from '@/context/TeamContext';
import { ListChecks, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  project: { name: string };
  priority: string;
  dueDate: string;
  status: string;
}

export default function MyTasksPage() {
  const { activeTeam, isLoading: teamsLoading } = useTeam();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyTasks() {
      setIsLoading(true);
      try {
        const url = activeTeam ? `/dashboard?teamId=${activeTeam.id}` : '/dashboard';
        const data = await apiFetch(url);
        setTasks(data.myTasks);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!teamsLoading) {
      fetchMyTasks();
    }
  }, [activeTeam, teamsLoading]);

  if (teamsLoading || isLoading) return <div className="text-slate-500">Loading your tasks...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
        <p className="text-slate-500">
          {activeTeam 
            ? `Tasks assigned to you in ${activeTeam.name}.`
            : "All tasks assigned to you across all teams."}
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
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
              {tasks.map((task) => (
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
              {tasks.length === 0 && (
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
