# AI Interview Coach - Setup Guide

A full-stack AI-powered interview coaching application with voice interaction.

## 🎯 Features

- **Voice-Based Interviews**: Real-time voice conversation with AI coach
- **CV Analysis**: Personalized questions based on your CV
- **Live Feedback**: Instant constructive feedback after each answer
- **Performance Reports**: Detailed analysis at the end of the interview
- **Modern UI**: Beautiful, responsive interface

## 📋 Prerequisites

- **Python 3.9+**
- **Node.js 16+**
- **LiveKit Account** (free tier available)
- **Google Cloud Account** (for AI model access)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors livekit python-dotenv PyPDF2 python-docx livekit-agents

# Create .env file
cp .env.example .env

# Edit .env and add your credentials:
# LIVEKIT_API_KEY=your_api_key
# LIVEKIT_API_SECRET=your_api_secret
# LIVEKIT_URL=wss://your-project.livekit.cloud
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# The default backend URL is http://localhost:3001
```

### 3. Get LiveKit Credentials

1. Go to [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a free account
3. Create a new project
4. Copy your API Key, API Secret, and WebSocket URL
5. Add them to your backend `.env` file

### 4. Running the Application

**Terminal 1 - Backend Server:**

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python server.py
```

You should see:

```
🚀 AI Interview Coach Backend Server
==================================================
Server starting on http://localhost:3001
✅ LiveKit credentials loaded successfully
==================================================
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 5. Using the Application

1. Open your browser to `http://localhost:5173/`
2. Click "Get Started"
3. Upload your CV (PDF, DOC, or DOCX)
4. Click "Continue to Interview"
5. The agent will automatically connect and start the interview
6. Speak naturally and receive real-time feedback!

## 📁 Project Structure

```
ai-interview-coach/
├── backend/
│   ├── server.py           # Flask server (handles tokens & starts agent)
│   ├── agent.py            # LiveKit AI agent
│   ├── prompts.py          # Interview prompts & instructions
│   ├── cv_parser.py        # CV text extraction
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── components/
│   │   │   ├── WelcomeView.jsx     # Landing page
│   │   │   ├── UploadView.jsx      # CV upload page
│   │   │   ├── SessionView.jsx     # Interview session
│   │   │   └── ui/
│   │   │       └── Button.jsx      # Reusable button
│   │   └── App.css        # Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md              # This file
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# LiveKit Credentials
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
LIVEKIT_URL=wss://your-project.livekit.cloud

# Optional
FLASK_DEBUG=False
```

### Frontend Environment Variables

Create `frontend/.env` (optional):

```env
VITE_TOKEN_SERVER_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### "Connection Error" in Browser

**Problem**: Can't connect to backend
**Solutions**:

- Ensure backend server is running on port 3001
- Check that LIVEKIT credentials are set in `.env`
- Verify no firewall blocking localhost:3001

### Agent Not Connecting

**Problem**: Agent doesn't respond after starting call
**Solutions**:

- Check that agent dependencies are installed
- Verify LiveKit credentials are correct
- Check backend console for agent startup logs
- Ensure Google Cloud credentials are configured (if using Google AI)

### Audio Not Working

**Problem**: Can't hear the agent or agent can't hear you
**Solutions**:

- Grant microphone permissions in browser
- Check browser console for audio errors
- Ensure VAD (Voice Activity Detection) is working
- Try refreshing the page

### CV Upload Issues

**Problem**: CV upload fails or doesn't parse correctly
**Solutions**:

- Ensure file is PDF, DOC, or DOCX format
- Check file size (should be under 10MB)
- Verify PyPDF2 or python-docx are installed
- Check backend logs for parsing errors

## 🎨 Customization

### Changing Interview Questions

Edit `backend/prompts.py`:

- Modify `agent_instruction` for agent behavior
- Adjust `session_instruction` for interview flow
- Change number of questions in the prompts

### Updating UI Theme

Edit `frontend/src/App.css`:

- Change gradient colors
- Modify button styles
- Update font families

### Adding New Features

1. **Add CV field parsing**: Update `cv_parser.py`
2. **Add more AI providers**: Check LiveKit plugins documentation
3. **Save interview history**: Add database integration to backend

## 📚 Dependencies

### Backend

- `flask` - Web server
- `flask-cors` - CORS handling
- `livekit` - LiveKit SDK
- `livekit-agents` - AI agent framework
- `PyPDF2` - PDF parsing
- `python-docx` - DOCX parsing
- `python-dotenv` - Environment variables

### Frontend

- `react` - UI framework
- `@livekit/components-react` - LiveKit React components
- `livekit-client` - LiveKit client SDK
- `lucide-react` - Icons
- `vite` - Build tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🆘 Support

For issues or questions:

- Check the [LiveKit Documentation](https://docs.livekit.io/)
- Review browser console and backend logs
- Ensure all dependencies are installed correctly

## 🎉 What's Next?

Future enhancements:

- [ ] Save interview transcripts
- [ ] Multiple AI voice options
- [ ] Job description input
- [ ] Interview recording playback
- [ ] Performance analytics dashboard
- [ ] Multiple language support

---

**Made with ❤️ using LiveKit and React**
