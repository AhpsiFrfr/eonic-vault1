import { useVaultData } from '../hooks/useVaultData';

export const TokenOverview: React.FC = () => {
  const { tokenStats, isLoadingTokens, tokenError } = useVaultData();

  if (isLoadingTokens) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading token data: {tokenError.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Token Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">SOL Balance</p>
          <p className="text-2xl font-bold">{tokenStats.solBalance.toFixed(2)} SOL</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">EONIC Balance</p>
          <p className="text-2xl font-bold">{tokenStats.eonicBalance.toFixed(2)} EONIC</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-80">Staked Amount</p>
          <p className="text-2xl font-bold">{tokenStats.stakedAmount.toFixed(2)} EONIC</p>
        </div>
      </div>

      <div className="mt-6">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Manage Tokens
        </button>
      </div>
    </div>
  );
}; 