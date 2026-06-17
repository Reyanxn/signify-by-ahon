# Start MongoDB (if installed locally)
# & "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db" &

# Start Backend
Start-Process powershell -ArgumentList "-NoExit -Command cd `"$PSScriptRoot\backend`"; npm run dev"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit -Command cd `"$PSScriptRoot\frontend`"; npm run dev"

Write-Host "Backend and Frontend starting..."
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
Write-Host ""
Write-Host "Default Admin: admin@signifyahon.com / admin123"
