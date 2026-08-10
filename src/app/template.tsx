'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition w-full">{children}</div>;
}
