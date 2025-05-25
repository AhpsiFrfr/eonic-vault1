# DEV-EON Assistant Pylon Setup Guide

## Overview
The DEV-EON Assistant Pylon is an AI-powered development assistant integrated into the Eonic Vault platform. It provides code generation, debugging assistance, and development guidance.

## Features
- **Code Generation**: Generate React/Next.js components, TypeScript functions, and more
- **Debugging Assistance**: Help identify and fix code issues
- **Architecture Guidance**: Recommendations for component structure and best practices
- **Real-time Interaction**: Chat-like interface with immediate responses
- **Code History**: Keep track of generated code snippets with timestamps
- **Copy to Clipboard**: Easy copying of generated code

## Setup Instructions

### 1. Install Dependencies
The OpenAI package is already installed. If you need to reinstall:
```bash
npm install openai
```

### 2. Configure API Key
Add your OpenAI API key to your `.env.local` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Restart Development Server
```bash
npm run dev
```

## Usage

1. **Access the Pylon**: Navigate to the dashboard at `http://localhost:3000/dashboard`
2. **Find DEV-EON**: Look for the DEV-EON pylon with the code icon
3. **Enter Prompts**: Describe what you want to build, debug, or optimize
4. **Generate Code**: Click "Generate" or press Ctrl+Enter
5. **Copy Results**: Use the copy button to copy generated code
6. **Clear History**: Use the clear button to remove old results

## Example Prompts

- "Create a React component for a user profile card"
- "Debug this TypeScript error: [paste your error]"
- "Optimize this function for better performance"
- "Create a responsive navigation component with Tailwind CSS"
- "Generate a custom hook for API data fetching"

## Demo Mode
If no OpenAI API key is configured, the pylon will run in demo mode with helpful mock responses and setup instructions.

## Integration
The DEV-EON pylon is fully integrated with:
- Dashboard state management (Zustand)
- Hover effects and glow animations
- ENIC.0 commentary system
- Pylon control sidebar
- Responsive grid layout

## Troubleshooting

### Common Issues
1. **"Cannot find module 'openai'"**: Run `npm install openai`
2. **"API key not configured"**: Add `OPENAI_API_KEY` to `.env.local`
3. **"Network error"**: Check your internet connection and API key validity
4. **"Rate limit exceeded"**: Wait a moment and try again, or check your OpenAI usage

### Support
The pylon includes comprehensive error handling and will provide helpful error messages and troubleshooting steps when issues occur. 