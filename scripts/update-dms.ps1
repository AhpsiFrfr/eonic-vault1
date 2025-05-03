# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Error "Error: .env.local file not found"
    exit 1
}

# Get environment variables from .env.local
$envContent = Get-Content .env.local
foreach ($line in $envContent) {
    if ($line -match '^\s*([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim() -replace '["'']'
        [Environment]::SetEnvironmentVariable($name, $value)
        Write-Host "Set environment variable: $name"
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:NEXT_PUBLIC_SUPABASE_SERVICE_KEY

# Verify environment variables
if (-not $supabaseUrl) {
    Write-Error "Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
    exit 1
}

if (-not $supabaseKey) {
    Write-Error "Error: NEXT_PUBLIC_SUPABASE_SERVICE_KEY not found in .env.local"
    exit 1
}

Write-Host "Using Supabase URL: $supabaseUrl"

# Check if SQL file exists
if (-not (Test-Path .\utils\supabase-dms-update.sql)) {
    Write-Error "Error: supabase-dms-update.sql not found"
    exit 1
}

# Apply SQL changes
$sqlContent = Get-Content .\utils\supabase-dms-update.sql -Raw
$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
}

$body = @{
    "query" = $sqlContent
}

try {
    # First, create a new query
    $createBody = @{
        name = "update_dms_policies"
        sql = $sqlContent
        description = "Update DM policies and functions"
    }
    
    $createResponse = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/sql" -Method POST -Headers $headers -Body ($createBody | ConvertTo-Json) -ContentType "application/json"
    Write-Host "SQL query created successfully"

    # Then execute it
    $executeResponse = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/sql/query/update_dms_policies" -Method POST -Headers $headers -Body "{}" -ContentType "application/json"
    Write-Host "SQL update completed successfully"
} catch {
    Write-Error "Error executing SQL: $_"
    Write-Host "Response: $_.ErrorDetails.Message"
    exit 1
}
