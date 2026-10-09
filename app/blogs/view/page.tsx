'use client';

import React, { Suspense } from 'react';
import BlogDetailContent from '@/components/blogs/BlogDetailContent';

export default function BlogViewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center bg-white">
          <div className="container mx-auto px-4 max-w-3xl space-y-4">
            <div className="w-10 h-10 border-3 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-brand-gray">Loading article details...</p>
          </div>
        </div>
      }
    >
      <BlogDetailContent />
    </Suspense>
  );
}
