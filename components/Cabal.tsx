import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { verifyEonicNFT } from '../utils/nft';
import { createProposal, getActiveProposals, castVote, getExclusiveContent, getUserAccessLevel, Proposal, ExclusiveContent } from '../utils/cabal';

export const Cabal: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [hasAccess, setHasAccess] = useState(false);
  const [notLaunched, setNotLaunched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'governance' | 'content'>('overview');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContent[]>([]);
  const [newProposal, setNewProposal] = useState({ title: '', description: '' });
  const [accessLevel, setAccessLevel] = useState(0);

  useEffect(() => {
    async function checkAccess() {
      if (!publicKey) return;
      
      setLoading(true);
      try {
        const { verified, notLaunched } = await verifyEonicNFT(connection, publicKey.toString());
        setHasAccess(verified);
        setNotLaunched(notLaunched);

        if (verified && !notLaunched) {
          // Load governance proposals
          const activeProposals = await getActiveProposals();
          setProposals(activeProposals);

          // Get user's access level
          const level = await getUserAccessLevel(publicKey.toString());
          setAccessLevel(level);

          // Load exclusive content
          const content = await getExclusiveContent(level);
          setExclusiveContent(content);
        }
      } catch (error) {
        console.error('Error verifying access:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [publicKey, connection]);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !newProposal.title || !newProposal.description) return;

    try {
      await createProposal(
        newProposal.title,
        newProposal.description,
        publicKey.toString()
      );
      setNewProposal({ title: '', description: '' });
      
      // Refresh proposals
      const activeProposals = await getActiveProposals();
      setProposals(activeProposals);
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    if (!publicKey) return;

    try {
      await castVote(proposalId, publicKey.toString(), vote, 1); // Basic voting power of 1
      
      // Refresh proposals
      const activeProposals = await getActiveProposals();
      setProposals(activeProposals);
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess || notLaunched) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {notLaunched ? 'Coming Soon' : 'Exclusive Access Required'}
        </h3>
        <p className="text-gray-600 mb-4">
          {notLaunched
            ? 'The EONIC NFT collection will be launching on June 1st, 2025. Stay tuned!'
            : 'You need to hold an EONIC NFT to access this area.'}
        </p>
        {!notLaunched && (
          <a
            href="https://magiceden.io/marketplace/eonic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all"
          >
            Get EONIC NFT
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg text-white">
        <h3 className="text-xl font-semibold mb-2">Welcome to The Cabal</h3>
        <p>Access Level: {accessLevel}</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'governance', 'content'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Benefits</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Access Level {accessLevel} Content
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Governance Voting Rights
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Private Chat Access
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h4>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium text-gray-900">Community Call</p>
                <p className="text-sm text-gray-500">May 15th, 2025 - 2:00 PM UTC</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium text-gray-900">NFT Showcase</p>
                <p className="text-sm text-gray-500">May 20th, 2025 - 6:00 PM UTC</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Create Proposal */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Create Proposal</h4>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Create Proposal
              </button>
            </form>
          </div>

          {/* Active Proposals */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Active Proposals</h4>
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white p-6 rounded-lg shadow-md">
                <h5 className="text-lg font-medium text-gray-900">{proposal.title}</h5>
                <p className="mt-2 text-gray-600">{proposal.description}</p>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-purple-500 rounded-full h-2"
                      style={{
                        width: `${(proposal.votes_for / (proposal.votes_for + proposal.votes_against || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{proposal.votes_for} For</span>
                    <span>{proposal.votes_against} Against</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleVote(proposal.id, 'for')}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 'against')}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Vote Against
                  </button>
                </div>
              </div>
            ))}
            {proposals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active proposals</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exclusiveContent.map((content) => (
            <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {content.type === 'image' && (
                <img
                  src={content.content}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h5 className="font-medium text-gray-900">{content.title}</h5>
                {content.type === 'article' && (
                  <p className="mt-2 text-gray-600">{content.content}</p>
                )}
                {content.type === 'video' && (
                  <div className="mt-2">
                    <video
                      src={content.content}
                      controls
                      className="w-full rounded"
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Level {content.access_level} Content
                </div>
              </div>
            </div>
          ))}
          {exclusiveContent.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No content available for your access level</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
