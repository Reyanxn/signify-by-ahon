param(
  [switch]$HostingOnly,
  [switch]$FunctionsOnly,
  [string]$Project = "signify-by-ahon"
)

$ErrorActionPreference = "Stop"
$rootDir = $PSScriptRoot

Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  SIGNIFY BY AHON - FIREBASE DEPLOY  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if logged in
npx firebase-tools projects:list 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Not logged into Firebase." -ForegroundColor Red
  Write-Host "   Run this command in your terminal (opens browser):" -ForegroundColor Yellow
  Write-Host "   npx firebase-tools login" -ForegroundColor White
  exit 1
}

Write-Host "✓ Firebase logged in" -ForegroundColor Green

# Build frontend
Write-Host ""
Write-Host "[1/3] Building frontend..." -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }
Write-Host "✓ Frontend built" -ForegroundColor Green

# Set up backend uploads
if (-not $HostingOnly) {
  Write-Host ""
  Write-Host "[2/3] Preparing backend..." -ForegroundColor Yellow
  if (Test-Path "$rootDir\functions") {
    Copy-Item "$rootDir\backend\*.js" "$rootDir\functions\" -Force
    Copy-Item "$rootDir\backend\package.json" "$rootDir\functions\package.json" -Force
  }
  Write-Host "✓ Backend ready" -ForegroundColor Green
}

# Deploy
Write-Host ""
Write-Host "[3/3] Deploying to Firebase..." -ForegroundColor Yellow
Set-Location $rootDir

$deployTarget = ""
if ($HostingOnly) { $deployTarget = "--only hosting" }
if ($FunctionsOnly) { $deployTarget = "--only functions" }

npx firebase-tools deploy $deployTarget "--project=$Project"
if ($LASTEXITCODE -ne 0) { throw "Deploy failed" }

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       ✓ DEPLOYED SUCCESSFULLY!      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: https://$Project.web.app" -ForegroundColor White
Write-Host "API:      https://$Project.cloudfunctions.net/api" -ForegroundColor White
Write-Host "Admin:    https://$Project.web.app/admin" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login: admin@signifyahon.com / admin123" -ForegroundColor Gray
