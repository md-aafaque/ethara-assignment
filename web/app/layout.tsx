import { TeamProvider } from '@/context/TeamContext';
import { AuthGuard } from '@/components/AuthGuard';
import { AppShell } from '@/components/AppShell';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ethera AI - Team Task Manager',
  description: 'Collaborate and manage projects effectively.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TeamProvider>
          <AuthGuard>
            <AppShell>
              {children}
            </AppShell>
          </AuthGuard>
        </TeamProvider>
      </body>
    </html>
  );
}
