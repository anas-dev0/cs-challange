# 🚀 Setup Guide - AI Interview Coach

This guide will help you set up and run the AI Interview Coach application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **pip** (comes with Python)
- **npm** (comes with Node.js)

## 🔑 Get API Credentials

### 1. LiveKit Account

1. Sign up for a free account at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Navigate to your project settings
4. Copy the following credentials:
   - **API Key**
   - **API Secret**  
   - **WebSocket URL** (e.g., `wss://your-project.livekit.cloud`)

### 2. Google AI API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one
5. Copy the API key

## 🛠️ Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/anas-dev0/cs-challange.git
cd cs-challange
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Copy the environment template
cp .env.example .env

# Edit .env file and add your credentials
# Use your favorite text editor (nano, vim, vscode, etc.)
nano .env
```

Add your credentials to the `.env` file:

```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_actual_api_key_here
LIVEKIT_API_SECRET=your_actual_api_secret_here
GOOGLE_API_KEY=your_google_api_key_here
FLASK_DEBUG=False
```

**Important**: Never commit the `.env` file to version control!

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install Node.js dependencies
npm install

# (Optional) Copy environment template
cp .env.example .env
```

The frontend `.env` file is optional. Default values work for local development.

## 🚀 Running the Application

### Option 1: Voice Interview Mode (React + Flask)

This is the recommended mode for real-time voice interviews.

#### Terminal 1 - Start Backend Server

```bash
cd backend
python server.py
```

You should see:
```
==================================================
🚀 AI Interview Coach Backend Server
==================================================
Server starting on http://localhost:3001
Health check: http://localhost:3001/health
Token endpoint: http://localhost:3001/get-token
==================================================
✅ LiveKit credentials loaded successfully
```

#### Terminal 2 - Start Frontend Server

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.1.12  ready in 225 ms

➜  Local:   http://localhost:5173/
```

#### Access the Application

Open your browser and navigate to: **http://localhost:5173**

Grant microphone permissions when prompted, and you're ready to start your AI interview!

### Option 2: Streamlit Web App

Alternative interface using Streamlit:

```bash
cd backend
streamlit run app.py
```

Access at: **http://localhost:8501**

### Option 3: Voice Agent (Terminal-based)

For terminal-based voice interviews:

```bash
cd backend
python agent.py
```

Follow the on-screen prompts to join a voice session.

## 🧪 Testing the Setup

### 1. Test Backend Health

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "service": "AI Interview Coach Backend",
  "status": "ok"
}
```

### 2. Test Token Generation

```bash
curl http://localhost:3001/get-token
```

You should receive a JSON response with a token (if credentials are configured) or an error message.

### 3. Test Frontend Build

```bash
cd frontend
npm run build
```

Should complete without errors.

## 📁 Project Structure

```
cs-challange/
├── backend/
│   ├── server.py          # Flask API server (start this first)
│   ├── app.py             # Streamlit web app (alternative UI)
│   ├── agent.py           # Voice interview agent
│   ├── cv_parser.py       # CV text extraction
│   ├── prompts.py         # AI prompt generation
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Your credentials (create from .env.example)
│
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main React component
    │   ├── components/    # React components
    │   └── assets/        # Static files
    ├── package.json       # Node.js dependencies
    └── .env               # Optional frontend config
```

## 🔧 Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution**: Make sure you're in the backend directory and run:
```bash
pip install -r requirements.txt
```

### Issue: "Error: Cannot find module '@livekit/components-react'"

**Solution**: Install frontend dependencies:
```bash
cd frontend
npm install
```

### Issue: "LiveKit credentials not configured"

**Solution**: 
1. Make sure you have a `.env` file in the `backend/` directory
2. Verify that `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set correctly
3. Restart the backend server after updating `.env`

### Issue: "Port 3001 already in use"

**Solution**: 
- Find and stop the process using port 3001, or
- Modify the port in `backend/server.py` (line 94)

### Issue: "Microphone access denied"

**Solution**:
1. Check browser settings and grant microphone permissions
2. Refresh the page after granting permissions
3. Use HTTPS or localhost (required by browsers for microphone access)

### Issue: Frontend shows "Connecting..." forever

**Solution**:
1. Ensure backend server is running on port 3001
2. Check browser console for errors
3. Verify CORS is not blocking requests
4. Test backend health endpoint: `curl http://localhost:3001/health`

## 🎯 Next Steps

Once everything is running:

1. **Upload Your CV**: Use the CV Parser to upload your resume
2. **Enter Job Description**: Provide details about your target role
3. **Start Practicing**: Begin your AI-powered mock interview
4. **Review Analytics**: Track your progress over time

## 📚 Additional Resources

- [LiveKit Documentation](https://docs.livekit.io/)
- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vite Documentation](https://vite.dev/)

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/anas-dev0/cs-challange/issues)
2. Review the main README.md for additional information
3. Open a new issue with details about your problem

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secret
- Use `FLASK_DEBUG=False` in production
- Regularly update dependencies for security patches

---

**Happy Interview Practicing! 🎯**
