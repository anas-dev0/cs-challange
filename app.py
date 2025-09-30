import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime
import os

# Set page configuration
st.set_page_config(
    page_title="CS Challenge Web App",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Title and header
st.title("🚀 CS Challenge Web App")
st.markdown("---")

# Sidebar
st.sidebar.header("Navigation")
page = st.sidebar.selectbox(
    "Choose a page:",
    ["Home", "Data Visualization", "File Upload", "Interactive Tools"]
)

if page == "Home":
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