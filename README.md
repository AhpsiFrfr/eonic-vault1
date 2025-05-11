# Eonic Vault

A Next.js application for managing and interacting with Eonic NFTs.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [YOUR_REPOSITORY_URL]
   cd eonic-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key

   # Solana Configuration
   NEXT_PUBLIC_SOLANA_RPC_URL=your_solana_rpc_url
   NEXT_PUBLIC_EONIC_MINT_ADDRESS=your_eonic_mint_address

   # Next.js Configuration
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SUPABASE_SERVICE_KEY`: Your Supabase service key
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint URL
- `NEXT_PUBLIC_EONIC_MINT_ADDRESS`: Eonic NFT mint address

## Development

- The project uses Next.js for the frontend
- Supabase for the backend database
- Solana for blockchain interactions

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Your License Here]
