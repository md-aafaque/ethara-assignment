"use client";
// web/components/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTeam } from '@/context/TeamContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading: teamsLoading } = useTeam();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthPage = pathname.startsWith('/auth');
    const isLandingPage = pathname === '/';

    if (!token) {
      if (!isAuthPage && !isLandingPage) {
        router.push('/auth/login');
      } else {
        setAuthorized(true);
      }
    } else {
      if (isAuthPage) {
        router.push('/dashboard');
      } else {
        setAuthorized(true);
      }
    }
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
