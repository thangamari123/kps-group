import React from 'react';
import EditJobView from '@/components/admin/EditJobView';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ id: 'edit' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditJobPage({ params }: PageProps) {
  const { id } = await params;
  return <EditJobView jobId={id} />;
}
