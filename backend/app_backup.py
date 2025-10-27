import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime
import os
import tempfile
import asyncio
from io import BytesIO

# Import project modules
from cv_parser import extract_text_from_cv
from prompts import create_initial_prompts, FINAL_FEEDBACK_PROMPT
# Note: agent.py requires LiveKit which is for real-time voice interviews

# Set page configuration
st.set_page_config(
    page_title="AI Interview Coach",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Title and header
st.title("🎯 AI Interview Coach")
st.markdown("### Personalized Interview Preparation with AI")
st.markdown("---")

# Sidebar
st.sidebar.header("🎯 Navigation")
page = st.sidebar.selectbox(
    "Choose a page:",
    ["🏠 Home", "📄 CV Parser", "🤖 Interview Coach", "📊 Analytics", "🛠️ Tools", "ℹ️ About"]
)

if page == "🏠 Home":
    st.header("Welcome to the AI Interview Coach!")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🎯 About This Platform")
        st.write("""
        This AI-powered interview coach helps you prepare for job interviews by:
        - **CV Analysis**: Extracting and analyzing your resume content
        - **Personalized Questions**: Generating tailored interview questions
        - **Real-time Feedback**: Providing constructive feedback on your responses
        - **Performance Analytics**: Tracking your improvement over time
        """)
        
        st.subheader("🚀 Key Features")
        st.write("✅ Multi-format CV parsing (PDF, DOCX, Images)")
        st.write("✅ OCR technology for scanned documents")
        st.write("✅ AI-powered interview simulation")
        st.write("✅ Personalized feedback and coaching")
        st.write("✅ Performance tracking and analytics")
    
    with col2:
        st.subheader("📈 Quick Stats")
        
        # Create some sample metrics
        col_a, col_b, col_c = st.columns(3)
        
        with col_a:
            st.metric("CVs Processed", "1,234", "12%")
        
        with col_b:
            st.metric("Interviews Conducted", "856", "18%")
        
        with col_c:
            st.metric("Success Rate", "94.2%", "2.1%")
        
        st.subheader("🎯 How It Works")
        st.write("""
        1. **Upload Your CV**: Support for PDF, DOCX, and image formats
        2. **Job Description**: Provide the role you're targeting
        3. **AI Analysis**: Our system analyzes your background
        4. **Mock Interview**: Practice with personalized questions
        5. **Get Feedback**: Receive detailed performance insights
        """)

elif page == "📄 CV Parser":
    st.header("📄 CV Parser & Analyzer")
    st.markdown("Upload your CV to extract and analyze its content using advanced OCR technology.")
    
    # File upload section
    uploaded_cv = st.file_uploader(
        "Upload your CV",
        type=['pdf', 'docx', 'png', 'jpg', 'jpeg'],
        help="Supported formats: PDF, DOCX, PNG, JPG, JPEG"
    )
    
    if uploaded_cv is not None:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{uploaded_cv.name.split(".")[-1]}') as tmp_file:
            tmp_file.write(uploaded_cv.getvalue())
            tmp_file_path = tmp_file.name
        
        try:
            # Display file details
            st.subheader("📋 File Information")
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Filename", uploaded_cv.name)
            with col2:
                st.metric("File Size", f"{uploaded_cv.size} bytes")
            with col3:
                st.metric("File Type", uploaded_cv.type)
            
            # Extract text using the project's CV parser
            with st.spinner("🔍 Extracting text from your CV..."):
                extracted_text = extract_text_from_cv(tmp_file_path)
            
            if extracted_text:
                st.success("✅ Text extraction successful!")
                
                # Display extracted text
                st.subheader("📝 Extracted Content")
                st.text_area("CV Content", extracted_text, height=400)
                
                # Basic analysis
                st.subheader("📊 Content Analysis")
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Total Characters", len(extracted_text))
                with col2:
                    st.metric("Word Count", len(extracted_text.split()))
                with col3:
                    st.metric("Line Count", len(extracted_text.split('\n')))
                with col4:
                    # Estimate reading time (average 200 words per minute)
                    reading_time = max(1, len(extracted_text.split()) / 200)
                    st.metric("Reading Time", f"{reading_time:.1f} min")
                
                # Store in session state for use in other pages
                st.session_state.cv_text = extracted_text
                st.session_state.cv_filename = uploaded_cv.name
                
                # Download option
                st.download_button(
                    label="💾 Download Extracted Text",
                    data=extracted_text,
                    file_name=f"extracted_{uploaded_cv.name}.txt",
                    mime="text/plain"
                )
                
            else:
                st.error("❌ Failed to extract text from the CV. Please try a different file format or ensure the file is not corrupted.")
        
        except Exception as e:
            st.error(f"❌ Error processing CV: {str(e)}")
        
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    else:
        st.info("📁 Please upload a CV file to begin analysis.")
        
        # Show example of supported formats
        st.subheader("📄 Supported File Formats")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.write("**📄 PDF Files**")
            st.write("- Text-based PDFs")
            st.write("- Scanned PDFs (OCR)")
            st.write("- Multi-page documents")
        
        with col2:
            st.write("**📝 DOCX Files**")
            st.write("- Microsoft Word documents")
            st.write("- Formatted text")
            st.write("- Tables and lists")
        
        with col3:
            st.write("**🖼️ Image Files**")
            st.write("- PNG, JPG, JPEG")
            st.write("- Scanned documents")
            st.write("- Screenshots")

elif page == "🤖 Interview Coach":
    st.header("🤖 AI Interview Coach")
    st.markdown("Practice your interview skills with personalized questions based on your CV and target job.")
    
    # Check if CV is uploaded
    if 'cv_text' not in st.session_state:
        st.warning("⚠️ Please upload and process your CV in the 'CV Parser' section first.")
        st.markdown("👈 Navigate to the **📄 CV Parser** page to get started.")
        
        # Show demo with example CV
        st.subheader("🎭 Demo Mode")
        if st.button("Try Demo with Example CV"):
            st.session_state.cv_text = """
            John Doe
            Software Engineer
            
            Experience:
            - 3 years Python development
            - React and Node.js experience
            - Machine Learning projects
            - Database management (SQL, MongoDB)
            
            Skills:
            - Programming: Python, JavaScript, Java
            - Frameworks: React, Django, Flask
            - Tools: Git, Docker, AWS
            - Soft Skills: Team collaboration, Problem-solving
            """
            st.session_state.cv_filename = "demo_cv.txt"
            st.rerun()
    
    else:
        # Display current CV info
        st.success(f"✅ CV loaded: {st.session_state.get('cv_filename', 'Unknown')}")
        
        # Job description input
        st.subheader("💼 Target Job Description")
        job_description = st.text_area(
            "Enter the job description or role you're targeting:",
            placeholder="e.g., Full Stack Developer with experience in Python, React, and cloud technologies...",
            height=150
        )
        
        if job_description:
            # Generate interview prompts
            st.subheader("🎯 Personalized Interview Preparation")
            
            if st.button("🚀 Generate Interview Questions"):
                with st.spinner("🤖 AI is analyzing your CV and generating personalized questions..."):
                    try:
                        agent_instruction, session_instruction = create_initial_prompts(
                            cv_text=st.session_state.cv_text,
                            job_description_text=job_description
                        )
                        
                        # Store in session state
                        st.session_state.agent_instruction = agent_instruction
                        st.session_state.session_instruction = session_instruction
                        st.session_state.job_description = job_description
                        
                        st.success("✅ Interview questions generated successfully!")
                        
                        # Display the instructions
                        st.subheader("📋 Interview Instructions")
                        with st.expander("View AI Interviewer Instructions"):
                            st.text_area("Agent Instructions", agent_instruction, height=300)
                        
                        with st.expander("View Session Instructions"):
                            st.text_area("Session Instructions", session_instruction, height=300)
                            
                    except Exception as e:
                        st.error(f"❌ Error generating questions: {str(e)}")
            
            # If questions are generated, show interview simulation
            if 'agent_instruction' in st.session_state:
                st.subheader("🎤 Interview Simulation")
                st.info("💡 **Note**: For the full voice-based interview experience, use the LiveKit agent by running `python agent.py` in the terminal.")
                
                # Text-based interview simulation
                st.markdown("### 💬 Text-Based Practice")
                
                # Initialize chat history
                if 'chat_history' not in st.session_state:
                    st.session_state.chat_history = []
                    st.session_state.question_count = 0
                    st.session_state.interview_started = False
                
                # Start interview button
                if not st.session_state.interview_started:
                    if st.button("🎬 Start Text Interview"):
                        st.session_state.interview_started = True
                        st.session_state.chat_history.append({
                            "speaker": "AI Interviewer",
                            "message": "Hello! I'm Alex, your AI interview coach. I've reviewed your CV and the job description. Are you ready to begin the interview?"
                        })
                        st.rerun()
                
                # Display chat history
                if st.session_state.chat_history:
                    st.markdown("### 💭 Interview Conversation")
                    for i, chat in enumerate(st.session_state.chat_history):
                        if chat["speaker"] == "AI Interviewer":
                            st.markdown(f"**🤖 {chat['speaker']}:** {chat['message']}")
                        else:
                            st.markdown(f"**👤 {chat['speaker']}:** {chat['message']}")
                    
                    # User input for response
                    if st.session_state.interview_started and st.session_state.question_count < 7:
                        user_response = st.text_area("Your Response:", key=f"response_{len(st.session_state.chat_history)}")
                        
                        if st.button("Submit Response") and user_response:
                            # Add user response to chat
                            st.session_state.chat_history.append({
                                "speaker": "You",
                                "message": user_response
                            })
                            
                            # Generate next question or feedback
                            st.session_state.question_count += 1
                            
                            if st.session_state.question_count < 7:
                                # Generate next question (simplified for demo)
                                sample_questions = [
                                    "Tell me about your experience with the technologies mentioned in the job description.",
                                    "Can you describe a challenging project you've worked on and how you overcame the difficulties?",
                                    "How do you stay updated with the latest trends in your field?",
                                    "Describe a situation where you had to work in a team. What was your role?",
                                    "What interests you most about this particular role and company?",
                                    "How do you handle tight deadlines and pressure?",
                                    "Do you have any questions about the role or the company?"
                                ]
                                
                                if st.session_state.question_count <= len(sample_questions):
                                    next_question = sample_questions[st.session_state.question_count - 1]
                                    st.session_state.chat_history.append({
                                        "speaker": "AI Interviewer",
                                        "message": f"Thank you for that response. {next_question}"
                                    })
                            else:
                                # End interview with feedback
                                st.session_state.chat_history.append({
                                    "speaker": "AI Interviewer",
                                    "message": "Thank you for completing the interview! Based on your responses, here's my feedback: You showed good knowledge of the technical requirements and demonstrated clear communication skills. To improve, consider providing more specific examples from your experience and asking thoughtful questions about the role."
                                })
                            
                            st.rerun()
                    
                    elif st.session_state.question_count >= 7:
                        st.success("🎉 Interview completed! Check the conversation above for feedback.")
                        
                        if st.button("🔄 Start New Interview"):
                            st.session_state.chat_history = []
                            st.session_state.question_count = 0
                            st.session_state.interview_started = False
                            st.rerun()
        
        else:
            st.info("💼 Please enter a job description to generate personalized interview questions.")

elif page == "📊 Analytics":
    st.header("📊 Interview Performance Analytics")
    st.markdown("Track your interview performance and improvement over time.")
    
    # Simulated analytics data
    st.subheader("📈 Performance Overview")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Interviews Completed", "12", "3")
    with col2:
        st.metric("Average Score", "7.8/10", "0.5")
    with col3:
        st.metric("Improvement Rate", "23%", "5%")
    with col4:
        st.metric("Time Practiced", "4.2 hrs", "1.1 hrs")
    
    # Generate sample performance data
    dates = pd.date_range('2024-09-01', periods=12, freq='3D')
    performance_data = pd.DataFrame({
        'Date': dates,
        'Score': np.random.uniform(6.0, 9.5, 12).round(1),
        'Category': np.random.choice(['Technical', 'Behavioral', 'Mixed'], 12),
        'Duration': np.random.uniform(15, 45, 12).round(0)
    })
    
    tab1, tab2, tab3 = st.tabs(["📈 Performance Trend", "📊 Score Distribution", "⏱️ Session Analysis"])
    
    with tab1:
        st.subheader("Performance Improvement Over Time")
        fig_line = px.line(performance_data, x='Date', y='Score', color='Category',
                          title="Interview Scores by Category", 
                          markers=True)
        fig_line.update_layout(yaxis_range=[0, 10])
        st.plotly_chart(fig_line, use_container_width=True)
    
    with tab2:
        st.subheader("Score Distribution")
        fig_hist = px.histogram(performance_data, x='Score', nbins=10,
                               title="Distribution of Interview Scores")
        st.plotly_chart(fig_hist, use_container_width=True)
        
        # Show detailed breakdown
        st.subheader("Category Performance")
        category_stats = performance_data.groupby('Category')['Score'].agg(['mean', 'count', 'std']).round(2)
        category_stats.columns = ['Average Score', 'Count', 'Standard Deviation']
        st.dataframe(category_stats)
    
    with tab3:
        st.subheader("Session Duration Analysis")
        fig_scatter = px.scatter(performance_data, x='Duration', y='Score', color='Category',
                               title="Score vs Session Duration", size='Score')
        st.plotly_chart(fig_scatter, use_container_width=True)
        
        st.subheader("Recent Sessions")
        st.dataframe(performance_data.sort_values('Date', ascending=False).head())

elif page == "🛠️ Tools":
    st.header("🛠️ Interview Preparation Tools")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("💡 Answer Framework Generator")
        
        question_type = st.selectbox("Select question type:", 
                                   ["Behavioral (STAR Method)", "Technical Problem", "Career Goals", "Weakness/Strength"])
        
        if question_type == "Behavioral (STAR Method)":
            st.write("**STAR Method Framework:**")
            situation = st.text_area("Situation - Describe the context:")
            task = st.text_area("Task - Explain what you needed to accomplish:")
            action = st.text_area("Action - Detail the steps you took:")
            result = st.text_area("Result - Share the outcomes:")
            
            if st.button("Generate STAR Answer"):
                if all([situation, task, action, result]):
                    star_answer = f"""**Situation:** {situation}
                    
**Task:** {task}

**Action:** {action}

**Result:** {result}"""
                    st.success("✅ STAR Answer Generated!")
                    st.text_area("Your STAR Answer:", star_answer, height=200)
                else:
                    st.warning("Please fill in all STAR components.")
        
        elif question_type == "Technical Problem":
            st.write("**Technical Problem Structure:**")
            problem = st.text_area("Describe the technical problem:")
            approach = st.text_area("Your approach/solution:")
            implementation = st.text_area("Implementation details:")
            challenges = st.text_area("Challenges faced:")
            
            if st.button("Generate Technical Answer") and problem:
                st.success("✅ Technical Answer Framework Ready!")
                tech_answer = f"""**Problem:** {problem}
                
**Approach:** {approach}

**Implementation:** {implementation}

**Challenges & Solutions:** {challenges}"""
                st.text_area("Your Technical Answer:", tech_answer, height=200)
    
    with col2:
        st.subheader("🎯 Question Bank")
        
        category = st.selectbox("Question Category:", 
                               ["Technical Skills", "Behavioral", "Company-Specific", "Role-Specific"])
        
        question_banks = {
            "Technical Skills": [
                "Explain the difference between list and tuple in Python.",
                "What is the time complexity of different sorting algorithms?",
                "How would you optimize a slow database query?",
                "Explain RESTful API design principles.",
                "What are the key principles of object-oriented programming?"
            ],
            "Behavioral": [
                "Tell me about a time when you had to work under pressure.",
                "Describe a situation where you had to learn something new quickly.",
                "Give an example of when you had to resolve a conflict with a colleague.",
                "Tell me about a project you're particularly proud of.",
                "How do you handle constructive criticism?"
            ],
            "Company-Specific": [
                "Why do you want to work for our company?",
                "What do you know about our products/services?",
                "How do you align with our company values?",
                "What attracts you to our industry?",
                "Where do you see our company heading in the next 5 years?"
            ],
            "Role-Specific": [
                "What interests you about this specific role?",
                "How does this position fit into your career goals?",
                "What unique value would you bring to this role?",
                "What aspects of the job description excite you most?",
                "How would you approach your first 90 days in this role?"
            ]
        }
        
        st.write(f"**{category} Questions:**")
        for i, question in enumerate(question_banks[category], 1):
            st.write(f"{i}. {question}")
        
        st.subheader("🎲 Random Question Generator")
        if st.button("Generate Random Question"):
            import random
            all_questions = []
            for questions in question_banks.values():
                all_questions.extend(questions)
            random_question = random.choice(all_questions)
            st.info(f"**Random Question:** {random_question}")

elif page == "ℹ️ About":
    st.header("Welcome to the CS Challenge Web App!")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("About This App")
        st.write("""
        This is a temporary Streamlit web application created for the CS Challenge project.
        It includes several interactive features to demonstrate web app capabilities.
        """)
        
        st.subheader("Features")
        st.write("✅ Interactive data visualization")
        st.write("✅ File upload functionality")
        st.write("✅ Real-time updates")
        st.write("✅ Responsive design")
    
    with col2:
        st.subheader("Quick Stats")
        
        # Create some sample metrics
        col_a, col_b, col_c = st.columns(3)
        
        with col_a:
            st.metric("Users", "1,234", "12%")
        
        with col_b:
            st.metric("Projects", "56", "3%")
        
        with col_c:
            st.metric("Success Rate", "98.5%", "0.5%")

elif page == "Data Visualization":
    st.header("📊 Data Visualization")
    
    # Generate sample data
    np.random.seed(42)
    data = pd.DataFrame({
        'Date': pd.date_range('2024-01-01', periods=100),
        'Value': np.random.randn(100).cumsum(),
        'Category': np.random.choice(['A', 'B', 'C'], 100),
        'Performance': np.random.uniform(0, 100, 100)
    })
    
    tab1, tab2, tab3 = st.tabs(["Line Chart", "Bar Chart", "Scatter Plot"])
    
    with tab1:
        st.subheader("Time Series Data")
        fig_line = px.line(data, x='Date', y='Value', color='Category', 
                          title="Value Over Time by Category")
        st.plotly_chart(fig_line, use_container_width=True)
    
    with tab2:
        st.subheader("Category Comparison")
        category_data = data.groupby('Category')['Performance'].mean().reset_index()
        fig_bar = px.bar(category_data, x='Category', y='Performance',
                        title="Average Performance by Category")
        st.plotly_chart(fig_bar, use_container_width=True)
    
    with tab3:
        st.subheader("Correlation Analysis")
        fig_scatter = px.scatter(data, x='Value', y='Performance', color='Category',
                               title="Value vs Performance")
        st.plotly_chart(fig_scatter, use_container_width=True)

elif page == "File Upload":
    st.header("📁 File Upload & Processing")
    
    uploaded_file = st.file_uploader(
        "Choose a file",
        type=['txt', 'csv', 'pdf', 'docx', 'png', 'jpg', 'jpeg']
    )
    
    if uploaded_file is not None:
        file_details = {
            "Filename": uploaded_file.name,
            "File Type": uploaded_file.type,
            "File Size": f"{uploaded_file.size} bytes"
        }
        
        st.write("File Details:")
        st.json(file_details)
        
        # Handle different file types
        if uploaded_file.type == "text/plain":
            st.subheader("Text File Content:")
            content = str(uploaded_file.read(), "utf-8")
            st.text_area("Content", content, height=300)
        
        elif uploaded_file.type == "text/csv":
            st.subheader("CSV File Preview:")
            df = pd.read_csv(uploaded_file)
            st.dataframe(df.head())
            
            st.subheader("Basic Statistics:")
            st.write(df.describe())
        
        elif uploaded_file.type.startswith('image/'):
            st.subheader("Image Preview:")
            st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
        
        else:
            st.info("File uploaded successfully! Preview not available for this file type.")

elif page == "Interactive Tools":
    st.header("🛠️ Interactive Tools")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Calculator")
        
        operation = st.selectbox("Choose operation:", ["Add", "Subtract", "Multiply", "Divide"])
        num1 = st.number_input("First number:", value=0.0)
        num2 = st.number_input("Second number:", value=0.0)
        
        if st.button("Calculate"):
            if operation == "Add":
                result = num1 + num2
            elif operation == "Subtract":
                result = num1 - num2
            elif operation == "Multiply":
                result = num1 * num2
            elif operation == "Divide":
                if num2 != 0:
                    result = num1 / num2
                else:
                    result = "Error: Division by zero"
            
            st.success(f"Result: {result}")
    
    with col2:
        st.subheader("Text Analysis")
        
        text_input = st.text_area("Enter text to analyze:", height=100)
        
        if text_input:
            word_count = len(text_input.split())
            char_count = len(text_input)
            char_count_no_spaces = len(text_input.replace(" ", ""))
            
            st.write(f"**Word count:** {word_count}")
            st.write(f"**Character count:** {char_count}")
            st.write(f"**Character count (no spaces):** {char_count_no_spaces}")

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center'>
        <p>CS Challenge Web App • Built with Streamlit • {}</p>
    </div>
    """.format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
    unsafe_allow_html=True
)