import { useWallet } from '@solana/wallet-adapter-react';

export const useVaultData = () => {
  const { publicKey } = useWallet();

  // Temporary mock data including tokenStats and evolution data
  return {
    nfts: [
      { name: 'EONIC Timepiece', image: '/mock/eonic_1.png', stage: 1 }
    ],
    referralStats: {
      totalReferrals: 3,
      activeReferrals: 2,
      totalRewards: 77,
      pendingRewards: 11,
      referralCode: "CAELIN777"
    },
    tokenStats: {
      solBalance: 1.5,
      eonicBalance: 100.0,
      stakedAmount: 50.0
    },
    evolutionStages: [
      {
        name: "Genesis Timepiece",
        image: "/mock/timepiece_1.png",
        description: "The beginning of your journey",
        requiredPoints: 0
      },
      {
        name: "Bronze Timepiece",
        image: "/mock/timepiece_2.png",
        description: "First evolution milestone",
        requiredPoints: 100
      },
      {
        name: "Silver Timepiece",
        image: "/mock/timepiece_3.png",
        description: "Advanced evolution stage",
        requiredPoints: 250
      },
      {
        name: "Gold Timepiece",
        image: "/mock/timepiece_4.png",
        description: "Ultimate evolution form",
        requiredPoints: 500
      }
    ],
    evolutionStats: {
      currentPoints: 175,
      nextUnlockPoints: 250,
      currentStage: 1
    },
    isLoadingTokens: false,
    tokenError: null,
    isLoadingEvolution: false,
    evolutionError: null
  };
}; 