'use client';

import { useState, useEffect } from 'react';
import { getMockProfile } from '../../utils/mock-data';
import { FaGithub, FaGlobe, FaTwitter, FaDiscord } from 'react-icons/fa';

interface WebsiteLinksCardProps {
  userWalletAddress?: string;
}

export function WebsiteLinksCard({ userWalletAddress }: WebsiteLinksCardProps) {
  const [links, setLinks] = useState<{
    github?: string;
    website?: string;
    twitter?: string;
    discord?: string;
  }>({});

  useEffect(() => {
    if (userWalletAddress) {
      const profile = getMockProfile(userWalletAddress);
      if (profile && profile.social_links) {
        setLinks(profile.social_links);
      }
    }
  }, [userWalletAddress]);

  const hasLinks = links.github || links.website || links.twitter || links.discord;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-2">Business Links</h3>
      
      {hasLinks ? (
        <div className="flex flex-wrap gap-3">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 rounded px-3 py-2 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              <FaGithub /> GitHub
            </a>
          )}
          
          {links.website && (
            <a
              href={links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 rounded px-3 py-2 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              <FaGlobe /> Website
            </a>
          )}
          
          {links.twitter && (
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 rounded px-3 py-2 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              <FaTwitter /> Twitter
            </a>
          )}
          
          {links.discord && (
            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 rounded px-3 py-2 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              <FaDiscord /> Discord
            </a>
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No links to display</div>
      )}
    </div>
  );
} 