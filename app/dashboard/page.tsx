'use client';

import { motion } from "framer-motion";
import HoldingsWidget from "../../components/widgets/HoldingsWidget";
import XPMeter from "../../components/widgets/XPMeter";
import TimepieceDisplay from "../../components/widgets/TimepieceDisplay";
import TokenChart from "../../components/widgets/TokenChart";
import NFTGallery from "../../components/widgets/NFTGallery";
import NewsFeed from "../../components/widgets/NewsFeed";
import Announcements from "../../components/widgets/Announcements";
import TokenBalanceWidget from "../../components/widgets/TokenBalanceWidget";
import TimepieceEvolutionWidget from "../../components/widgets/TimepieceEvolutionWidget";
import VaultNotificationsWidget from "../../components/widgets/VaultNotificationsWidget";
import RecentActivityWidget from "../../components/widgets/RecentActivityWidget";
import ENICAssistantWidget from "../../components/widgets/ENICAssistantWidget";

export default function DashboardPage() {
  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TokenBalanceWidget />
        <TimepieceEvolutionWidget />
        <ENICAssistantWidget />
        <VaultNotificationsWidget />
        <RecentActivityWidget />
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Legacy Widgets</h2>
      <div className="widget-row opacity-50">
        <HoldingsWidget />
        <XPMeter />
        <TimepieceDisplay />
      </div>

      <div className="widget-row opacity-50">
        <TokenChart />
        <NFTGallery />
      </div>

      <div className="widget-row opacity-50">
        <NewsFeed />
        <Announcements />
      </div>
    </motion.div>
  );
}
