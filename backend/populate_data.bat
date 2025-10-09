@echo off
echo ============================================================
echo POPULATE DEMO DATA
echo ============================================================
echo.

.\.venv\Scripts\python.exe populate_data.py

echo.
echo ============================================================
echo DONE! Press any key to exit...
echo ============================================================
pause >nul

