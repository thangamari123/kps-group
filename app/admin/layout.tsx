import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/components/admin/Toast';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'KPS Logistics Admin Console',
  description: 'Administrative management console for KPS Worldwide Logistics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminLayout>{children}</AdminLayout>
      </ToastProvider>
    </AuthProvider>
  );
}
