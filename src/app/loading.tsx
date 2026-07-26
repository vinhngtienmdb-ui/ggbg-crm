import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="bg-white p-6 rounded-2xl border border-line shadow-sm flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-line rounded-lg"></div>
          <div className="h-4 w-96 bg-line-soft rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-brand-300 rounded-xl"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white p-4 rounded-2xl border border-line space-y-3">
            <div className="h-4 w-24 bg-line rounded"></div>
            <div className="h-8 w-32 bg-line-muted rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-line shadow-sm p-6 space-y-4">
        <div className="h-10 w-full bg-line-soft rounded-xl"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-full bg-surface-subtle rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
