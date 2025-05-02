import { supabase } from './supabase';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  creator_address: string;
  status: 'active' | 'completed' | 'failed';
  votes_for: number;
  votes_against: number;
  created_at: string;
  ends_at: string;
}

export interface Vote {
  proposal_id: string;
  voter_address: string;
  vote: 'for' | 'against';
  voting_power: number;
}

export async function createProposal(
  title: string,
  description: string,
  creatorAddress: string,
  durationDays: number = 7
) {
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + durationDays);

  const { data, error } = await supabase
    .from('proposals')
    .insert([
      {
        title,
        description,
        creator_address: creatorAddress,
        status: 'active',
        votes_for: 0,
        votes_against: 0,
        ends_at: endsAt.toISOString(),
      },
    ]);

  if (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }

  return data;
}

export async function castVote(
  proposalId: string,
  voterAddress: string,
  vote: 'for' | 'against',
  votingPower: number
) {
  const { error } = await supabase.from('votes').insert([
    {
      proposal_id: proposalId,
      voter_address: voterAddress,
      vote,
      voting_power: votingPower,
    },
  ]);

  if (error) {
    console.error('Error casting vote:', error);
    throw error;
  }

  // Update proposal vote counts
  const voteIncrement = vote === 'for' ? votingPower : 0;
  const againstIncrement = vote === 'against' ? votingPower : 0;

  await supabase
    .from('proposals')
    .update({
      votes_for: supabase.raw(`votes_for + ${voteIncrement}`),
      votes_against: supabase.raw(`votes_against + ${againstIncrement}`),
    })
    .eq('id', proposalId);
}

export async function getActiveProposals() {
  const { data } = await supabase
    .from('proposals')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return data as Proposal[] || [];
}

export interface ExclusiveContent {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'image';
  created_at: string;
  access_level: number;
}

export async function getExclusiveContent(accessLevel: number) {
  const { data } = await supabase
    .from('exclusive_content')
    .select('*')
    .lte('access_level', accessLevel)
    .order('created_at', { ascending: false });

  return data as ExclusiveContent[] || [];
}

export async function getUserAccessLevel(walletAddress: string) {
  // This would typically check NFT holdings, token balance, etc.
  // For now, we'll return a basic level if they have an EONIC NFT
  const { data } = await supabase
    .from('nft_cache')
    .select('symbol')
    .eq('wallet_address', walletAddress)
    .eq('symbol', 'EONIC');

  return data && data.length > 0 ? 1 : 0;
}
