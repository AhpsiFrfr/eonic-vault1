import { useState, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface FileVersion {
  timestamp: string;
  content: string;
  filename: string;
}

export const useDevEonChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiWarning, setApiWarning] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('dev-eon-history');
      if (cached) {
        const parsedMessages = JSON.parse(cached);
        setMessages(parsedMessages);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem('dev-eon-history', JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save chat history:', err);
    }
  }, [messages]);

  const sendPrompt = async (prompt: string) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('/api/dev-eon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Check if response indicates demo mode
      const responseContent = data.result || 'No response generated.';
      if (responseContent.includes('DEMO') || responseContent.includes('mock') || responseContent.includes('placeholder')) {
        setApiWarning(true);
      } else {
        setApiWarning(false);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('DEV-EON Chat Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to process request'}`,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const saveToFile = async (filename: string, content: string) => {
    try {
      // Save to backend
      const res = await fetch('/api/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      });

      if (!res.ok) {
        throw new Error('Failed to save file');
      }

      const data = await res.json();

      // Save version snapshot to localStorage
      try {
        const versionLog = localStorage.getItem('dev-eon-versions') || '{}';
        const parsed = JSON.parse(versionLog);
        const now = new Date().toISOString();
        
        // Initialize file versions array if it doesn't exist
        if (!parsed[filename]) {
          parsed[filename] = [];
        }
        
        // Add new version
        const newVersion: FileVersion = {
          timestamp: now,
          content: content,
          filename: filename
        };
        
        parsed[filename].push(newVersion);
        
        // Keep only last 10 versions per file to prevent localStorage bloat
        if (parsed[filename].length > 10) {
          parsed[filename] = parsed[filename].slice(-10);
        }
        
        localStorage.setItem('dev-eon-versions', JSON.stringify(parsed));
      } catch (versionError) {
        console.error('Failed to save version history:', versionError);
        // Don't throw here as the main save was successful
      }

      return data;
    } catch (err) {
      console.error('Save file error:', err);
      throw err;
    }
  };

  const getFileVersions = (filename: string): FileVersion[] => {
    try {
      const versionLog = localStorage.getItem('dev-eon-versions') || '{}';
      const parsed = JSON.parse(versionLog);
      return parsed[filename] || [];
    } catch (err) {
      console.error('Failed to load file versions:', err);
      return [];
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    setApiWarning(false);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('dev-eon-history');
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const clearVersions = () => {
    try {
      localStorage.removeItem('dev-eon-versions');
    } catch (err) {
      console.error('Failed to clear versions:', err);
    }
  };

  const getSessionStats = () => {
    try {
      const history = localStorage.getItem('dev-eon-history');
      const versions = localStorage.getItem('dev-eon-versions');
      
      const totalMessages = history ? JSON.parse(history).length : 0;
      const totalVersions = versions ? 
        Object.values(JSON.parse(versions)).reduce((acc: number, fileVersions: any) => acc + fileVersions.length, 0) : 0;
      
      return {
        currentSession: messages.length,
        totalMessages,
        totalVersions,
        hasHistory: totalMessages > 0
      };
    } catch (err) {
      console.error('Failed to calculate stats:', err);
      return {
        currentSession: messages.length,
        totalMessages: 0,
        totalVersions: 0,
        hasHistory: false
      };
    }
  };

  return { 
    messages, 
    loading, 
    error,
    apiWarning,
    sendPrompt, 
    saveToFile,
    getFileVersions,
    clearMessages,
    clearHistory,
    clearVersions,
    getSessionStats
  };
}; 