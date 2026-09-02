"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';
import { MAIN_NAV, ROUTES } from '@/config';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-paper text-ink font-body">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-ink/10 flex flex-col bg-white">
        <div className="p-6 border-b border-ink/10">
          <Link href="/" className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-mint text-white flex items-center justify-center font-bold">
              SW
            </span>
            SmartWallet
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MAIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                  ? 'bg-mint/10 text-mint'
                  : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink/10 space-y-1">
          <Link href="/app/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-ink/70 hover:bg-ink/5 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-coral hover:bg-coral/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-paper">
        {children}
      </main>
    </div>
  );
}
