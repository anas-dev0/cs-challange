# 🚀 Upload to GitHub - Step by Step Guide

## ✅ Prerequisites Check

Make sure you have:
- [x] Git installed on your computer
- [x] GitHub account created at https://github.com

---

## 📝 STEP 1: Create GitHub Repository (Browser)

1. **Go to GitHub** and log in: https://github.com/login

2. **Click the "+" icon** in the top right corner

3. **Select "New repository"**

4. **Fill in the details:**
   - **Repository name:** `utopia-hire`
   - **Description:** `AI-Powered Skills Gap Analyzer using GLiNER & Google Gemini`
   - **Visibility:** Choose **Public** (recommended for portfolio) or **Private**
   - ⚠️ **IMPORTANT:** Leave these UNCHECKED:
     - [ ] Add a README file
     - [ ] Add .gitignore
     - [ ] Choose a license

5. **Click "Create repository"**

---

## 💻 STEP 2: Initialize Git & Push (Terminal)

Open PowerShell and run these commands **one by one**:

### Navigate to project directory
```powershell
cd d:\oussema\cs_challenge\utopia-hire
```

### Initialize Git repository
```powershell
git init
```

### Configure Git (if first time using Git)
```powershell
git config --global user.name "Oussema Harrabi"
git config --global user.email "your-email@example.com"
```

### Add all files to Git
```powershell
git add .
```

### Check what will be committed (optional)
```powershell
git status
```

### Create first commit
```powershell
git commit -m "Initial commit: UtopiaHire AI Skills Gap Analyzer"
```

### Rename branch to main
```powershell
git branch -M main
```

### Connect to GitHub repository
```powershell
git remote add origin https://github.com/OussemaHarrabi/utopia-hire.git
```

### Push to GitHub
```powershell
git push -u origin main
```

---

## ✅ STEP 3: Verify Upload

1. Go to: https://github.com/OussemaHarrabi/utopia-hire
2. Refresh the page
3. You should see:
   - ✅ README.md displaying nicely
   - ✅ backend/ folder
   - ✅ frontend/ folder
   - ✅ All your code files

---

## 🎯 STEP 4: Enhance Your Repository (Optional)

### Add Topics/Tags
1. Click "⚙️" next to "About" on the right side
2. Add topics: `ai`, `fastapi`, `react`, `nlp`, `skills-analysis`, `gliner`, `gemini-ai`
3. Click "Save changes"

### Add Description
In the same section, add:
> AI-powered skills gap analyzer using GLiNER NER model and Google Gemini AI for career development recommendations

### Enable Discussions (Optional)
- Settings → General → Features → Check "Discussions"

---

## 🔄 Future Updates - How to Push New Changes

Whenever you make changes to your code:

```powershell
# 1. Navigate to project
cd d:\oussema\cs_challenge\utopia-hire

# 2. Check what changed
git status

# 3. Add all changes
git add .

# 4. Commit with a message
git commit -m "Description of what you changed"

# 5. Push to GitHub
git push
```

---

## 🆘 Troubleshooting

### Error: "fatal: not a git repository"
```powershell
# Make sure you're in the right directory
cd d:\oussema\cs_challenge\utopia-hire
git init
```

### Error: "Author identity unknown"
```powershell
git config --global user.name "Oussema Harrabi"
git config --global user.email "your-email@example.com"
```

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/OussemaHarrabi/utopia-hire.git
```

### Authentication Issues
If asked for password, use a **Personal Access Token** instead:
1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Select scopes: `repo` (all)
3. Copy the token and use it as password

---

## 📸 Add Screenshots (Recommended)

1. Take screenshots of your working application
2. Create `screenshots/` folder in your project
3. Add images to README.md:

```markdown
## 📸 Screenshots

![Skills Gap Analysis](screenshots/analysis.png)
![Career Recommendations](screenshots/recommendations.png)
```

---

## ✨ Your Repository URL

After pushing, your project will be available at:
**https://github.com/OussemaHarrabi/utopia-hire**

Share this link on:
- LinkedIn
- Your resume
- Your portfolio website

---

## 🎉 Congratulations!

Your AI Skills Gap Analyzer is now live on GitHub! 🚀

**Next steps:**
1. Add the GitHub link to your LinkedIn profile
2. Write a LinkedIn post about your project
3. Star your own repository ⭐
4. Continue improving the project

---

**Need help?** Open an issue on GitHub or reach out!
