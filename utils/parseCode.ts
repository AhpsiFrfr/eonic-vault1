export const extractCode = (raw: string): string => {
  // Try to extract code from code blocks first
  const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g;
  const matches = raw.match(codeBlockRegex);
  
  if (matches && matches.length > 0) {
    // Get the first code block and remove the backticks and language identifier
    const firstMatch = matches[0];
    return firstMatch.replace(/```[\w]*\n?/, '').replace(/```$/, '').trim();
  }
  
  // If no code blocks found, return the raw content
  return raw;
};

export const extractAllCodeBlocks = (raw: string): string[] => {
  const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g;
  const blocks: string[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(raw)) !== null) {
    const code = match[1].trim();
    if (code) {
      blocks.push(code);
    }
  }
  
  return blocks;
};

export const getLanguageFromCodeBlock = (raw: string): string | null => {
  const languageMatch = raw.match(/```(\w+)/);
  return languageMatch ? languageMatch[1] : null;
};

export const formatCodeForDisplay = (code: string, language?: string): string => {
  // Basic formatting - could be enhanced with syntax highlighting later
  return code.trim();
};

export const isCodeResponse = (content: string): boolean => {
  // Check if the response contains code blocks or looks like code
  return content.includes('```') || 
         content.includes('function ') || 
         content.includes('const ') || 
         content.includes('import ') || 
         content.includes('export ') ||
         content.includes('<div') ||
         content.includes('className=');
}; 