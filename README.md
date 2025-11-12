# 🎯 UtopiaHire - AI-Powered Skills Gap Analyzer

An intelligent web application that analyzes CVs against job descriptions to identify skills gaps and provide personalized career development recommendations using AI.

![Skills Gap Analysis](https://img.shields.io/badge/AI-Powered-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.121.1-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Python](https://img.shields.io/badge/Python-3.12-yellow)

## 🌟 Features

### Core Functionality
- **📄 CV Upload & Parsing** - Upload PDF resumes for automatic skill extraction
- **🎯 Job Description Analysis** - Paste job requirements for comparison
- **🤖 AI-Powered Skill Extraction** - Uses GLiNER (Zero-shot NER) to identify skills
- **📊 Quantitative Analysis** - Market demand statistics from 316K+ job postings
- **🧠 AI Career Coaching** - Google Gemini AI provides personalized recommendations
- **📈 Skills Gap Visualization** - Interactive proficiency assessments
- **🎓 Learning Paths** - Curated resources to close skill gaps
- **✨ Resume Improvement Suggestions** - AI-generated before/after edits

### Advanced Features
- **ESCO Taxonomy Normalization** - 13,939 standardized skills from European Skills/Competences/Occupations
- **Market Demand Insights** - Real-world job market data analysis
- **Proficiency Level Assessment** - Beginner to Expert skill ratings
- **Priority Action Plans** - Difficulty and time estimates for skill development
- **Dark Mode Support** - Beautiful UI with theme switching

---

## 🏗️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.121.1 | High-performance REST API framework |
| **GLiNER** | urchade/gliner_base | Zero-shot Named Entity Recognition for skill extraction |
| **Google Gemini AI** | gemini-1.5-flash-latest | AI-powered proficiency analysis & career coaching |
| **PyTorch** | 2.6.0 | Deep learning framework for GLiNER |
| **pandas** | 2.3.3 | Data manipulation and analysis |
| **pdfplumber** | 0.11.4 | PDF text extraction |
| **python-dotenv** | 1.0.1 | Environment variable management |
| **Uvicorn** | 0.34.0 | ASGI server with auto-reload |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 4.9.5 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.15 | Utility-first CSS framework |
| **Lucide React** | 0.553.0 | Beautiful icons |
| **Sonner** | 2.0.7 | Toast notifications |
| **clsx** | 2.1.1 | Conditional className utilities |

### Data Sources
- **ESCO Skills Taxonomy** - 13,939 standardized European skills
- **USA Job Posting Dataset** - 316,279 job market records

---

## 📁 Project Structure

```
utopia-hire/
├── backend/
│   ├── api/
│   │   └── analysis.py          # API endpoints (quantitative & AI analysis)
│   ├── core/
│   │   ├── ai_analyzer.py       # Google Gemini AI integration
│   │   ├── data_loader.py       # ESCO & job data loader (singleton)
│   │   └── skill_extractor.py   # GLiNER-based skill extraction
│   ├── data/
│   │   ├── skills_en.csv        # ESCO skills taxonomy
│   │   └── usa_job_posting_dataset.csv  # Job market data
│   ├── venv/                    # Python virtual environment
│   ├── .env                     # Environment variables (GOOGLE_API_KEY)
│   ├── .gitignore
│   ├── main.py                  # FastAPI application entrypoint
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ThemeProvider.tsx    # Dark mode context provider
│   │   ├── lib/
│   │   │   └── types.ts             # TypeScript interfaces
│   │   ├── pages/
│   │   │   └── CVTool.tsx           # Main application page
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css               # Tailwind + custom styles
│   ├── .env                        # Frontend config (API URL)
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.12+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get Free Key](https://aistudio.google.com/app/apikey)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/OussemaHarrabi/skills-gap-analysis.git
cd skills-gap-analysis
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create .env file and add your Google API key:
echo GOOGLE_API_KEY=your_api_key_here > .env
```

**⚠️ Important:** Replace `your_api_key_here` with your actual Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

#### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
# From backend/ directory with activated virtual environment
cd backend
venv\Scripts\activate  # Windows
python main.py
```

**Expected Output:**
```
🚀 Server is starting up...
✅ Loaded 13,939 ESCO skills.
✅ Pre-computation finished in 41.01 seconds.
✅ GLiNER model loaded successfully.
✅ Gemini AI model configured successfully.
INFO:     Uvicorn running on http://127.0.0.1:8000
Server is ready to accept requests.
```

⏱️ **First-time startup takes ~40-50 seconds** (pre-computing market demand statistics)

### Start Frontend Development Server

```bash
# From frontend/ directory (in a new terminal)
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

Local:            http://localhost:3000
On Your Network:  http://172.25.64.1:3000
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎮 How to Use

1. **Upload Your CV (PDF)**
   - Click "Click to upload or drag & drop" in step 1
   - Select a PDF resume

2. **Enter Job Title** (Optional)
   - Add the target position (e.g., "Senior Financial Analyst")

3. **Paste Job Description**
   - Copy the full job description from a job posting
   - Paste into the textarea

4. **Click "Analyze My Skills Gap"**
   - Wait 10-30 seconds for AI processing

5. **Review Results**
   - **Quantitative Summary:** Overall match percentage
   - **AI Scores:** Coverage, Depth, Recency ratings
   - **CV Skill Profile:** Your detected skills with proficiency levels
   - **Skills Gap:** Missing skills ranked by market demand
   - **Priority Actions:** Step-by-step improvement plan
   - **Learning Paths:** Recommended courses and resources
   - **Resume Edits:** AI suggestions to improve your CV

---

## 🔑 API Endpoints

### Health Check
```http
GET /health
```

### Quantitative Analysis (Stage 2)
```http
POST /api/analyze/quantitative
Content-Type: multipart/form-data

- cv_file: PDF file
- job_title: string (optional)
- job_description: string
```

**Response:**
```json
{
  "overall_score": 75,
  "skills_breakdown": {
    "cv_skills_count": 12,
    "job_skills_count": 15,
    "matched_count": 10,
    "missing_count": 5
  },
  "matched_skills": [...],
  "missing_skills_prioritized": [...]
}
```

### Full AI Analysis (Stage 3)
```http
POST /api/analyze
Content-Type: multipart/form-data

- cv_file: PDF file
- job_title: string (optional)
- job_description: string
```

**Response:**
```json
{
  "quantitative_summary": {...},
  "ai_scores": {
    "coverage": 85,
    "depth": 70,
    "recency": 60
  },
  "ai_summary": "...",
  "cv_skill_profile": [...],
  "job_skill_profile": [...],
  "priority_actions": [...],
  "learning_paths": [...],
  "resume_edits": [...],
  "low_value_skills": [...]
}
```

---

## 🧪 Technical Implementation Details

### AI Skill Extraction Pipeline

1. **PDF Parsing** - `pdfplumber` extracts text from CV
2. **GLiNER NER** - Zero-shot Named Entity Recognition identifies skills
3. **Regex Fallback** - Pattern matching for common tech/finance skills
4. **ESCO Normalization** - Standardizes skills to European taxonomy
5. **Bad-term Filtering** - Removes generic/non-specific terms

### Market Demand Calculation

```python
# Pre-computed on startup (40-50 seconds)
skill_demand = {
    "python": 45234,      # Total job postings requiring skill
    "sql": 38921,
    "machine learning": 23456,
    ...
}
```

### AI Analysis Architecture

**Google Gemini AI** processes in two stages:

1. **Analyzer Prompt** - Infers proficiency levels (1-5 scale) for each skill
2. **Coach Prompt** - Generates personalized career roadmap

**Example AI Output:**
```json
{
  "cv_profile": {
    "proficiency": {
      "Python": "4 - Advanced",
      "SQL": "3 - Intermediate",
      "Excel": "5 - Expert"
    }
  },
  "priority_actions": [
    {
      "action": "Take online course on Power BI",
      "difficulty": "Easy",
      "time_estimate": "2-3 weeks",
      "why": "High market demand (32K jobs), easy to learn with Excel background"
    }
  ]
}
```

---

## 🎨 UI Features

### Custom CSS Components

```css
.btn-primary          /* Gradient buttons with hover effects */
.input-field          /* Styled form inputs with focus states */
.glass-effect         /* Glassmorphism backdrop blur */
.text-gradient        /* Gradient text for headings */
```

### Dark Mode

Theme managed via React Context with localStorage persistence:
```tsx
<ThemeProvider defaultTheme="dark" storageKey="ui-theme">
  <App />
</ThemeProvider>
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `GOOGLE_API_KEY is not set`**
```bash
# Make sure .env file exists in backend/ directory
echo GOOGLE_API_KEY=your_key_here > backend/.env
```

**Error: `Module not found`**
```bash
# Ensure virtual environment is activated
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

**Error: `FileNotFoundError: data\skills_en.csv`**
```bash
# Run python main.py from backend/ directory
cd backend
python main.py
```

### Frontend Issues

**Error: `react-scripts not found`**
```bash
cd frontend
npm install
```

**CORS Error: `Access-Control-Allow-Origin`**
- Ensure backend `main.py` has CORS middleware configured
- Check frontend `.env` has `REACT_APP_API_BASE_URL=http://127.0.0.1:8000`

---

## 📊 Performance Metrics

- **Backend Startup:** 40-50 seconds (first run with data pre-computation)
- **Subsequent Startups:** 6-10 seconds (cached GLiNER model)
- **API Response Time:** 
  - Quantitative Analysis: 2-5 seconds
  - Full AI Analysis: 10-30 seconds (depends on Gemini API)
- **Frontend Build:** 5-10 seconds (development mode)

---

## 🔒 Security & Privacy

- ✅ CV data is processed in-memory (not stored)
- ✅ Environment variables for API keys
- ✅ CORS protection configured
- ✅ No data persistence beyond session

---

## 🛣️ Roadmap

- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Multi-language support (currently English only)
- [ ] User authentication & saved analyses
- [ ] PDF export of analysis reports
- [ ] Integration with LinkedIn API
- [ ] Skill trend forecasting

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Oussema Harrabi**  
GitHub: [@OussemaHarrabi](https://github.com/OussemaHarrabi)

---

## 🙏 Acknowledgments

- **ESCO** - European Skills, Competences, Qualifications and Occupations
- **GLiNER** - Generalist and Lightweight Model for Named Entity Recognition
- **Google Gemini** - AI language model for career coaching
- **Kaggle** - USA Job Posting Dataset

---

## 📞 Support

For issues, questions, or contributions:
- Open an [Issue](https://github.com/OussemaHarrabi/skills-gap-analysis/issues)
- Submit a [Pull Request](https://github.com/OussemaHarrabi/skills-gap-analysis/pulls)

---

**⭐ If you find this project helpful, please give it a star!**
