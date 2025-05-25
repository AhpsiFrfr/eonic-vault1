# DM Integration Guide

This guide explains how to integrate Direct Message functionality into your existing chat interfaces instead of having DM as separate pages.

## Overview

The DM system has been redesigned to integrate seamlessly into existing chat interfaces like VaultCord and DevHQ. Instead of separate DM pages, you can now add DM functionality directly to your chat components.

## Key Components

### 1. `ChatWithDM` Component
The main integration component that combines regular chat with DM functionality.

```tsx
import { ChatWithDM } from '../components/ChatWithDM';

<ChatWithDM
  room="general"           // Chat room name
  showDMTab={true}        // Show DM sidebar
  defaultMode="chat"      // Start in chat or dm mode
  className="h-full"
/>
```

### 2. `DMTab` Component
A collapsible sidebar component that lists DM conversations.

```tsx
import { DMTab } from '../components/dm/DMTab';

<DMTab
  isCollapsed={false}
  onToggleCollapse={() => setCollapsed(!collapsed)}
  onSelectDM={(threadId, address) => handleDMSelection(threadId, address)}
/>
```

## Integration Examples

### VaultCord Integration

Replace your existing ChatView with the enhanced version:

```tsx
// app/vaultcord/components/EnhancedChatView.tsx
import { ChatWithDM } from '../../../components/ChatWithDM';

export default function EnhancedChatView() {
  return (
    <ChatWithDM
      room="vaultcord-general"
      showDMTab={true}
      defaultMode="chat"
    />
  );
}
```

### DevHQ Integration

```tsx
// app/dev-hq/chat-system/EnhancedMessagePanel.tsx
import { ChatWithDM } from '../../../components/ChatWithDM';

export default function EnhancedMessagePanel({ channelId }) {
  return (
    <ChatWithDM
      room={channelId || 'dev-general'}
      showDMTab={true}
      defaultMode="chat"
    />
  );
}
```

## Features

### Mode Switching
Users can seamlessly switch between:
- **Chat Mode**: Regular channel/room chat
- **DM Mode**: Direct message conversations

### Integrated UI
- Tab-based interface in the chat header
- Collapsible DM sidebar
- Smooth transitions between modes
- Consistent Egyptian blue aesthetic

### DM Sidebar Features
- List of active DM conversations
- Search functionality
- Unread message indicators
- Quick access to start new DMs
- Real-time updates

## Usage Instructions

### For Users
1. **Switching Modes**: Click the "Chat" or "DMs" tabs in the header
2. **Starting DMs**: Click the "+" button in the DM sidebar
3. **Selecting Conversations**: Click on any DM preview card to switch to that conversation
4. **Back to Chat**: Use the "Back to Chat" button when in DM mode

### For Developers

#### Basic Integration
Replace your existing chat component:

```tsx
// Before
<Chat room="general" />

// After
<ChatWithDM room="general" showDMTab={true} />
```

#### Advanced Integration
For more control, use the components separately:

```tsx
import { DMTab } from '../components/dm/DMTab';
import Chat from '../components/Chat';

function MyCustomChat() {
  const [mode, setMode] = useState('chat');
  const [dmRecipient, setDmRecipient] = useState(null);

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <Chat 
          room={mode === 'chat' ? 'general' : 'dm'}
          isDM={mode === 'dm'}
          recipientAddress={dmRecipient}
        />
      </div>
      
      <div className="w-80">
        <DMTab onSelectDM={(threadId, address) => {
          setMode('dm');
          setDmRecipient(address);
        }} />
      </div>
    </div>
  );
}
```

## Demo Pages

Try the integration at these demo routes:

1. **Basic Demo**: `/chat-demo` - Shows the integrated chat interface
2. **Enhanced VaultCord**: `/vaultcord/enhanced-page` - VaultCord with DM integration
3. **DM Integration Examples**: `/dm-demo` - Various integration patterns

## Configuration Options

### ChatWithDM Props
- `room` (string): Chat room/channel name
- `parentId` (string): Parent message ID for threads
- `showDMTab` (boolean): Whether to show the DM sidebar
- `defaultMode` ('chat' | 'dm'): Starting mode
- `className` (string): Additional CSS classes

### DMTab Props
- `isCollapsed` (boolean): Sidebar collapsed state
- `onToggleCollapse` (function): Collapse toggle handler
- `onSelectDM` (function): DM selection handler
- `showHeader` (boolean): Whether to show the tab header

## Architecture

The integration maintains separation of concerns:

- **DMContext**: Global DM state management
- **Chat Component**: Existing chat functionality (supports `isDM` prop)
- **ChatWithDM**: Wrapper that manages mode switching
- **DMTab**: Sidebar for DM management

## Benefits

1. **Seamless UX**: No need to navigate between different pages
2. **Consistent UI**: Maintains your existing chat interface design
3. **Real-time**: All DM functionality is real-time enabled
4. **Extensible**: Easy to customize and extend
5. **Backward Compatible**: Existing chat functionality remains unchanged

## Migration

To migrate from standalone DM pages to integrated DM:

1. Replace chat components with `ChatWithDM`
2. Remove DM-specific routes (optional)
3. Update navigation to use mode switching instead of routing
4. Test the integration in your existing chat interfaces

The DMProvider is already available globally, so all components have access to DM functionality immediately. 