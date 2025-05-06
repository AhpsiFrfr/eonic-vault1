'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component
const EonIdClientComponent = dynamic(
  () => import('./client-page').then(mod => mod.EonIdClient)
);

export default function EonIdPage() {
  return <EonIdClientComponent />;
} 