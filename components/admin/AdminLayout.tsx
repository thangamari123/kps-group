'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  User,
  Activity,
  Camera,
  BookOpen,
  HeartHandshake,
  Trophy,
} from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If on login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If still loading auth status, show clean corporate loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#66736E] text-xs font-semibold tracking-wide uppercase">
            Verifying KPS Administrator Session...
          </p>
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
      title: 'CONTENT MANAGEMENT',
      items: [
        { name: 'Gallery', href: '/admin/gallery', icon: Camera },
        { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
        { name: 'CSR', href: '/admin/csr', icon: HeartHandshake },
        { name: 'Awards', href: '/admin/awards', icon: Trophy },
      ],
    },
    {
      title: 'CAREERS',
      items: [
        { name: 'Job Posts', href: '/admin/careers/jobs', icon: Briefcase },
        { name: 'Applications', href: '/admin/careers/applications', icon: Users },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const getPageContext = () => {
    if (pathname === '/admin') return { title: 'Dashboard Overview', section: 'Overview' };
    if (pathname.startsWith('/admin/gallery')) return { title: 'Gallery Management', section: 'Content' };
    if (pathname.startsWith('/admin/blogs')) return { title: 'Blog Management', section: 'Content' };
    if (pathname.startsWith('/admin/csr')) return { title: 'CSR Management', section: 'Content' };
    if (pathname.startsWith('/admin/awards')) return { title: 'Awards Management', section: 'Content' };
    if (pathname.startsWith('/admin/careers/jobs/new')) return { title: 'Create Job Post', section: 'Careers' };
    if (pathname.startsWith('/admin/careers/jobs/')) return { title: 'Edit Job Post', section: 'Careers' };
    if (pathname.startsWith('/admin/careers/jobs')) return { title: 'Job Postings', section: 'Careers' };
    if (pathname.startsWith('/admin/careers/applications/')) return { title: 'Candidate Dossier', section: 'Careers' };
    if (pathname.startsWith('/admin/careers/applications')) return { title: 'Applications Pipeline', section: 'Careers' };
    return { title: 'Admin Console', section: 'Management' };
  };

  const pageContext = getPageContext();

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setShowLogoutModal(false);
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#17211E] flex flex-col lg:flex-row antialiased">
      {/* ------------------------------------------------------------- */}
      {/* 1. Desktop Sidebar (Deep Green #004D3A) */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#004D3A] text-white shrink-0 select-none border-r border-[#00382A]">
        {/* Logo & Portal Branding */}
        <div className="p-4 border-b border-[#003B2C]">
          <Link
            href="/admin"
            className="flex items-center space-x-3 group"
          >
            <div className="h-10 px-2.5 py-1 bg-white rounded-xl flex items-center justify-center shadow-xs shrink-0 border border-white/10 transition-transform duration-200 group-hover:scale-105">
              <img
                src="/images/kpslogo.webp"
                alt="KPS Logistics Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-white text-xs tracking-tight leading-tight uppercase group-hover:text-emerald-200 transition-colors">
                KPS LOGISTICS
              </h1>
              <span className="text-[10px] font-semibold text-emerald-300/80 tracking-wider uppercase block">
                Enterprise Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider text-emerald-200/50 uppercase">
                {section.title}
              </span>
              <div className="space-y-1 pt-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        active
                          ? 'bg-white text-[#004D3A] shadow-sm shadow-black/10 font-bold'
                          : 'text-emerald-100/75 hover:text-white hover:bg-[#005A43]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#004D3A]' : 'text-emerald-300/80'}`} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight className="w-3.5 h-3.5 text-[#004D3A]" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card & Footer */}
        <div className="p-3.5 border-t border-[#003B2C] bg-[#003D2E] space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
              {user.photo_url ? (
                <img src={user.photo_url} alt={user.name || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name || 'Administrator'}</p>
              <p className="text-[11px] text-emerald-200/70 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-lg bg-[#004D3A] text-[11px] font-semibold text-emerald-100 hover:text-white hover:bg-[#005A43] transition-colors border border-emerald-600/20"
              title="Open public website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-lg bg-red-900/30 text-[11px] font-semibold text-red-200 border border-red-500/20 hover:bg-red-800/50 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-300" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main Wrapper with Top Header & Content Area */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (White Background #FFFFFF) */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E9E5] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          {/* Left: Breadcrumbs & Page Context */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#17211E] hover:bg-[#F7F9F8] border border-[#E2E9E5]"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5 text-[#006B4F]" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="text-[#66736E] hidden sm:inline">{pageContext.section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#66736E]/60 hidden sm:inline" />
              <span className="text-[#17211E] font-bold text-sm sm:text-base tracking-tight">
                {pageContext.title}
              </span>
            </div>
          </div>

          {/* Right: Operational Status, Public Site link & Profile Dropdown */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Status Pill */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EAF5F1] border border-[#006B4F]/20 text-[#006B4F] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006B4F] animate-pulse" />
              <span>Enterprise D1 & Firestore</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl border border-[#E2E9E5] hover:border-[#006B4F]/40 bg-white transition-all cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EAF5F1] text-[#006B4F] font-bold text-xs flex items-center justify-center border border-[#006B4F]/20">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.name || 'Admin'} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#17211E] leading-tight truncate max-w-[120px]">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-[10px] text-[#66736E] capitalize font-medium">{user.role || 'Administrator'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#66736E]" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E2E9E5] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-[#E2E9E5]">
                    <p className="text-xs font-bold text-[#17211E] truncate">{user.name || 'Administrator'}</p>
                    <p className="text-[11px] text-[#66736E] truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#EAF5F1] text-[#006B4F] text-[10px] font-bold">
                      {user.role === 'super_admin' ? 'Super Admin' : 'Admin Authority'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[#006B4F]" />
                      <span>View Public Website</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[#E2E9E5]">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#DC2626]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 bg-[#F7F9F8] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Mobile Navigation Drawer */}
      {/* ------------------------------------------------------------- */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-[#17211E]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in Drawer */}
          <div className="relative w-72 max-w-[85vw] bg-[#004D3A] text-white flex flex-col justify-between shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#003B2C] flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-2.5"
              >
                <div className="h-9 px-2 py-1 bg-white rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                  <img
                    src="/images/kpslogo.webp"
                    alt="KPS Logistics Logo"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-white text-xs block leading-tight uppercase">KPS Logistics</span>
                  <span className="text-[10px] text-emerald-300/80 uppercase block">Enterprise Admin</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-[#005A43] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-4">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-200/50 uppercase px-2">
                    {section.title}
                  </span>
                  <div className="space-y-1 pt-0.5">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                            active
                              ? 'bg-white text-[#004D3A] font-bold shadow-xs'
                              : 'text-emerald-100/80 hover:bg-[#005A43] hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-[#004D3A]' : 'text-emerald-300'}`} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* User & Sign Out Footer */}
            <div className="p-4 bg-[#003D2E] border-t border-[#003B2C] space-y-3">
              <div className="flex items-center space-x-3 px-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                  {initials}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.name || 'Admin'}</p>
                  <p className="text-[10px] text-emerald-200/70 truncate">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg bg-[#004D3A] text-xs font-semibold text-emerald-100 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2 px-2.5 bg-red-800/80 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out of Admin Console?"
        message="Are you sure you want to end your administrative session? You will need your Firebase credentials to log in again."
        confirmLabel="Sign Out"
        loading={loggingOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
