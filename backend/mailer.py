import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from dotenv import load_dotenv
import re
import requests

load_dotenv()

# Email configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
SENDER_NAME = os.getenv("SENDER_NAME", "AI Interview Coach")


def parse_report(report_text: str) -> dict:
    """
    Parses the interview report text and extracts structured data
    Handles the specific format from the agent's prompts
    """
    # First, clean up the text - remove any preamble
    clean_text = report_text
    
    # Remove "Thank you for your time today" type phrases
    preamble_phrases = [
        "Thank you for your time today. That concludes the interview questions.",
        "That concludes the interview questions.",
        "Thank you for your time today."
    ]
    for phrase in preamble_phrases:
        clean_text = clean_text.replace(phrase, "")
    
    # Remove closing phrases
    closing_phrases = [
        "Best of luck with your interview preparation. This session is now complete.",
        "Best of luck with your interview preparation.",
        "This session is now complete.",
    ]
    for phrase in closing_phrases:
        if phrase in clean_text:
            clean_text = clean_text[:clean_text.find(phrase)]
    
    clean_text = clean_text.strip()
    
    data = {
        "overall_score": "",
        "score_justification": "",
        "strengths": [],
        "weaknesses": [],
        "communication": {},
        "recommendations": [],
        "role_fit": "",
        "final_note": ""
    }
    
    # Extract overall score
    score_match = re.search(r'\*\*Overall Score:\*\*\s*(\d+/10)\s*[-–]\s*(.+?)(?=\n|$)', clean_text)
    if score_match:
        data["overall_score"] = score_match.group(1)
        data["score_justification"] = score_match.group(2).strip()
    
    # Extract strengths
    strengths_section = re.search(r'\*\*Key Strengths:\*\*(.*?)\*\*Areas for Development:\*\*', clean_text, re.DOTALL)
    if strengths_section:
        strengths_text = strengths_section.group(1)
        strengths = re.findall(r'-\s*(.+?)(?=\n-|\n\*\*|\Z)', strengths_text, re.DOTALL)
        data["strengths"] = [s.strip() for s in strengths if s.strip()]
    
    # Extract weaknesses/areas for development
    weaknesses_section = re.search(r'\*\*Areas for Development:\*\*(.*?)\*\*Communication & Delivery Assessment:\*\*', clean_text, re.DOTALL)
    if weaknesses_section:
        weaknesses_text = weaknesses_section.group(1)
        weaknesses = re.findall(r'-\s*\*\*(.+?)\*\*:\s*(.+?)(?=\n-|\n\*\*|\Z)', weaknesses_text, re.DOTALL)
        for weakness in weaknesses:
            data["weaknesses"].append({
                "title": weakness[0].strip(),
                "description": weakness[1].strip()
            })
    
    # Extract communication assessment
    comm_fields = ["Confidence", "Clarity", "Pace & Fluency", "Enthusiasm", "Professionalism"]
    for field in comm_fields:
        match = re.search(f'-\s*{field}:\s*(.+?)(?=\n-|\n\*\*|\Z)', clean_text, re.DOTALL)
        if match:
            data["communication"][field.lower().replace(" & ", "_").replace(" ", "_")] = match.group(1).strip()
    
    # Extract recommendations
    recommendations_section = re.search(r'\*\*Recommendations for Improvement:\*\*(.*?)\*\*Role Fit Assessment:\*\*', clean_text, re.DOTALL)
    if recommendations_section:
        recs_text = recommendations_section.group(1)
        recs = re.findall(r'-\s*(.+?)(?=\n-|\n\*\*|\Z)', recs_text, re.DOTALL)
        data["recommendations"] = [r.strip() for r in recs if r.strip()]
    
    # Extract role fit
    role_fit_match = re.search(r'\*\*Role Fit Assessment:\*\*\s*(.+?)(?=\*\*Final Note:\*\*|\n\n---|\Z)', clean_text, re.DOTALL)
    if role_fit_match:
        data["role_fit"] = role_fit_match.group(1).strip()
    
    # Extract final note (optional)
    final_note_match = re.search(r'\*\*Final Note:\*\*\s*(.+?)(?=\n\n---|\Z)', clean_text, re.DOTALL)
    if final_note_match:
        data["final_note"] = final_note_match.group(1).strip()
    
    return data


