# 🎯 AI Interview Coach

> **Personalized Interview Preparation with Advanced AI Technology**

An intelligent interview coaching platform that combines CV parsing, real-time AI interaction, and personalized feedback to help job seekers excel in their interviews.

## 🚀 Features

### 📄 Advanced CV Parsing
- **Multi-format Support**: PDF, DOCX, PNG, JPG, JPEG
- **OCR Technology**: Extract text from scanned documents using EasyOCR
- **Content Analysis**: Word count, reading time, and structure analysis
- **Real-time Processing**: Instant text extraction and validation

### 🤖 AI-Powered Interview Coaching
- **Personalized Questions**: Generated based on your CV and target job description
- **Real-time Voice Interviews**: Using LiveKit and Google AI for natural conversations
- **Text-based Practice**: Interactive chat interface for practice sessions
- **Adaptive Feedback**: Constructive criticism tailored to your responses

### 📊 Performance Analytics
- **Progress Tracking**: Monitor improvement over multiple sessions
- **Score Analysis**: Detailed breakdown of interview performance
- **Trend Visualization**: Interactive charts showing your development
- **Session History**: Review past interviews and feedback

### 🛠️ Interview Preparation Tools
- **STAR Method Framework**: Structured approach for behavioral questions
- **Question Banks**: Curated questions by category (Technical, Behavioral, etc.)
- **Answer Templates**: Pre-built frameworks for different question types
- **Random Question Generator**: Practice with surprise questions

## 🏗️ Technology Stack

### Backend
- **Python 3.13+**: Core application logic
- **LiveKit**: Real-time voice communication platform
- **Google AI APIs**: Advanced natural language processing
- **PyMuPDF**: PDF text extraction and processing
- **EasyOCR**: Optical Character Recognition for images
- **python-docx**: Microsoft Word document processing

### Frontend
- **Streamlit**: Interactive web application framework
- **Plotly**: Dynamic data visualization and charts
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing support

### AI & Machine Learning
- **Google Gemini**: Large language model for interview coaching
- **LiveKit Agents**: Voice-based AI interaction
- **OCR Processing**: Intelligent text extraction from images

## 📦 Installation

### Prerequisites
- Python 3.13 or higher
- Microphone and speakers (for voice interviews)
- Stable internet connection

### 1. Clone the Repository
```bash
git clone https://github.com/Tarekazabou/cs-challange.git
cd cs-challange
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env` file in the project root:
```bash
# LiveKit Configuration
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Google AI Configuration
GOOGLE_API_KEY=your_google_api_key
```

### 4. Initialize OCR Models
The first run will download EasyOCR models (~100MB):
```bash
python -c "import easyocr; reader = easyocr.Reader(['en'])"
```

## 🚀 Quick Start

### Web Application (Streamlit)
```bash
streamlit run app.py
```
Access the web interface at `http://localhost:8501`

### Voice Interview Agent
```bash
python agent.py
```
Follow the prompts to join a real-time voice interview session.

## 📖 Usage Guide

### 1. CV Upload & Analysis
1. Navigate to the **📄 CV Parser** section
2. Upload your resume (PDF, DOCX, or image format)
3. Review the extracted content and analysis
4. The system will store your CV for use in other sections

### 2. Interview Preparation
1. Go to the **🤖 Interview Coach** section
2. Enter the job description for your target role
3. Click "Generate Interview Questions" to create personalized prompts
4. Choose between text-based or voice-based interview practice

### 3. Performance Tracking
1. Visit the **📊 Analytics** section to view your progress
2. Analyze score trends, session duration, and improvement metrics
3. Review detailed feedback from previous sessions

### 4. Practice Tools
1. Use the **🛠️ Tools** section for additional preparation
2. Generate STAR method answers for behavioral questions
3. Practice with random questions from curated question banks
4. Structure technical problem responses

## 🔧 Configuration

