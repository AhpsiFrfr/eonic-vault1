'use client';

/**
 * Utility for generating fake direct messages for testing
 * @dev-vault-component
 */

import { v4 as uuidv4 } from 'uuid';

// Sample users for fake DMs
const sampleUsers = [
  {
    id: '1',
    name: 'CabalMember',
    profilePic: '/avatar2.png',
    xpLevel: 87,
    timepiece: 'restricted',
    isAdmin: true
  },
  {
    id: '2',
    name: 'ENIC.0',
    profilePic: '/enic.png',
    xpLevel: 999,
    timepiece: 'quantum',
    isAdmin: false
  },
  {
    id: '3',
    name: 'DevLead',
    profilePic: '/avatar3.png',
    xpLevel: 120,
    timepiece: 'active',
    isAdmin: true
  },
  {
    id: '4',
    name: 'QATester',
    profilePic: '/avatar4.png',
    xpLevel: 65,
    timepiece: 'active',
    isAdmin: false
  }
];

// Sample message content for random generation
const sampleMessages = [
  "Have you checked the latest build?",
  "The quantum engine is showing some interesting results.",
  "We need to discuss the integration timeline.",
  "Can you review my pull request when you have a moment?",
  "The tests are failing on the CI server.",
  "I've updated the documentation with the new features.",
  "Did you see the error logs from last night?",
  "The new UI looks great, nice work!",
  "We should schedule a meeting to discuss the roadmap.",
  "I'm working on fixing that bug you reported.",
  "The performance improvements are significant in this version.",
  "Can you help me debug this issue?",
  "I've pushed a hotfix for the critical bug.",
  "The deployment was successful, all systems operational.",
  "We need to update our dependencies soon."
];

// Sample reactions
const sampleReactions = ['👍', '❤️', '🔥', '🚀', '✅', '⚠️', '🐛', '💻', '🧠', '🤖'];

/**
 * Generate a fake direct message conversation
 * @param {string} userId - The ID of the user to generate conversation with
 * @param {number} messageCount - Number of messages to generate (default: 10)
 * @returns {Object} User and messages objects
 */
export function generateFakeDM(userId = '1', messageCount = 10) {
  // Find or create user
  const user = sampleUsers.find(u => u.id === userId) || sampleUsers[0];
  
  // Generate messages
  const messages = [];
  const now = Date.now();
  
  for (let i = 0; i < messageCount; i++) {
    // Determine sender (alternate between user and DevUser with some randomness)
    const isUserMessage = i % 2 === 0 || Math.random() > 0.7;
    const sender = isUserMessage ? user.name : 'DevUser';
    const profilePic = isUserMessage ? user.profilePic : '/avatar1.png';
    const xpLevel = isUserMessage ? user.xpLevel : 42;
    const timepiece = isUserMessage ? user.timepiece : 'active';
    
    // Random message content
    const content = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    // Random timestamp (older for earlier messages)
    const timestamp = now - (messageCount - i) * (Math.random() * 600000 + 300000);
    
    // Random reactions (30% chance of having reactions)
    const reactions = [];
    if (Math.random() > 0.7) {
      const reactionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < reactionCount; j++) {
        const emoji = sampleReactions[Math.floor(Math.random() * sampleReactions.length)];
        reactions.push({
          emoji,
          count: Math.floor(Math.random() * 3) + 1
        });
      }
    }
    
    // Random edited status (10% chance)
    const edited = Math.random() > 0.9;
    
    // All messages are seen except the last few if they're from the user
    const seen = i < messageCount - 2 || !isUserMessage;
    
    messages.push({
      id: uuidv4(),
      sender,
      content,
      timestamp,
      profilePic,
      xpLevel,
      timepiece,
      reactions,
      edited,
      seen
    });
  }
  
  return {
    user: {
      ...user,
      status: Math.random() > 0.3 ? 'online' : 'offline',
      lastSeen: 'Just now',
      isBlocked: false,
      isMuted: false
    },
    messages
  };
}

/**
 * Simulate a notification for a direct message
 * @param {string} userId - The ID of the user sending the notification
 * @returns {Object} Notification data
 */
export function simulateNotification(userId = '1') {
  const user = sampleUsers.find(u => u.id === userId) || sampleUsers[0];
  const content = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  
  return {
    id: uuidv4(),
    type: 'directMessage',
    sender: user,
    content,
    timestamp: Date.now()
  };
}

/**
 * Generate a list of DM conversations for the sidebar
 * @param {number} count - Number of conversations to generate
 * @returns {Array} List of conversation previews
 */
export function generateDMList(count = 5) {
  const conversations = [];
  
  for (let i = 0; i < count; i++) {
    const user = sampleUsers[i % sampleUsers.length];
    const lastMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const timestamp = Date.now() - Math.floor(Math.random() * 86400000); // Within last 24 hours
    const unreadCount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
    
    conversations.push({
      id: user.id,
      user,
      lastMessage,
      timestamp,
      unreadCount
    });
  }
  
  // Sort by timestamp (most recent first)
  return conversations.sort((a, b) => b.timestamp - a.timestamp);
}
