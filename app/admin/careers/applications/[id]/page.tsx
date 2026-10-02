import React from 'react';
import ApplicationDetailView from '@/components/admin/ApplicationDetailView';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ id: 'view' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ApplicationDetailView appId={id} />;
}
