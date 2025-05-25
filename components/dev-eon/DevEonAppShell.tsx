'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDevEonChat } from '@/hooks/useDevEonChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FaCode, 
  FaRocket, 
  FaTrash, 
  FaBrain, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaHistory, 
  FaDatabase,
  FaLightbulb,
  FaCog,
  FaEye,
  FaFileExport,
  FaMagic
} from 'react-icons/fa';
import { Bot, Sparkles, FileText, History, Zap, Code, Settings, Eye } from 'lucide-react';
import CodePreview from './CodePreview';
import VersionHistory from './VersionHistory';

const DevEonAppShell = () => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const { 
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
  } = useDevEonChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    
    const prompt = input.trim();
    setInput('');
    setShowQuickPrompts(false); // Hide quick prompts after first message
    await sendPrompt(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSaveFile = async (filename: string, content: string) => {
    await saveToFile(filename, content);
    setSelectedFile(filename);
  };

  const handleSelectVersion = (content: string) => {
    setInput(content);
    setShowVersionHistory(false);
  };

  const sessionStats = getSessionStats();

  const examplePrompts = [
    {
      text: "Create a React profile card with TypeScript",
      icon: <Code className="w-4 h-4" />,
      category: "React"
    },
    {
      text: "Generate a custom API hook with error handling", 
      icon: <Zap className="w-4 h-4" />,
      category: "Hooks"
    },
    {
      text: "Build a responsive nav component with Tailwind",
      icon: <Settings className="w-4 h-4" />,
      category: "UI"
    },
    {
      text: "Create a modal with animations and backdrop blur",
      icon: <Eye className="w-4 h-4" />,
      category: "Components"
    },
    {
      text: "Debug TypeScript error: Property 'x' does not exist",
      icon: <FaMagic className="w-4 h-4" />,
      category: "Debug"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* Enhanced Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/vault">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-cyan-300">
                  <FaArrowLeft className="mr-2 w-4 h-4" />
                  Back to Vault
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-zinc-600/50" />
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-glow-breathe">
                    <Bot className="text-white w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    DEV-EON Assistant
                  </h1>
                  <p className="text-sm text-zinc-400">ENIC.0 Powered development companion</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {sessionStats.hasHistory && (
                <Button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                >
                  <History className="mr-2 w-4 h-4" />
                  Versions
                </Button>
              )}
              {messages.length > 0 && (
                <Button
                  onClick={clearMessages}
                  variant="destructive"
                  size="sm"
                >
                  <FaTrash className="mr-2 w-3 h-3" />
                  Clear Chat
                </Button>
              )}
              <div className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">
                <kbd className="px-1 py-0.5 bg-zinc-700 rounded text-cyan-300 text-xs">Ctrl+Enter</kbd> to send
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* API Warning */}
        {apiWarning && (
          <Card variant="outlined" className="mb-8 border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-yellow-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-300 mb-1">Demo Mode Active</h3>
                  <p className="text-sm text-yellow-400/80">
                    OpenAI API key not configured. Add your API key to <code className="bg-zinc-800 px-1 rounded">.env.local</code> for full functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="text-center py-16 space-y-8">
            <div className="space-y-4">
              <div className="relative mx-auto">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center animate-float">
                  <Sparkles className="w-12 h-12 text-cyan-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl blur-xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to DEV-EON
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Your ENIC.0-powered assistant for building, debugging, optimizing, and exporting code with full memory and live rendering support.
              </p>
            </div>

            {/* Quick Prompts Grid */}
            {showQuickPrompts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {examplePrompts.map((prompt, index) => (
                  <Card 
                    key={index} 
                    variant="outlined" 
                    className="cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 group"
                    onClick={() => setInput(prompt.text)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          {prompt.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-cyan-400 mb-2 font-medium">{prompt.category}</div>
                          <p className="text-sm text-zinc-300 leading-relaxed">"{prompt.text}"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Messages */}
            {messages.length > 0 && (
              <Card variant="glow" className="overflow-hidden">
                <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                            : 'bg-zinc-800/50 border border-zinc-700/50'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <div className="p-4">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        ) : (
                          <div className="p-4">
                            <CodePreview 
                              output={message.content} 
                              timestamp={message.timestamp}
                              onSaveFile={handleSaveFile}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </Card>
            )}

            {/* Enhanced Input Area */}
            <Card variant="glow" className="shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <CardContent className="p-6 space-y-4">
                <Textarea
                  ref={textareaRef}
                  variant="glow"
                  placeholder="Describe what you want to build, debug, or optimize. Be specific about technologies, frameworks, and requirements..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={4}
                  className="min-h-[120px] max-h-[200px]"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-zinc-500">
                      {input.length}/2000 characters
                    </div>
                    {input.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInput('')}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    variant="glow"
                    size="lg"
                    isLoading={loading}
                  >
                    {loading ? (
                      'Generating...'
                    ) : (
                      <>
                        <Zap className="mr-2 w-4 h-4" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Memory & Stats */}
            <Card variant="glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300">
                  <FaDatabase className="w-4 h-4" />
                  Memory & Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Current Session:</span>
                    <span className="text-cyan-300 font-semibold">{sessionStats.currentSession}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Total Messages:</span>
                    <span className="text-cyan-300 font-semibold">{sessionStats.totalMessages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Saved Versions:</span>
                    <span className="text-cyan-300 font-semibold">{sessionStats.totalVersions}</span>
                  </div>
                  
                  {sessionStats.hasHistory && (
                    <div className="pt-3 mt-3 border-t border-zinc-700/50">
                      <Button
                        onClick={clearHistory}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Clear All History
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Version History Controls */}
            {showVersionHistory && (
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle className="text-cyan-300">File Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.value)}
                    placeholder="Enter filename to view versions"
                    rows={1}
                    className="text-sm"
                  />
                </CardContent>
              </Card>
            )}

            {/* Pro Tips */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300">
                  <FaLightbulb className="w-4 h-4" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Specify frameworks: 'React with TypeScript'",
                    "Include requirements: 'responsive with dark mode'",
                    "Share error messages for debugging help",
                    "Your conversation history persists",
                    "File versions are automatically tracked"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-zinc-400">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Version History Panel */}
        {showVersionHistory && (
          <VersionHistory 
            filename={selectedFile}
            onSelectVersion={handleSelectVersion}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-zinc-500 text-sm border-t border-zinc-800/50 bg-zinc-900/30">
        <p>DEV-EON is your evolving development companion — powered by ENIC.0</p>
      </footer>
    </div>
  );
};

export default DevEonAppShell; 