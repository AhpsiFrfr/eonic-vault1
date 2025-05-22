import React from "react";
import { useUser } from "@/lib/hooks/useUser";
import { TimepieceDisplay } from "@/components/eonid/TimepieceDisplay";
import { TokenBalance } from "@/components/eonid/TokenBalance";
import { NftGallery } from "@/components/eonid/NftGallery";
import { ProfileFields } from "@/components/eonid/ProfileFields";
import { CustomizeEonId } from "@/components/eonid/CustomizeEonId";

export default function EonIdPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ProfileFields user={user} />
        <TimepieceDisplay />
        <TokenBalance />
        <NftGallery />
        <CustomizeEonId />
      </div>
    </div>
  );
} 