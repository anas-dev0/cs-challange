# 🎯 AI Interview Coach - UtopiaHire Platform

> **Personalized Interview Preparation with Advanced AI Technology**

An intelligent interview coaching platform that combines CV parsing, real-time AI voice interaction, OAuth authentication, and personalized feedback to help job seekers excel in their interviews. Built with a professional platform frontend and LiveKit-powered interview sessions.

## 🌟 Features

### 🔐 Authentication & User Management
- OAuth 2.0 authentication (Google & GitHub)
- Traditional email/password sign-in
- JWT-based secure sessions
- Protected routes and user dashboard

### 📄 CV Analysis & Upload
- Multi-format support (PDF, DOCX)
- Intelligent CV upload and processing
- Job description matching
- Candidate information management

### 🎤 Real-Time Voice Interviews
- LiveKit-powered voice communication
- Natural conversation with AI interviewer
- Real-time feedback and coaching
- Audio visualization with agent state indicators
- Draggable/resizable video preview

### 🤖 AI-Powered Coaching
- Personalized questions based on your CV
- Adaptive interview scenarios
- Detailed performance feedback
- Multiple interview practice modes

### 📊 Performance Tracking
- Interview analytics and progress monitoring
- Score trends and improvement metrics
- Session history and insights

### 🎨 Modern UI/UX
- Dark-themed responsive design
- Interactive 3D shader backgrounds
- Smooth animations with Framer Motion
- Professional navigation and layout
- Multi-language support (EN, FR, AR)

## 🏗️ Project Structure

```
cs-challange/
├── backend/                      # Python backend services
│   ├── server.py                # Flask API server (token generation & CV upload)
│   ├── agent.py                 # LiveKit voice agent
│   ├── app.py                   # Streamlit web app (alternative UI)
│   ├── cv_parser.py             # CV text extraction
│   ├── prompts.py               # AI prompt generation
│   └── requirements.txt         # Python dependencies
│
└── frontend/                    # React/TypeScript frontend (UtopiaHire platform)
    ├── src/
    │   ├── App.tsx              # Main application with routing
    │   ├── AuthContext.tsx      # Authentication context
    │   ├── ServiceContext.tsx   # Interview service context
    │   ├── components/
    │   │   ├── SessionView.tsx  # LiveKit interview session (from cs-challange)
    │   │   ├── UploadView.tsx   # CV upload interface (from cs-challange)
    │   │   ├── Nav.tsx          # Navigation bar
    │   │   ├── AuthModal.tsx    # OAuth/Login modal
    │   │   ├── BackgroundShader.tsx  # 3D animated background
    │   │   └── ui/              # shadcn UI components
    │   ├── pages/
    │   │   ├── Home.tsx         # Landing page
    │   │   ├── About.tsx        # About page
    │   │   ├── Pricing.tsx      # Pricing page
    │   │   ├── InterviewerSetup.tsx  # Interview setup (uses UploadView)
    │   │   ├── Interview.tsx    # Interview session (uses SessionView)
    │   │   ├── Dashboard.tsx    # User dashboard
    │   │   ├── CVTool.tsx       # CV optimization tool
    │   │   └── JobMatcher.tsx   # Job matching tool
    │   ├── lib/
    │   │   ├── i18n.ts          # Internationalization setup
    │   │   └── utils.ts         # Utility functions
    │   └── locales/             # Translation files (EN, FR, AR)
    └── package.json             # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+**
- **Node.js 18+**
- **LiveKit Account** ([Sign up here](https://cloud.livekit.io/))
- **Google AI API Key** ([Get it here](https://ai.google.dev/))
- **Optional**: Google OAuth & GitHub OAuth credentials for authentication

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your credentials
# LIVEKIT_URL=wss://your-project.livekit.cloud
# LIVEKIT_API_KEY=your_api_key
# LIVEKIT_API_SECRET=your_api_secret
# GOOGLE_API_KEY=your_google_api_key

# Start the Flask API server
python server.py
```

