import { useState } from "react";
import { Upload, ArrowLeft, FileText, CheckCircle } from "lucide-react";
import { Button } from "./ui/Button";

export default function UploadView({ onUploadComplete, onBack, loading }) {
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploaded(true);

      // Simulate upload to server
      // In production, you would actually upload the file here
      setTimeout(() => {
        console.log("File uploaded:", file.name);
      }, 500);
    }
  };

  const handleContinue = () => {
    if (uploaded) {
      onUploadComplete();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          background: "rgba(255, 255, 255, 0.2)",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white",
          transition: "all 0.2s",
          backdropFilter: "blur(10px)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <ArrowLeft size={24} />
      </button>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "3rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <FileText size={40} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Upload Your CV
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Upload your CV so we can personalize your interview experience
          </p>
        </div>

        {/* Upload Area */}
        <div
          style={{
            border: "2px dashed #d1d5db",
            borderRadius: "12px",
            padding: "3rem 2rem",
            textAlign: "center",
            marginBottom: "2rem",
            background: uploaded ? "#f0fdf4" : "#f9fafb",
            borderColor: uploaded ? "#22c55e" : "#d1d5db",
            transition: "all 0.3s",
          }}
        >
          <input
            type="file"
            id="cv-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {!uploaded ? (
            <>
              <Upload
                size={48}
                style={{ color: "#9ca3af", marginBottom: "1rem" }}
              />
              <p
                style={{
                  fontSize: "1rem",
                  color: "#374151",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Click to upload or drag and drop
              </p>
              <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                PDF, DOC, or DOCX (max 10MB)
              </p>
              <label htmlFor="cv-upload">
                <button
                  onClick={() => document.getElementById("cv-upload").click()}
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 2rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  Browse Files
                </button>
              </label>
            </>
          ) : (
            <>
              <CheckCircle
                size={48}
                style={{ color: "#22c55e", marginBottom: "1rem" }}
              />
              <p
                style={{
                  fontSize: "1rem",
                  color: "#22c55e",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                File uploaded successfully!
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1rem",
                }}
              >
                {fileName}
              </p>
              <button
                onClick={() => {
                  setUploaded(false);
                  setFileName("");
                }}
                style={{
                  padding: "0.5rem 1.5rem",
                  background: "transparent",
                  color: "#667eea",
                  border: "2px solid #667eea",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Upload Different File
              </button>
            </>
          )}
        </div>

        {/* Note */}
        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #fbbf24",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#92400e",
              margin: 0,
            }}
          >
            <strong>Note:</strong> Your CV is used only for this session and is
            not stored permanently.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!uploaded || loading}
          style={{
            width: "100%",
            padding: "1rem",
            background:
              uploaded && !loading
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#d1d5db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.125rem",
            fontWeight: "700",
            cursor: uploaded && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            opacity: uploaded && !loading ? 1 : 0.6,
          }}
          onMouseOver={(e) => {
            if (uploaded && !loading) {
              e.currentTarget.style.transform = "scale(1.02)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {loading ? "Starting Interview..." : "Continue to Interview"}
        </button>
      </div>
    </div>
  );
}
