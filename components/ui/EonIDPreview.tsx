'use client';

import React from 'react';
import { MockProfile } from '../../utils/mock-data';

interface Props {
  profile: MockProfile;
}

const styleMap: Record<string, string> = {
  intern: 'border-blue-400 text-blue-200 bg-[#0a0a0a]',
  secretary: 'border-pink-500 text-pink-200 bg-[#1a0a1a]',
  management: 'border-green-400 text-green-100 bg-[#0a1a0a]',
  ceo: 'border-purple-600 text-purple-200 bg-[#0a0a1a]',
  paul_allen: 'border-[#eeeeee] text-[#ddd] bg-[#f8f6f2] font-serif italic text-black',
};

export default function EonIDPreview({ profile }: Props) {
  const cardStyle = profile.card_style || 'intern';
  const styles = styleMap[cardStyle];

  return (
    <div className={`rounded-md p-4 border w-full mt-6 shadow-md transition-all ${styles}`}>
      <div className="text-xl font-semibold">{profile.display_name || 'Your Name'}</div>
      <div className="text-sm mb-1">{profile.title || 'Your Title'}</div>
      <div className="text-xs mb-2 opacity-80">{profile.domain ? `${profile.domain}.vault.sol` : 'yourname.vault.sol'}</div>
      <div className="text-xs opacity-60">{profile.social_links?.github}</div>
      <div className="text-xs opacity-60">{profile.social_links?.twitter}</div>
      {cardStyle === 'paul_allen' && (
        <div className="text-xs mt-2 italic opacity-70">"Look at that subtle coloring... the tasteful thickness of it..."</div>
      )}
    </div>
  );
} 