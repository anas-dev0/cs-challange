import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadView from "../components/UploadView";
import { useServices } from "../ServiceContext";

export default function InterviewerSetup() {
  const navigate = useNavigate();
  const { setCvFile, setInterviewConfig, addHistory } = useServices();
  const [loading, setLoading] = useState(false);

  const handleUploadComplete = async (
    filename: string,
    jobDesc: string,
    email: string,
    name: string,
    title: string
  ) => {
    try {
      setLoading(true);

      // Store all the interview data in ServiceContext
      setInterviewConfig({
        jobTitle: title,
        description: jobDesc,
        company: "", // Can be extracted from job description if needed
        language: "English",
        seniority: "Mid",
        experience: "",
        // Store additional fields
        cvFilename: filename,
        candidateEmail: email,
        candidateName: name,
      } as any);

      // Record history
      addHistory({
        type: "interview",
        title: title,
        meta: {
          company: "",
          language: "English",
          seniority: "Mid",
        },
      });

      // Navigate to interview session
      navigate("/interviewer/session");
    } catch (error) {
      console.error("Error processing upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <UploadView
      onUploadComplete={handleUploadComplete}
      onBack={handleBack}
      loading={loading}
    />
  );
}
