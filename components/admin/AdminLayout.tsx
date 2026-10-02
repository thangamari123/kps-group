'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  UserCheck,
} from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If still loading auth status, show clean spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">Loading KPS Admin Portal...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not loading, auth context will redirect to /admin/login
  if (!user) {
    return null;
  }

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
      title: 'CAREERS',
      items: [
        { name: 'Job Posts', href: '/admin/careers/jobs', icon: Briefcase },
        { name: 'Applications', href: '/admin/careers/applications', icon: Users },
      ],
    },
    {
      title: 'ENQUIRIES',
      items: [
        { name: 'Quote Requests', href: '/admin/enquiries/quotes', icon: FileText },
        { name: 'Contact Messages', href: '/admin/enquiries/contacts', icon: Mail },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* ------------------------------------------------------------- */}
      {/* 1. Desktop Sidebar */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 select-none">
        {/* Logo & Portal Branding */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">KPS LOGISTICS</h1>
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">Admin Console</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {section.title}
              </span>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        active
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight className="w-3.5 h-3.5 text-emerald-400/70" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name || 'Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center space-x-1 px-2.5 py-2 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
              title="Open public website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center justify-center space-x-1 px-2.5 py-2 rounded-lg bg-red-950/40 text-[11px] font-semibold text-red-400 border border-red-900/40 hover:bg-red-900/60 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. Mobile Header & Drawer */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-sm">KPS Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-sm">KPS Admin</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-2">{section.title}</span>
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold ${
                        active ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600 text-white rounded-xl font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. Main Viewport Content Area */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 bg-slate-950 overflow-y-auto min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Logout Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out of Admin Console?"
        message="Are you sure you want to end your current administrative session? You will need to log in again to manage career postings, applications, and customer requests."
        confirmLabel="Sign Out"
        loading={loggingOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
