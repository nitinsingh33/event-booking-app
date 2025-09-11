# PostgreSQL Local Setup Script for Windows
# Run this script after installing PostgreSQL

Write-Host "🐘 Setting up PostgreSQL for College Event Booking App..." -ForegroundColor Green

# Check if PostgreSQL is installed
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL not found in PATH. Please install PostgreSQL first." -ForegroundColor Red
    Write-Host "   Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL found at: $($pgPath.Source)" -ForegroundColor Green

# Test PostgreSQL connection
Write-Host "`n🔐 Testing PostgreSQL connection..." -ForegroundColor Cyan
Write-Host "You'll be prompted for the postgres user password (set during installation)" -ForegroundColor Yellow

try {
    # Create database and user
    Write-Host "`n📊 Creating database and user..." -ForegroundColor Cyan
    $sqlScript = Get-Content "scripts\setup_database.sql" -Raw
    
    # Run the SQL script
    $sqlScript | psql -U postgres -h localhost -p 5432
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database setup failed. Please check the error messages above." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error during database setup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test connection with new user
Write-Host "`n🧪 Testing connection with application user..." -ForegroundColor Cyan
$env:PGPASSWORD = "College123!"
$testResult = psql -U college_app_user -h localhost -p 5432 -d college_events_db -c "SELECT current_database(), current_user;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Application user connection successful!" -ForegroundColor Green
    Write-Host $testResult
} else {
    Write-Host "❌ Application user connection failed!" -ForegroundColor Red
    Write-Host $testResult
}

# Remove password from environment
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host "`n🎉 PostgreSQL setup complete!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: npm run db:migrate" -ForegroundColor White
Write-Host "   2. Run: npm run db:seed (optional)" -ForegroundColor White
Write-Host "   3. Run: npm start" -ForegroundColor White
Write-Host "   4. Test: http://localhost:5000/api/health" -ForegroundColor White
