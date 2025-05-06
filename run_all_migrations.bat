@echo off
echo Running migrations...

set PGUSER=postgres
set PGPASSWORD=your_password
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=eonic

echo Running create_profiles.sql...
psql -f migrations/create_profiles.sql

echo Running solana_domain_setup.sql...
psql -f migrations/solana_domain_setup.sql

echo Running add_solana_domain.sql...
psql -f migrations/add_solana_domain.sql

echo Running fix_rls_policies.sql...
psql -f migrations/fix_rls_policies.sql

echo Migrations completed!
pause 