### LiveKit Setup
1. Create a LiveKit account at [livekit.io](https://livekit.io)
2. Generate API credentials
3. Update your `.env` file with the credentials

### Google AI Setup
1. Obtain a Google AI API key
2. Enable the necessary AI services
3. Add the API key to your `.env` file

### OCR Optimization
For better OCR performance:
- Ensure clear, high-resolution images
- Use good lighting for scanned documents
- Consider preprocessing images for better contrast

## 📁 Project Structure

```
cs-challange/
├── 📄 Core Application Files
│   ├── app.py              # Main Streamlit web application
│   ├── agent.py            # LiveKit voice interview agent
│   ├── cv_parser.py        # CV text extraction module
│   └── prompts.py          # AI prompt generation
├── 📋 Configuration
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables (create this)
│   └── .gitignore         # Git ignore rules
├── 📄 Sample CVs
│   ├── cv_intershipb&w.pdf
│   └── cv_khawla.pdf
└── 📖 Documentation
    └── README.md          # This file
```

## 🎯 Core Features Breakdown

### CV Parser (`cv_parser.py`)
- Supports multiple file formats (PDF, DOCX, images)
- Intelligent fallback to OCR for scanned documents
- Error handling and validation
- Efficient text extraction algorithms

### Interview Agent (`agent.py`)
- Real-time voice interaction using LiveKit
- Personalized question generation based on CV analysis
- Automatic feedback generation after interviews
- Session management and completion tracking

### Prompt Engineering (`prompts.py`)
- Dynamic prompt generation based on CV content and job descriptions
- STAR method framework integration
- Behavioral and technical question templates
- Feedback scoring and improvement suggestions

### Web Interface (`app.py`)
- Multi-page application with intuitive navigation
- File upload and processing interface
- Interactive charts and analytics
- Real-time interview simulation
- Comprehensive tool suite for interview preparation

## 🔐 Security & Privacy

- **Local Processing**: CV content is processed locally and not stored permanently
- **Secure APIs**: All API communications use encrypted connections
- **Temporary Files**: Uploaded files are automatically cleaned up after processing
- **No Data Persistence**: Interview content is only stored in session state

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Performance Metrics

The system tracks various metrics to help improve your interview skills:

- **Overall Performance Score**: 1-10 scale based on response quality
- **Response Time**: How quickly you answer questions
- **Clarity Score**: Speech clarity and articulation (voice mode)
- **Content Relevance**: How well answers match the question
- **Technical Accuracy**: Correctness of technical responses
- **Communication Skills**: Overall presentation and professionalism

## 🛟 Troubleshooting

### Common Issues

**OCR Not Working**
- Ensure EasyOCR models are downloaded
- Check image quality and resolution
- Verify file format is supported

**Voice Interview Connection Issues**
- Verify LiveKit credentials in `.env`
- Check internet connection stability
- Ensure microphone permissions are granted

**Streamlit App Not Loading**
- Confirm all dependencies are installed
- Check for port conflicts (default: 8501)
- Review error logs for missing modules

**CV Parsing Errors**
- Verify file is not corrupted
- Try converting to a different format
- Check file size limits

### Getting Help

- 📧 **Email Support**: support@aiinterviewcoach.com
- 💬 **Community Discord**: AI Interview Coach Community
- 📖 **Documentation**: Detailed guides and tutorials
- 🐛 **Issue Tracking**: GitHub Issues for bug reports

## 📈 Roadmap

### Upcoming Features
- [ ] Multi-language support for international users
- [ ] Industry-specific question banks
- [ ] Video interview practice with facial expression analysis
- [ ] Team interview simulations
- [ ] Integration with job boards and ATS systems
- [ ] Mobile application for on-the-go practice
- [ ] Advanced analytics with machine learning insights

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced OCR and analytics
- **v1.2.0**: Voice interview improvements
- **v1.3.0**: Web interface redesign

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LiveKit Team**: For the excellent real-time communication platform
- **Google AI**: For providing advanced language model capabilities
- **EasyOCR Contributors**: For the robust OCR solution
- **Streamlit Community**: For the amazing web framework
- **Open Source Community**: For the various libraries and tools used

---

<div align="center">

**🎯 Ready to ace your next interview?**

[Get Started](http://localhost:8501) • [View Demo](#) • [Report Bug](#) • [Request Feature](#)

*Built with ❤️ by the AI Interview Coach Team*

</div>