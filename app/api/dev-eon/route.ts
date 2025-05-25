import { NextRequest, NextResponse } from 'next/server';

async function tryOpenAI(prompt: string) {
  try {
    // Dynamic import to avoid build-time errors if package isn't installed
    const openaiModule = await import('openai');
    const OpenAI = openaiModule.OpenAI || openaiModule.default;
    
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: `You are DEV-EON, an AI assistant integrated into the Eonic Vault development platform. You specialize in:

1. React/Next.js development
2. TypeScript implementation  
3. Tailwind CSS styling
4. Component architecture
5. Performance optimization
6. Code debugging and fixes

Guidelines:
- Be precise, modular, and production-ready
- Follow modern React patterns (hooks, functional components)
- Use TypeScript for type safety
- Implement responsive, accessible designs
- Include error handling and loading states
- Follow the existing codebase patterns (like the pylon system)
- Always include proper imports and exports
- Add helpful comments explaining complex logic

Keep responses focused on code with brief explanations when needed.`
        },
        { 
          role: 'user', 
          content: prompt 
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: `// DEV-EON Assistant (Demo Mode)
// Note: OpenAI API key not configured - using mock response

/*
 * Based on your prompt: "${prompt}"
 * 
 * Here's what I would help you with:
 * 1. Code generation and optimization
 * 2. Bug fixes and debugging assistance  
 * 3. Architecture recommendations
 * 4. Performance improvements
 * 5. Best practices implementation
 * 
 * To enable full AI functionality:
 * 1. Install OpenAI package: npm install openai
 * 2. Add OPENAI_API_KEY to your .env.local file
 * 3. Restart the development server
 */

// Example code structure based on your request:
export default function ExampleComponent() {
  return (
    <div className="p-4 bg-zinc-900 text-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Generated based on: ${prompt}</h1>
      <p className="text-zinc-400">This is a demo response. Install OpenAI package for full functionality.</p>
    </div>
  );
}`
      });
    }

    // Try to use OpenAI
    try {
      const result = await tryOpenAI(prompt);
      return NextResponse.json({ result });
    } catch (importError) {
      return NextResponse.json({
        result: `// DEV-EON Assistant - Setup Required

/*
 * OpenAI package not found. To enable full AI functionality:
 * 
 * 1. Install the OpenAI package:
 *    npm install openai
 * 
 * 2. Add your OpenAI API key to .env.local:
 *    OPENAI_API_KEY=your_api_key_here
 * 
 * 3. Restart the development server
 * 
 * Your prompt: "${prompt}"
 */

// Mock implementation for your request:
import React, { useState } from 'react';

export default function MockComponent() {
  const [data, setData] = useState(null);
  
  return (
    <div className="p-6 bg-zinc-900 text-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">
        Feature: ${prompt}
      </h2>
      <p className="text-zinc-400">
        This is a placeholder. Install OpenAI package for AI-generated code.
      </p>
    </div>
  );
}`
      });
    }
    
  } catch (error) {
    console.error('DEV-EON API Error:', error);
    
    // Return a helpful error message
    return NextResponse.json({
      result: `// DEV-EON Assistant - Error Occurred

/*
 * Error: ${error instanceof Error ? error.message : 'Unknown error'}
 * 
 * Troubleshooting steps:
 * 1. Install OpenAI package: npm install openai
 * 2. Check your OpenAI API key in .env.local
 * 3. Ensure you have sufficient API credits
 * 4. Verify your network connection
 * 5. Check the browser console for more details
 */

// Mock response for your request:
export default function ErrorComponent() {
  return (
    <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
      <h3 className="text-red-400 font-semibold">Setup Required</h3>
      <p className="text-red-300 text-sm mt-2">
        Please install the OpenAI package and configure your API key.
      </p>
    </div>
  );
}
`
    });
  }
} 