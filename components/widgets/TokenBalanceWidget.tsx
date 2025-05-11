'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface TokenBalanceData {
  isLoading: boolean;
  balance: number | null;
  error: Error | null;
}

function useTokenBalance(tokenSymbol: string): TokenBalanceData {
  const { publicKey } = useWallet();
  const [data, setData] = useState<TokenBalanceData>({
    isLoading: true,
    balance: null,
    error: null
  });
  
  useEffect(() => {
    if (!publicKey) {
      setData({
        isLoading: false,
        balance: null,
        error: new Error('Wallet not connected')
      });
      return;
    }
    
    // Mock data for now
    const mockBalance = 5782.41;
    
    setTimeout(() => {
      setData({
        isLoading: false,
        balance: mockBalance,
        error: null
      });
    }, 800);
    
    // In a real implementation, we would fetch the token balance from an API
    // const fetchBalance = async () => {
    //   try {
    //     const response = await fetch(`/api/token/balance?address=${publicKey}&symbol=${tokenSymbol}`);
    //     const data = await response.json();
    //     setData({
    //       isLoading: false,
    //       balance: data.balance,
    //       error: null
    //     });
    //   } catch (error) {
    //     setData({
    //       isLoading: false,
    //       balance: null,
    //       error: error as Error
    //     });
    //   }
    // };
    // fetchBalance();
  }, [publicKey, tokenSymbol]);
  
  return data;
}

export default function TokenBalanceWidget() {
  const { isLoading, balance, error } = useTokenBalance("EONIC");

  return (
    <div className="rounded-xl bg-gradient-to-br from-black to-gray-900 p-4 shadow-xl text-white">
      <h2 className="text-lg font-semibold mb-2">EONIC Balance</h2>
      {isLoading ? (
        <div className="animate-pulse h-8 w-32 bg-gray-700 rounded"></div>
      ) : error ? (
        <p className="text-red-400 text-sm">Connect wallet to view balance</p>
      ) : (
        <p className="text-2xl">{balance?.toLocaleString() ?? "0"} <span className="text-sm text-indigo-400">EONIC</span></p>
      )}
    </div>
  );
} 