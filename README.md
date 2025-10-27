# 🎯 AI Interview Coach

> **Personalized Interview Preparation with Advanced AI Technology**

An intelligent interview coaching platform that combines CV parsing, real-time AI voice interaction, and personalized feedback to help job seekers excel in their interviews.

## 🌟 Features

### 📄 CV Analysis
- Multi-format support (PDF, DOCX, PNG, JPG, JPEG)
- Advanced OCR technology for scanned documents
- Intelligent content extraction and analysis

### 🎤 Real-Time Voice Interviews
- LiveKit-powered voice communication
- Natural conversation with AI interviewer
- Real-time feedback and coaching
- Audio visualization

### 🤖 AI-Powered Coaching
- Personalized questions based on your CV
- Adaptive interview scenarios
- Detailed performance feedback
- Multiple interview practice modes

### 📊 Performance Tracking
- Interview analytics and progress monitoring
- Score trends and improvement metrics
- Session history and insights

## 🏗️ Project Structure

```
cs-challange/
├── backend/               # Python backend services
│   ├── server.py         # Flask API server (token generation)
│   ├── agent.py          # LiveKit voice agent
│   ├── app.py            # Streamlit web app
│   ├── cv_parser.py      # CV text extraction
│   ├── prompts.py        # AI prompt generation
│   └── requirements.txt  # Python dependencies
│
└── frontend/             # React frontend application
    ├── src/
    │   ├── App.jsx       # Main application component
    │   ├── components/   # React components
    │   └── assets/       # Static assets
    └── package.json      # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+**
- **Node.js 18+**
- **LiveKit Account** ([Sign up here](https://cloud.livekit.io/))
- **Google AI API Key** ([Get it here](https://ai.google.dev/))

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
- **React App**: http://localhost:5173 (Voice Interview UI)
- **Streamlit App**: Run `streamlit run backend/app.py` for alternative UI

## 🎯 Usage

### Voice Interview Mode (React Frontend)

1. **Start Backend**: Make sure `python server.py` is running
2. **Start Frontend**: Make sure `npm run dev` is running  
3. **Open Browser**: Navigate to http://localhost:5173
4. **Grant Permissions**: Allow microphone access when prompted
5. **Start Interview**: The AI interviewer will guide you through the session

### Streamlit Web App Mode

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

## 📦 Available Scripts

### Backend

```bash
# Start Flask API server
python server.py

# Start Streamlit web app
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
- **Flask** - REST API server
- **LiveKit** - Real-time voice communication
- **Google AI** - Natural language processing
- **Streamlit** - Alternative web interface
- **PyMuPDF** - PDF text extraction
- **EasyOCR** - Optical character recognition

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **LiveKit Components** - Pre-built voice UI components
- **Modern CSS** - Responsive design

## 🔐 Security & Privacy

- Local CV processing (no permanent storage)
- Encrypted API communications
- Temporary file cleanup
- Session-based data handling
- Environment variable protection

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