The backend server will start on `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Copy environment template (optional)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to:
- **Main Platform**: http://localhost:5173
  - Landing page with authentication
  - Professional platform navigation
  - OAuth sign-in options
  - Protected interview features
- **Alternative UI**: Run `streamlit run backend/app.py` for Streamlit-based UI

## 🎯 Usage

### Platform Navigation

1. **Home Page**: Browse features, pricing, and information
2. **Sign Up/Login**: Use OAuth (Google/GitHub) or email/password
3. **Dashboard**: Access your interview history and progress

### Interview Workflow

1. **Start Backend**: Ensure `python server.py` is running on port 3001
2. **Login**: Sign in to the platform using your preferred method
3. **Setup Interview**:
   - Navigate to "Interview Setup" from the dashboard or navigation
   - Upload your CV (PDF or DOCX)
   - Enter job description and details
   - Provide your email for the interview report
4. **Begin Session**:
   - Grant microphone access when prompted
   - Video camera is optional (can be toggled)
   - The LiveKit session will connect automatically
   - AI interviewer will conduct the interview
5. **During Interview**:
   - Speak naturally to answer questions
   - Toggle camera and mic as needed
   - Drag and resize video preview window
   - End call when complete
6. **Post-Interview**: Receive feedback and analysis via email

### Alternative Streamlit Mode

1. **Upload CV**: Go to the CV Parser section and upload your resume
2. **Job Description**: Enter your target job description
3. **Generate Questions**: Get personalized interview questions
4. **Practice**: Use text-based or voice-based interview modes
5. **Analytics**: Track your progress in the Analytics section

## 🔧 Configuration

### LiveKit Setup

1. Create an account at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Copy your API credentials:
   - API Key
   - API Secret
   - WebSocket URL
4. Add them to `backend/.env`

### Google AI Setup

1. Get an API key from [Google AI](https://ai.google.dev/)
2. Add it to `backend/.env` as `GOOGLE_API_KEY`

### OAuth Setup (Optional)

For authentication features:

**Google OAuth**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:8000/api/auth/oauth/google/callback`
4. Add credentials to your auth backend `.env`

**GitHub OAuth**:
1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create new OAuth App
3. Set callback URL: `http://localhost:8000/api/auth/oauth/github/callback`
4. Add credentials to your auth backend `.env`

## 📦 Available Scripts

### Backend

```bash
# Start Flask API server (LiveKit token generation & CV upload)
python server.py

# Start Streamlit web app (alternative UI)
streamlit run app.py

# Run voice interview agent
python agent.py
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🛠️ Technology Stack

### Backend
- **Python 3.13+**
- **Flask** - REST API server for LiveKit tokens and CV upload
- **LiveKit** - Real-time voice communication infrastructure
- **Google AI (Gemini)** - Natural language processing and interview AI
- **Streamlit** - Alternative web interface
- **PyMuPDF** - PDF text extraction
- **EasyOCR** - Optical character recognition

### Frontend
- **React 18** with **TypeScript** - Type-safe UI framework
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing
- **LiveKit Components React** - Pre-built real-time voice/video components
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Smooth animations
- **@shadergradient/react** - Interactive 3D shader backgrounds
- **Axios** - HTTP client with token refresh
- **i18next** - Internationalization (EN, FR, AR)
- **Sonner** - Toast notifications
- **shadcn/ui** - Re-usable UI components

### Authentication (UtopiaHire Platform)
- **FastAPI** - High-performance async Python backend (optional)
- **PostgreSQL** - User database (optional)
- **JWT** - Token-based authentication
- **OAuth 2.0** - Google and GitHub social login

## 🔐 Security & Privacy

- Local CV processing (no permanent storage)
- Encrypted API communications
- Temporary file cleanup
- Session-based data handling
- Environment variable protection
- JWT-based secure authentication
- OAuth 2.0 integration for trusted providers

## 🐛 Troubleshooting

### Backend Issues

**"LiveKit credentials not configured"**
- Ensure `.env` file exists in the `backend/` directory
- Verify `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set correctly

**"Port 3001 already in use"**
- Stop any other services using port 3001
- Or modify the port in `server.py`

### Frontend Issues

**"Failed to connect to server"**
- Make sure the backend server is running (`python server.py`)
- Check that the backend is accessible at http://localhost:3001
- Verify CORS is properly configured

**"Microphone access denied"**
- Grant microphone permissions in your browser
- Refresh the page after granting permissions

## 📈 Future Enhancements

- [ ] Multi-language support
- [ ] Video interview practice
- [ ] Industry-specific question banks
- [ ] Team interview simulations
- [ ] Mobile application
- [ ] Advanced analytics with ML insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **LiveKit Team** - Real-time communication platform
- **Google AI** - Advanced language models
- **React & Vite** - Modern frontend tooling
- **Open Source Community** - Various libraries and tools

---

<div align="center">

**Built with ❤️ for better interview preparation**

[Report Bug](https://github.com/anas-dev0/cs-challange/issues) • [Request Feature](https://github.com/anas-dev0/cs-challange/issues)

</div>
