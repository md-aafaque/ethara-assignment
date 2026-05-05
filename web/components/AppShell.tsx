"use client";
// web/components/AppShell.tsx
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isLandingPage = pathname === '/';

  if (isAuthPage || isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
