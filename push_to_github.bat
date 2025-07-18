@echo off
setlocal

:: Set your GitHub repo URL
set REPO_URL=https://github.com/aiandbotsgalore/elevenlabsclone.git

:: Detect if already git repo
if exist ".git" (
    echo Git repo detected.
) else (
    echo Initializing git repo...
    git init
)

:: Add all files
git add .

:: Make initial commit if needed
git diff --cached --quiet
if %errorlevel% neq 0 (
    git commit -m "Initial commit"
) else (
    echo No changes to commit.
)

:: Set branch to main
git branch -M main

:: Add or update remote origin
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin %REPO_URL%
) else (
    git remote set-url origin %REPO_URL%
)

:: Push to main branch
git push -u origin main

echo ==================================
echo Push to GitHub complete.
pause
