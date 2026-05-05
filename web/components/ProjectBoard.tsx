"use client";
// web/components/ProjectBoard.tsx
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useTeam } from '@/context/TeamContext';
import { AlertCircle, Clock, User as UserIcon, Plus, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
  };
}

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'DONE', title: 'Done', color: 'bg-green-50' },
];

export function ProjectBoard({ projectId }: { projectId: string }) {
  const { activeTeam } = useTeam();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    if (!activeTeam) return;
    try {
      const data = await apiFetch(`/tasks?projectId=${projectId}&teamId=${activeTeam.id}`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!activeTeam) return;
    try {
      const data = await apiFetch(`/teams/${activeTeam.id}`);
      setMembers(data.members.map((m: any) => ({ id: m.userId, name: m.user.name })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [projectId, activeTeam]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks(); // Refresh board
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam) return;
    setCreating(true);
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ 
            title: newTaskTitle, 
            projectId, 
            teamId: activeTeam.id,
            status: 'TODO',
            assigneeId: assigneeId || undefined
        }),
      });
      setNewTaskTitle('');
      setAssigneeId('');
      setIsCreating(false);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) return <div className="py-10 text-center text-slate-500">Loading board...</div>;

  return (
    <div className="space-y-6 h-full">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                required
                placeholder="Task Title"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsCreating(false)} className="text-sm font-bold text-slate-500 px-4 py-2">Cancel</button>
                <button type="submit" disabled={creating} className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex h-full space-x-6 overflow-x-auto pb-8">
        {columns.map((column) => (
          <div key={column.id} className="flex w-80 flex-shrink-0 flex-col">
            <div className="mb-4 flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {column.title} <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                  {tasks.filter((t) => t.status === column.id).length}
                </span>
              </h3>
            </div>

            <div className={clsx("flex-1 space-y-4 rounded-xl p-3", column.color)}>
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                      {task.priority === 'HIGH' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{task.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                          <UserIcon className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-600">
                          {task.assignee?.name || 'Unassigned'}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center text-[10px] text-slate-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Status Switcher (Action) */}
                    <div className="mt-4 flex space-x-2 border-t pt-3">
                      {columns
                        .filter((c) => c.id !== task.status)
                        .map((c) => (
                          <button
                            key={c.id}
                            onClick={() => updateTaskStatus(task.id, c.id)}
                            className="rounded px-2 py-1 text-[10px] font-bold text-slate-400 transition-colors hover:bg-slate-50 hover:text-blue-600"
                          >
                            Move to {c.title}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
