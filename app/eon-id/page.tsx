'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const EnhancedEONIDProfilePage = dynamic(
  () => import('../../components/EON-ID/EnhancedEONIDProfilePage'),
  { ssr: false }
);

export default function EONIDPage() {
  return <EnhancedEONIDProfilePage userId="default-user-id" />;
} 