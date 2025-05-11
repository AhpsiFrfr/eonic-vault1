'use client';

import { useState, useEffect } from 'react';

interface EonIDWidgetSelectorProps {
  activeWidgets: string[];
  onToggleWidget: (widgetId: string) => void;
}

const availableWidgets = [
  { id: "DisplayName", label: "Display Name" },
  { id: "Domain", label: "Vault Domain" },
  { id: "Timepiece", label: "Timepiece Stage" },
  { id: "XPLevel", label: "XP Level" },
  { id: "EonicHoldings", label: "EONIC Holdings" },
  { id: "NFTGallery", label: "NFT Gallery" },
  { id: "Links", label: "Business Links" },
  { id: "Logos", label: "Logos/Brands" }
];

export default function EonIDWidgetSelector({ activeWidgets, onToggleWidget }: EonIDWidgetSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Customize Widgets</h3>
      <p className="text-sm text-gray-400">Select which components to display on your EON-ID</p>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {availableWidgets.map(widget => (
          <button
            key={widget.id}
            onClick={() => onToggleWidget(widget.id)}
            className={`px-3 py-1 rounded ${
              activeWidgets.includes(widget.id) ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {widget.label}
          </button>
        ))}
      </div>
    </div>
  );
} 