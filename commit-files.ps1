# Lấy danh sách các file
$files = git status --porcelain | ForEach-Object { $_.Substring(3) }

# Commit từng file
foreach ($file in $files) {
    if (Test-Path $file) {
        git add $file
        git commit -m "feat: add $file - version 1.0"
        Write-Host "Committed: $file"
    }
}

Write-Host "All files committed individually!"