def create_html_email(candidate_name: str, job_title: str, report_data: dict) -> str:
    """
    Creates a beautiful HTML email template for the interview report
    """
    
    # Generate strengths HTML
    strengths_html = ""
    for strength in report_data["strengths"]:
        strengths_html += f"""
        <li style="margin-bottom: 12px; line-height: 1.6;">{strength}</li>
        """
    
    # Generate weaknesses HTML
    weaknesses_html = ""
    for weakness in report_data["weaknesses"]:
        weaknesses_html += f"""
        <div style="margin-bottom: 20px;">
            <strong style="color: #2563eb;">{weakness['title']}:</strong>
            <p style="margin: 8px 0 0 0; line-height: 1.6;">{weakness['description']}</p>
        </div>
        """
    
    # Generate communication assessment HTML
    communication_html = ""
    comm_labels = {
        "confidence": "Confidence",
        "clarity": "Clarity",
        "pace_fluency": "Pace & Fluency",
        "enthusiasm": "Enthusiasm",
        "professionalism": "Professionalism"
    }
    for key, label in comm_labels.items():
        if key in report_data["communication"]:
            communication_html += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">{label}:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">{report_data["communication"][key]}</td>
            </tr>
            """
    
    # Generate recommendations HTML
    recommendations_html = ""
    for rec in report_data["recommendations"]:
        recommendations_html += f"""
        <li style="margin-bottom: 12px; line-height: 1.6;">{rec}</li>
        """
    
    # Score color based on value
    score_value = int(report_data["overall_score"].split("/")[0]) if report_data["overall_score"] else 5
    if score_value >= 8:
        score_color = "#10b981"  # Green
    elif score_value >= 6:
        score_color = "#f59e0b"  # Orange
    else:
        score_color = "#ef4444"  # Red
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Performance Report</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Interview Performance Report</h1>
                                <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">AI-Powered Interview Analysis</p>
                            </td>
                        </tr>
                        
                        <!-- Candidate Info -->
                        <tr>
                            <td style="padding: 30px;">
                                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Candidate</p>
                                    <p style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 600;">{candidate_name}</p>
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Position</p>
                                    <p style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: 500;">{job_title}</p>
                                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Date</p>
                                    <p style="margin: 0; color: #111827; font-size: 16px;">{datetime.now().strftime("%B %d, %Y")}</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Overall Score -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 700;">Overall Performance</h2>
                                <div style="text-align: center; background-color: #f9fafb; padding: 30px; border-radius: 8px;">
                                    <div style="display: inline-block; background-color: {score_color}; color: #ffffff; font-size: 48px; font-weight: 700; padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        {report_data["overall_score"]}
                                    </div>
                                    <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 16px; line-height: 1.6;">{report_data["score_justification"]}</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Key Strengths -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 700;">✨ Key Strengths</h2>
                                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                                    {strengths_html}
                                </ul>
                            </td>
                        </tr>
                        
                        <!-- Areas for Development -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 700;">📈 Areas for Development</h2>
                                <div style="color: #374151;">
                                    {weaknesses_html}
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Communication Assessment -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 700;">🎤 Communication & Delivery</h2>
                                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                                    {communication_html}
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Recommendations -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 700;">💡 Recommendations for Improvement</h2>
                                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                                    {recommendations_html}
                                </ul>
                            </td>
                        </tr>
                        
                        <!-- Role Fit Assessment -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 700;">🎯 Role Fit Assessment</h2>
                                <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <p style="margin: 0; color: #1e40af; line-height: 1.6;">{report_data["role_fit"]}</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Final Note (if present) -->
                        {'<tr><td style="padding: 0 30px 30px 30px;"><div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;"><p style="margin: 0; color: #92400e; line-height: 1.6; font-weight: 500;">' + report_data["final_note"] + '</p></div></td></tr>' if report_data.get("final_note") else ''}
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">This report was generated by AI Interview Coach</p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">Keep this report for your records and future interview preparation</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    return html


async def send_interview_report_email(
    recipient_email: str,
    candidate_name: str,
    job_title: str,
    report_text: str
) -> bool:
    """
    Sends the interview report via email
    
    Args:
        recipient_email: Email address of the candidate
        candidate_name: Name of the candidate
        job_title: Job position title
        report_text: The full report text from the agent
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("❌ Email configuration missing. Please set SENDER_EMAIL and SENDER_PASSWORD in .env")
        return False
    
    try:
        # Parse the report
        report_data = parse_report(report_text)
        
        # Create HTML email
        html_content = create_html_email(candidate_name, job_title, report_data)
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"Interview Performance Report - {job_title}"
        message["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
        message["To"] = recipient_email
        
        # Create plain text version (fallback)
        text_content = f"""
Interview Performance Report

Candidate: {candidate_name}
Position: {job_title}
Date: {datetime.now().strftime("%B %d, %Y")}

{report_text}

---
This report was generated by AI Interview Coach
        """
        
        # Attach both versions
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        message.attach(part1)
        message.attach(part2)
        
        # Send email
        print(f"📧 Sending email to {recipient_email}...")
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        print(f"✅ Email sent successfully to {recipient_email}")
        interview_score = None
        if report_data.get("overall_score"):
            try:
                # Extract the number before the "/" (e.g., "8/10" -> 8.0)
                score_str = report_data["overall_score"].split("/")[0].strip()
                interview_score = float(score_str)
            except (ValueError, IndexError) as e:
                print(f"⚠️ Could not parse score '{report_data['overall_score']}': {e}")
        try:
            response = requests.post(
                "http://localhost:3001/interviews/save-report",
                json={
                    "candidate_email": recipient_email,
                    "job_title": job_title,
                    "interview_score": interview_score,
                    "conclusion": report_data["final_note"]
                }
            )
            if response.status_code == 200:
                print("✅ Interview report saved to database")
            else:
                print(f"❌ Failed to save interview report: {response.text}")
        except Exception as e:
            print(f"❌ Error saving interview report to database: {str(e)}")    
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False


def extract_report_from_message(message_content: str) -> str:
    """
    Extracts the report section from the agent's message
    Removes the concluding phrases and preamble
    """
    # Look for the report section
    report_start = message_content.find("INTERVIEW PERFORMANCE REPORT")
    if report_start == -1:
        report_start = message_content.find("**INTERVIEW PERFORMANCE REPORT**")
    
    if report_start != -1:
        # Extract from report start onwards
        report_content = message_content[report_start:]
        
        # Remove common closing phrases that come after the report
        closing_phrases = [
            "Best of luck with your interview preparation",
            "This session is now complete",
            "Good luck with your interview preparation",
            "Thank you for participating"
        ]
        
        for phrase in closing_phrases:
            if phrase in report_content:
                report_content = report_content[:report_content.find(phrase)]
        
        return report_content.strip()
    
    # If report marker not found, look for the preamble and remove it
    preamble_phrases = [
        "Thank you for your time today. That concludes the interview questions.",
        "That concludes the interview questions.",
        "Thank you for your time today."
    ]
    
    content = message_content
    for phrase in preamble_phrases:
        if phrase in content:
            # Remove the preamble phrase
            content = content.replace(phrase, "").strip()
    
    return content