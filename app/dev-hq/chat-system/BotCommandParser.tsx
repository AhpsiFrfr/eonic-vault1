'use client';

import React, { useState, useRef } from 'react';

interface BotCommandParserProps {
  onExecute: (result: any) => void;
  onClose: () => void;
}

interface CommandResult {
  success: boolean;
  message: string;
}

interface Command {
  name: string;
  description: string;
  usage: string;
  example: string;
}

// @dev-vault-component
export default function BotCommandParser({ onExecute, onClose }: BotCommandParserProps) {
  const [command, setCommand] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Command[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<CommandResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Available bot commands
  const availableCommands = [
    { 
      name: 'help', 
      description: 'Show available commands',
      usage: '/help [command]',
      example: '/help status'
    },
    { 
      name: 'status', 
      description: 'Check system status',
      usage: '/status [component]',
      example: '/status quantum'
    },
    { 
      name: 'debug', 
      description: 'Toggle debug mode',
      usage: '/debug [on|off]',
      example: '/debug on'
    },
    { 
      name: 'simulate', 
      description: 'Simulate user activity',
      usage: '/simulate users [count] [duration]',
      example: '/simulate users 5 10m'
    },
    { 
      name: 'stress', 
      description: 'Run stress test',
      usage: '/stress [component] [level]',
      example: '/stress chat high'
    },
    { 
      name: 'export', 
      description: 'Export chat history',
      usage: '/export [format] [from] [to]',
      example: '/export json 2025-01-01 2025-01-31'
    }
  ];
  
  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle input change and show suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommand(value);
    
    if (value.startsWith('/')) {
      const commandText = value.slice(1).toLowerCase();
      if (commandText) {
        const matchedCommands = availableCommands.filter(cmd => 
          cmd.name.toLowerCase().includes(commandText)
        );
        setSuggestions(matchedCommands);
      } else {
        setSuggestions(availableCommands);
      }
    } else {
      setSuggestions([]);
    }
  };
  
  // Handle command execution
  const executeCommand = () => {
    if (!command.startsWith('/')) return;
    
    const parts = command.slice(1).split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    const matchedCommand = availableCommands.find(cmd => cmd.name === commandName);
    
    if (!matchedCommand) {
      setResult({
        success: false,
        message: `Unknown command: ${commandName}`
      });
      return;
    }
    
    setIsExecuting(true);
    
    // In a real implementation, this would call an API or execute the command
    // For now, we'll simulate execution with mock results
    setTimeout(() => {
      let mockResult;
      
      switch (commandName) {
        case 'help':
          if (args.length > 0) {
            const helpCommand = availableCommands.find(cmd => cmd.name === args[0]);
            if (helpCommand) {
              mockResult = {
                success: true,
                message: `Command: ${helpCommand.name}\nDescription: ${helpCommand.description}\nUsage: ${helpCommand.usage}\nExample: ${helpCommand.example}`
              };
            } else {
              mockResult = {
                success: false,
                message: `Unknown command: ${args[0]}`
              };
            }
          } else {
            mockResult = {
              success: true,
              message: 'Available commands:\n' + availableCommands.map(cmd => `/${cmd.name} - ${cmd.description}`).join('\n')
            };
          }
          break;
          
        case 'status':
          mockResult = {
            success: true,
            message: args.length > 0 
              ? `Status for ${args[0]}: Online (100% operational)`
              : 'All systems operational. Quantum engine: 100%, Chat system: 100%, Voice system: 100%'
          };
          break;
          
        case 'debug':
          mockResult = {
            success: true,
            message: args[0] === 'on' 
              ? 'Debug mode enabled. Verbose logging activated.'
              : args[0] === 'off'
                ? 'Debug mode disabled. Returning to normal logging.'
                : 'Debug mode toggled. Current state: ON'
          };
          break;
          
        case 'simulate':
          if (args[0] === 'users' && args.length > 1) {
            const count = parseInt(args[1]) || 5;
            const duration = args[2] || '5m';
            mockResult = {
              success: true,
              message: `Simulating ${count} users for ${duration}. Simulation ID: SIM-${Date.now().toString(36).toUpperCase()}`
            };
          } else {
            mockResult = {
              success: false,
              message: 'Invalid simulation parameters. Usage: /simulate users [count] [duration]'
            };
          }
          break;
          
        case 'stress':
          if (args.length >= 2) {
            mockResult = {
              success: true,
              message: `Running ${args[1]} stress test on ${args[0]}. Test ID: STRESS-${Date.now().toString(36).toUpperCase()}`
            };
          } else {
            mockResult = {
              success: false,
              message: 'Invalid stress test parameters. Usage: /stress [component] [level]'
            };
          }
          break;
          
        case 'export':
          if (args.length >= 1) {
            mockResult = {
              success: true,
              message: `Exporting chat history to ${args[0]} format. Export ID: EXP-${Date.now().toString(36).toUpperCase()}`
            };
          } else {
            mockResult = {
              success: false,
              message: 'Invalid export parameters. Usage: /export [format] [from] [to]'
            };
          }
          break;
          
        default:
          mockResult = {
            success: false,
            message: `Command not implemented: ${commandName}`
          };
      }
      
      setResult(mockResult);
      setIsExecuting(false);
      
      // Call the onExecute callback with the result
      if (onExecute) {
        onExecute({
          command: commandName,
          args,
          result: mockResult
        });
      }
    }, 500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setCommand('/' + suggestions[0].name + ' ');
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  
  const selectSuggestion = (suggestion: Command) => {
    setCommand('/' + suggestion.name + ' ');
    inputRef.current?.focus();
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <h3 className="text-white font-medium">Bot Commands</h3>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Command Input */}
      <div className="p-3 border-b border-zinc-700">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command (e.g. /help)"
            className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            value={command}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
            onClick={executeCommand}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="max-h-40 overflow-y-auto border-b border-zinc-700">
          {suggestions.map(suggestion => (
            <div 
              key={suggestion.name}
              className="p-2 hover:bg-zinc-700 cursor-pointer"
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="flex items-center">
                <span className="text-blue-400 font-mono">/{suggestion.name}</span>
                <span className="ml-2 text-zinc-400 text-sm">{suggestion.description}</span>
              </div>
              <div className="text-xs text-zinc-500 mt-1 font-mono">
                {suggestion.usage}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Result */}
      {result && (
        <div className={`p-3 border-b border-zinc-700 ${result.success ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
          <h4 className={`text-sm font-medium mb-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
            {result.success ? 'Command executed successfully' : 'Command failed'}
          </h4>
          <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">
            {result.message}
          </pre>
        </div>
      )}
      
      {/* Help Text */}
      <div className="p-3 text-xs text-zinc-500">
        <p>Type a command starting with / or select from suggestions.</p>
        <p>Press Tab to autocomplete, Enter to execute.</p>
      </div>
    </div>
  );
}
