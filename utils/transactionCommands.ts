export type TransactionType = 'trade' | 'buy' | 'send' | 'pay' | 'transactionhelp';

export interface ParsedTransaction {
  type: TransactionType;
  token?: string;
  amount?: number;
  recipient?: string;
  reason?: string;
}

export interface TransactionLog {
  id: string;
  timestamp: Date;
  transaction: ParsedTransaction;
  status: 'pending' | 'completed' | 'failed';
}

const commandRegex = /^\/(?<type>trade|buy|send|pay|transactionhelp)(?:\s+(?<amount>\d*\.?\d+)\s*(?<token>[A-Za-z]+|\$[A-Za-z]+)(?:\s+(?:to|for|→)\s+(?<recipient>@\w+))?(?:\s+(?:for|:)\s+(?<reason>.+))?)?$/;

export function parseTransactionCommand(message: string): ParsedTransaction | null {
  const match = message.trim().match(commandRegex);
  if (!match?.groups) return null;

  const { type, amount, token, recipient, reason } = match.groups;
  
  // Special handling for transactionhelp command
  if (type === 'transactionhelp') {
    return { type: 'transactionhelp' };
  }

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return null;

  // Clean up token symbol
  const cleanToken = token.startsWith('$') ? token.slice(1) : token;

  return {
    type: type as TransactionType,
    token: cleanToken.toUpperCase(),
    amount: parsedAmount,
    recipient: recipient?.slice(1), // Remove @ from recipient
    reason: reason
  };
}

// Mock transaction history storage
const transactionHistory: TransactionLog[] = [];

export function logTransaction(transaction: ParsedTransaction): TransactionLog {
  const log: TransactionLog = {
    id: Math.random().toString(36).slice(2),
    timestamp: new Date(),
    transaction,
    status: 'completed' // Mock status, would be async in real implementation
  };
  
  transactionHistory.push(log);
  return log;
}

export function getTransactionHistory(): TransactionLog[] {
  return [...transactionHistory];
}

export function formatTransactionMessage(transaction: ParsedTransaction): string {
  const { type, amount, token, recipient, reason } = transaction;
  
  if (type === 'transactionhelp') {
    return `📚 **Transaction Commands Help**

Available commands:
• /trade [amount] [token] to @recipient [for reason]
• /buy [amount] [token] [for reason]
• /send [amount] [token] to @recipient [for reason]
• /pay [amount] [token] to @recipient [for reason]

Examples:
• /trade 0.5 SOL to @john for testing
• /buy 100 EONIC for investment
• /send 50 USDC to @alice for lunch
• /pay 25 EONIC to @bob for services

Notes:
• Amount must be a positive number
• Token can be written as SOL or $EONIC
• Recipient must start with @
• Reason is optional but must start with "for"`;
  }
  
  let message = `🧾 ${type.toUpperCase()}: ${amount} ${token}`;
  
  if (recipient) {
    message += ` → @${recipient}`;
  }
  
  if (reason) {
    message += `\n📝 Reason: ${reason}`;
  }
  
  return message;
} 