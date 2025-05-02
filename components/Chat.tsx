import React, { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage, MessageReaction } from '../utils/supabase';
import { PaperClipIcon, EmojiHappyIcon, ReplyIcon } from '@heroicons/react/outline';

interface ChatProps {
  walletAddress: string;
  room?: string;
}

export default function Chat({ walletAddress, room = 'general' }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const subscription = supabase
      .channel(`messages:${room}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `room=eq.${room}` }, handleNewMessage)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        reactions (*),
        attachments (*)
      `)
      .eq('room', room)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const handleNewMessage = (payload: any) => {
    if (payload.new) {
      setMessages((prev) => [...prev, payload.new]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${room}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    return {
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: publicUrl,
      filename: file.name,
      size: file.size,
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let attachment;
      if (selectedFile) {
        attachment = await uploadFile(selectedFile);
      }

      await supabase.from('messages').insert({
        content: newMessage.trim(),
        sender_address: walletAddress,
        room,
        parent_id: replyTo?.id,
        ...(attachment ? { attachments: [attachment] } : {}),
      });

      setNewMessage('');
      setSelectedFile(null);
      setReplyTo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_address: walletAddress,
        emoji,
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender_address === publicKey?.toString()
              ? 'ml-auto'
              : 'mr-auto'}`}
          >
            <div
              className={`rounded-lg p-3 max-w-xs ${message.sender_address === publicKey?.toString()
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100'}`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {message.sender_address.slice(0, 8)}...{' • '}
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-500">
            Selected file: {selectedFile.name}
          </div>
        )}
      </form>
    </div>
  );
};
