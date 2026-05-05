"use client";
// web/app/teams/page.tsx
import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { apiFetch } from '@/lib/api';
import { Plus, Users, Shield, User as UserIcon, Mail, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface TeamDetails {
  id: string;
  name: string;
  members: TeamMember[];
}

export default function TeamsPage() {
  const { teams, activeTeam, setActiveTeam, refreshTeams, isLoading: teamsLoading } = useTeam();
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTeam) {
      fetchTeamDetails(activeTeam.id);
    } else {
      setTeamDetails(null);
    }
  }, [activeTeam]);

  async function fetchTeamDetails(teamId: string) {
    setIsLoading(true);
    try {
      const data = await apiFetch(`/teams/${teamId}`);
      setTeamDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const newTeam = await apiFetch('/teams', {
        method: 'POST',
        body: JSON.stringify({ name: newTeamName }),
      });
      setNewTeamName('');
      setIsCreatingTeam(false);
      await refreshTeams();
      setActiveTeam(newTeam);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam) return;
    setError('');
    
    try {
      await apiFetch(`/teams/${activeTeam.id}/members`, {
        method: 'POST',
        body: JSON.stringify({ email: newMemberEmail, role: 'MEMBER' }),
      });
      setNewMemberEmail('');
      setIsAddingMember(false);
      fetchTeamDetails(activeTeam.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeTeam || !confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await apiFetch(`/teams/${activeTeam.id}/members/${userId}`, {
        method: 'DELETE',
      });
      fetchTeamDetails(activeTeam.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (teamsLoading) return <div className="flex h-full items-center justify-center text-slate-500">Loading teams...</div>;

  if (teams.length === 0 && !isCreatingTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="bg-blue-50 p-6 rounded-full">
          <Users className="h-12 w-12 text-blue-600" />
        </div>
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Create your first team</h1>
          <p className="text-slate-500 mt-2">Teams are the foundation of Ethera AI. Create a team to start managing projects and collaborating with others.</p>
        </div>
        <button 
          onClick={() => setIsCreatingTeam(true)}
          className="flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Team
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Selection / Creation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex gap-2">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTeam(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTeam?.id === t.id 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white border text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.name}
              </button>
            ))}
            <button 
              onClick={() => setIsCreatingTeam(true)}
              className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center"
            >
              <Plus className="h-3 w-3 mr-1" /> New
            </button>
          </div>
        </div>
      </div>

      {isCreatingTeam && (
        <div className="rounded-xl border bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Create New Team</h3>
          <form onSubmit={handleCreateTeam} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                required
                placeholder="Team name (e.g. Marketing, Engineering)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingTeam(false)}
              className="rounded-lg bg-white border px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {activeTeam ? (
        <>
          <div className="flex items-center justify-between pt-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{activeTeam.name} Members</h2>
              <p className="text-slate-500 text-sm">Manage who has access to this team.</p>
            </div>
            <button 
              onClick={() => setIsAddingMember(true)}
              className="flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </button>
          </div>

          {isAddingMember && (
            <div className="rounded-xl border bg-blue-50 p-6">
              <h3 className="text-sm font-bold text-blue-900 mb-4">Add New Member</h3>
              <form onSubmit={handleAddMember} className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    required
                    placeholder="User email address"
                    className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                  {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Invite
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="rounded-lg bg-white border border-blue-200 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Member</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {teamDetails?.members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                            <UserIcon className="h-4 w-4 text-slate-400" />
                          </div>
                          <span className="font-medium text-slate-900">{member.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{member.user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {member.role === 'ADMIN' ? (
                            <Shield className="h-3 w-3 text-blue-600 mr-1.5" />
                          ) : (
                            <Users className="h-3 w-3 text-slate-400 mr-1.5" />
                          )}
                          <span className={member.role === 'ADMIN' ? 'font-bold text-blue-600' : ''}>
                            {member.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleRemoveMember(member.user.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading team members...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        !isCreatingTeam && <div className="text-slate-500 italic">Please select or create a team to manage members.</div>
      )}
    </div>
  );
}
