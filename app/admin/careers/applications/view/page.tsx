'use client';

import React, { Suspense } from 'react';
import ApplicationDetailView from '@/components/admin/ApplicationDetailView';

export default function AdminApplicationDetailStaticPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#66736E] text-xs">
          <div className="w-8 h-8 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">Loading Candidate Dossier...</span>
        </div>
      }
    >
      <ApplicationDetailView appId="view" />
    </Suspense>
  );
}
