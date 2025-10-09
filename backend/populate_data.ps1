Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "POPULATE DEMO DATA" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

.\.venv\Scripts\python.exe populate_data.py

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "DONE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

