import React, { Suspense } from 'react';
import EditJobView from '@/components/admin/EditJobView';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [
    { id: 'default' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditJobPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#66736E] text-xs">
          <div className="w-8 h-8 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">Loading Position Settings...</span>
        </div>
      }
    >
      <EditJobView jobId={id} />
    </Suspense>
  );
}
