"use client";
// web/app/projects/page.tsx
import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { Plus, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  tasks: number;
}

export default function ProjectsPage() {
  const { activeTeam, isLoading: teamsLoading } = useTeam();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  
  useEffect(() => {
    if (activeTeam) {
      async function fetchProjects() {
        setIsLoading(true);
        try {
          const data = await apiFetch(`/projects?teamId=${activeTeam.id}`);
          setProjects(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProjects();
    }
  }, [activeTeam]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam) return;
    setIsCreating(true);
    try {
      const newProject = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: projectName, teamId: activeTeam.id }),
      });
      setProjectName('');
      setIsCreating(false);
      setProjects((prev) => [newProject, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (teamsLoading) return <div className="flex h-full items-center justify-center text-slate-500">Loading...</div>;

  if (!activeTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full text-slate-400">
          <Briefcase className="h-12 w-12" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">No team selected</h2>
          <p className="text-slate-500 mt-1">Please select a team from the header to view its projects.</p>
        </div>
        <Link href="/teams" className="text-blue-600 font-medium hover:underline">Manage Teams</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500">Manage {activeTeam.name}'s work buckets.</p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                required
                placeholder="Project Name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsCreating(false)} className="text-sm font-bold text-slate-500 px-4 py-2">Cancel</button>
                <button type="submit" disabled={!isCreating} className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {!isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border bg-slate-50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                  <Briefcase className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {project.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {project.tasks} Tasks
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
                Go to board <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}

          {projects.length === 0 && (
            <div
              onClick={() => setIsCreating(true)}
              className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Plus className="h-8 w-8 text-slate-300" />
              </div>

              <p className="font-medium text-slate-900">No projects yet</p>

              <p className="mt-1 max-w-xs text-sm">
                Every great project starts with a single step. Create your first
                project to get started.
              </p>

              <button className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50">
                Create Project
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
