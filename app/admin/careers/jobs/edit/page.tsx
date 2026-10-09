'use client';

import React, { Suspense } from 'react';
import EditJobView from '@/components/admin/EditJobView';

export default function AdminEditJobStaticPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#66736E] text-xs">
          <div className="w-8 h-8 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">Loading Position Settings...</span>
        </div>
      }
    >
      <EditJobView jobId="edit" />
    </Suspense>
  );
}
