# Test script to check if the server is running
Write-Host "Testing server connection..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Server is running on port 5173" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5175" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ Server is running on port 5175" -ForegroundColor Green
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Server is not running on ports 5173 or 5175" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} 