"use client";
// web/components/TopBar.tsx
import { useTeam } from '@/context/TeamContext';
import { ChevronDown, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export function TopBar() {
  const { teams, activeTeam, setActiveTeam, isLoading } = useTeam();
  const [user, setUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiFetch('/auth/me');
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div className="flex items-center space-x-4">
        {teams.length > 0 ? (
          <>
            <label htmlFor="team-selector" className="text-sm font-medium text-slate-500">
              Active Team:
            </label>
            <div className="relative">
              <select
                id="team-selector"
                className="appearance-none rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-10 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={activeTeam?.id || ''}
                onChange={(e) => {
                  const team = teams.find((t) => t.id === e.target.value);
                  if (team) setActiveTeam(team);
                }}
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </>
        ) : (
          !isLoading && <span className="text-sm font-medium text-slate-400 italic">No teams joined</span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'Loading...'}</p>
          <p className="text-xs text-slate-500">Member</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <User className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
}
