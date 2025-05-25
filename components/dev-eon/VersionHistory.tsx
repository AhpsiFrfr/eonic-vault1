'use client'

import React, { useState, useEffect } from 'react';
import { FaHistory, FaClock, FaCode, FaDownload, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

interface FileVersion {
  timestamp: string;
  content: string;
  filename: string;
}

interface VersionHistoryProps {
  filename: string;
  onSelectVersion?: (content: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ filename, onSelectVersion }) => {
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadVersions();
  }, [filename]);

  const loadVersions = () => {
    try {
      const versionLog = localStorage.getItem('dev-eon-versions');
      if (!versionLog) return;
      
      const parsed = JSON.parse(versionLog);
      const fileVersions = parsed[filename] || [];
      setVersions(fileVersions.reverse()); // Show newest first
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const toggleVersionExpanded = (index: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedVersions(newExpanded);
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    } catch {
      return { date: 'Unknown', time: 'Unknown' };
    }
  };

  if (!filename) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700/50 rounded-xl text-center">
        <FaHistory className="text-2xl text-zinc-500 mx-auto mb-3" />
        <p className="text-sm text-zinc-400">Select a file to view version history</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700/50 rounded-xl text-center">
        <FaHistory className="text-2xl text-zinc-500 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-zinc-300 mb-2">No Version History</h4>
        <p className="text-xs text-zinc-400">Save files to start tracking versions</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 px-4 py-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FaHistory className="text-white text-xs" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-cyan-300">Version History</h4>
            <p className="text-xs text-zinc-400">{filename} - {versions.length} versions</p>
          </div>
        </div>
      </div>

      {/* Versions List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
        {versions.map((version, index) => {
          const { date, time } = formatTimestamp(version.timestamp);
          const isExpanded = expandedVersions.has(index);
          
          return (
            <div key={index} className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
              {/* Version Header */}
              <div className="flex items-center justify-between p-3 border-b border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-cyan-300 font-medium">v{versions.length - index}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <FaClock className="text-xs text-cyan-400" />
                      <span>{date} at {time}</span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {version.content.split('\n').length} lines, {version.content.length} characters
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(version.content)}
                    className="p-1.5 text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded transition-colors"
                    title="Copy content"
                  >
                    <FaDownload className="text-xs" />
                  </button>
                  {onSelectVersion && (
                    <button
                      onClick={() => onSelectVersion(version.content)}
                      className="p-1.5 text-xs bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded transition-colors"
                      title="Use this version"
                    >
                      <FaCode className="text-xs" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleVersionExpanded(index)}
                    className="p-1.5 text-xs bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-300 rounded transition-colors"
                    title={isExpanded ? "Hide content" : "Show content"}
                  >
                    {isExpanded ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              {/* Version Content */}
              {isExpanded && (
                <div className="p-3">
                  <pre className="text-xs bg-zinc-900/50 p-3 rounded border border-zinc-600/50 overflow-x-auto text-zinc-200 whitespace-pre-wrap max-h-40 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                    {version.content}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionHistory; 