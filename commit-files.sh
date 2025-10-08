#!/bin/bash

# Lấy danh sách tất cả các file chưa được track hoặc đã modified
files=$(git status --porcelain | awk '{print $2}')

# Loop qua từng file và commit riêng
for file in $files; do
    if [ -f "$file" ]; then
        git add "$file"
        git commit -m "feat: add $file - version 1.0"
        echo "Committed: $file"
    fi
done

echo "All files committed individually!"
