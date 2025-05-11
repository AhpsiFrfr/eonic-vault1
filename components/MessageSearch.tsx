"use client";

import { useState } from "react";

export default function MessageSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full p-2">
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
        placeholder="Search messages..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
    </div>
  );
} 