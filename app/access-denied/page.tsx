'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Warning Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-400" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Access Denied
        </motion.h1>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-gray-300 mb-4">
            You need to hold EONIC tokens to access the Vault.
          </p>
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 text-sm text-gray-400">
            <p className="mb-2">
              <strong className="text-purple-300">Required:</strong> EONIC tokens in your wallet
            </p>
            <p>
              <strong className="text-purple-300">Token Contract:</strong>{' '}
              <span className="font-mono text-xs bg-slate-700 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_EONIC_TOKEN_MINT || 'Loading...'}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Connect Different Wallet
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </button>

          <div className="text-xs text-gray-500 mt-4">
            Need EONIC tokens?{' '}
            <a
              href="https://jup.ag"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Buy on Jupiter
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 