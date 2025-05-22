'use client';

import React, { useState, useRef } from 'react';

// @dev-vault-component
export default function ProfilePreview({ user, onClose }) {
  const {
    id,
    name,
    status,
    profilePic,
    xpLevel,
    timepiece,
    isAdmin,
    joinDate = '2025-01-15',
    bio = 'Dev Vault contributor and quantum engine specialist.',
    badges = ['Early Adopter', 'Bug Hunter', 'Contributor'],
    projects = ['Quantum Engine', 'Dev Vault', 'ENIC Integration']
  } = user;
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-4 w-72">
      {/* Header with profile pic and basic info */}
      <div className="flex items-start mb-4">
        <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden mr-3">
          <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-2xl">
            {name.charAt(0)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-bold text-white">{name}</h3>
            {isAdmin && (
              <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-300 px-1.5 py-0.5 rounded">
                Admin
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-zinc-400 mt-1">
            <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-zinc-500'} mr-1`}></span>
            {status === 'online' ? 'Online' : `Last seen recently`}
          </div>
          
          <div className="flex items-center mt-2">
            <span className="text-xs bg-blue-900/30 text-blue-300 px-1.5 py-0.5 rounded">
              LVL {xpLevel}
            </span>
            {timepiece === 'quantum' && (
              <span className="ml-2 text-xs bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded">
                Quantum
              </span>
            )}
            {timepiece === 'restricted' && (
              <span className="ml-2 text-xs bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded">
                Restricted
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Bio */}
      <div className="mb-4">
        <h4 className="text-xs uppercase text-zinc-500 mb-1">Bio</h4>
        <p className="text-sm text-zinc-300">{bio}</p>
      </div>
      
      {/* Badges */}
      <div className="mb-4">
        <h4 className="text-xs uppercase text-zinc-500 mb-1">Badges</h4>
        <div className="flex flex-wrap gap-1">
          {badges.map((badge, index) => (
            <span key={index} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </div>
      
      {/* Projects */}
      <div className="mb-4">
        <h4 className="text-xs uppercase text-zinc-500 mb-1">Projects</h4>
        <div className="text-sm text-zinc-300">
          {projects.join(', ')}
        </div>
      </div>
      
      {/* Member since */}
      <div className="text-xs text-zinc-500">
        Member since {new Date(joinDate).toLocaleDateString()}
      </div>
      
      {/* Actions */}
      <div className="flex justify-between mt-4 pt-3 border-t border-zinc-700">
        <button className="text-sm text-blue-400 hover:text-blue-300">
          Message
        </button>
        <button className="text-sm text-blue-400 hover:text-blue-300">
          View Profile
        </button>
        <button 
          className="text-sm text-zinc-400 hover:text-zinc-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
