"use client";
// web/context/TeamContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

interface Team {
  id: string;
  name: string;
}

interface TeamContextType {
  teams: Team[];
  activeTeam: Team | null;
  setActiveTeam: (team: Team) => void;
  refreshTeams: () => Promise<void>;
  isLoading: boolean;
  logout: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeTeamId');
    setTeams([]);
    setActiveTeam(null);
  }, []);

  const refreshTeams = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setTeams([]);
      setActiveTeam(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiFetch('/teams');
      setTeams(data);
      
      if (data.length > 0) {
        const savedTeamId = localStorage.getItem('activeTeamId');
        // If we have an active team and it's still in the list, keep it.
        // Otherwise try to find the saved one, or default to first.
        const currentActiveStillExists = activeTeam ? data.find((t: Team) => t.id === activeTeam.id) : null;
        
        if (!currentActiveStillExists) {
          const found = data.find((t: Team) => t.id === savedTeamId) || data[0];
          setActiveTeam(found);
        }
      } else {
        setActiveTeam(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch teams', err);
      if (err.message === 'Unauthorized' || err.message === 'jwt expired') {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTeam, logout]);

  useEffect(() => {
    refreshTeams();
  }, []);

  useEffect(() => {
    if (activeTeam) {
      localStorage.setItem('activeTeamId', activeTeam.id);
    } else {
      localStorage.removeItem('activeTeamId');
    }
  }, [activeTeam]);

  return (
    <TeamContext.Provider value={{ teams, activeTeam, setActiveTeam, refreshTeams, isLoading, logout }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
