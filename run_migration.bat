@echo off
echo Running Solana domain migration...
npx supabase db push migrations/solana_domain_setup.sql
echo Migration completed! 