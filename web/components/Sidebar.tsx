"use client";
// web/components/Sidebar.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTeam } from '@/context/TeamContext';
import { LayoutDashboard, FolderKanban, ListChecks, Users, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'My Tasks', href: '/my-tasks', icon: ListChecks },
  { name: 'Teams', href: '/teams', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useTeam();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-6">
        <span className="text-xl font-bold tracking-tight text-blue-400">Ethera AI</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-red-900/20 hover:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
