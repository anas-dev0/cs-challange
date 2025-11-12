# 📦 Git Setup & GitHub Upload Instructions

## Step 1: Initialize Git Repository

Open PowerShell in the project root directory:

```powershell
cd d:\oussema\cs_challenge\utopia-hire

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: UtopiaHire AI Skills Gap Analyzer"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in top right → **"New repository"**
3. Fill in repository details:
   - **Repository name:** `utopia-hire`
   - **Description:** "AI-Powered Skills Gap Analyzer using GLiNER & Google Gemini"
   - **Visibility:** Public or Private
   - ⚠️ **DO NOT** initialize with README (we already have one)
4. Click **"Create repository"**

## Step 3: Connect Local Repository to GitHub

GitHub will show you commands like this. Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/utopia-hire.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files including:
   - ✅ README.md
   - ✅ backend/ folder
   - ✅ frontend/ folder
   - ✅ .gitignore

## Step 5: Update README with Your GitHub Username

1. Open `README.md`
2. Replace `YOUR_USERNAME` with your actual GitHub username in these sections:
   - Clone URL
   - Author section
   - Support links

## 📝 Useful Git Commands

### Check status
```bash
git status
```

### Stage new changes
```bash
git add .
```

### Commit changes
```bash
git commit -m "Description of changes"
```

### Push to GitHub
```bash
git push
```

### View commit history
```bash
git log --oneline
```

## 🔐 Important Security Notes

**Before pushing, make sure:**

1. ✅ `.env` files are in `.gitignore` (they are!)
2. ✅ Your Google API key is NOT committed
3. ✅ `venv/` and `node_modules/` are ignored (they are!)

To verify what will be committed:
```bash
git status
```

If you accidentally added `.env`:
```bash
git rm --cached backend/.env
git commit -m "Remove .env from tracking"
```

## 🎯 Quick Reference

```bash
# Full workflow for new changes
git add .
git commit -m "Add new feature"
git push

# Create a new branch
git checkout -b feature-name

# Switch back to main
git checkout main

# Pull latest changes
git pull
```

## 🚀 Next Steps

After pushing to GitHub:

1. Add topics/tags: `ai`, `fastapi`, `react`, `nlp`, `skills-analysis`
2. Add a description
3. Enable Issues for bug tracking
4. Consider adding:
   - LICENSE file (MIT recommended)
   - CONTRIBUTING.md
   - Screenshots in README
   - GitHub Actions for CI/CD

---

✅ **Your project is now on GitHub!** Share the link with others!
