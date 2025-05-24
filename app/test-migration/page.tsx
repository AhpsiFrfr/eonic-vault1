'use client';

export default function TestMigration() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">
        🚀 Migration Test Page
      </h1>
      <p className="text-gray-300 mb-4">
        If you can see this page, the deployment is working!
      </p>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">DevHQ Migration Status:</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span>Route accessible</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span>Basic styling working</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-500">🔄</span>
            <span>Testing complex components next...</span>
          </li>
        </ul>
      </div>
      <div className="mt-6">
        <a 
          href="/dev-hq-test" 
          className="inline-block bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded transition-colors"
        >
          Try DevHQ Test Page →
        </a>
      </div>
    </div>
  );
} 