// Layout Component
// Provides consistent navigation and structure across all screens

import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const navItems = [
  { path: '/host', label: '🏠 Host', description: 'Floor Dashboard' },
  { path: '/kitchen', label: '👨‍🍳 Kitchen', description: 'Order Management' },
  { path: '/cleaning', label: '🧹 Cleaning', description: 'Table Cleanup' },
  { path: '/table/1', label: '📱 Demo Order', description: 'Customer View' },
];

export function Layout({ children, title }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation Header - Glassmorphic */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/host" className="flex items-center gap-3 group">
              <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🍕</span>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-800 leading-none tracking-tight">TableFlow</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Restaurant OS</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-2">
              {navItems.map(item => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/table/1' && location.pathname.startsWith('/table'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      flex items-center gap-2
                      ${isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    <span>{item.label.split(' ')[0]}</span>
                    <span className="hidden sm:inline">{item.label.split(' ').slice(1).join(' ')}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl p-8 sm:p-12">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 blur-3xl" />
          
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Manage your restaurant efficiently with real-time updates and seamless workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
