'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Give user time to click the showcase link
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">EONIC Vault</h1>
      
      <div className="flex gap-4">
        <Link 
          href="/showcase" 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          View UI Showcase
        </Link>

        <Link
          href="/login"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Go to Login
        </Link>
      </div>
      
      <p className="mt-4 text-gray-400">
        Redirecting to login in 5 seconds...
      </p>
    </div>
  );
}
