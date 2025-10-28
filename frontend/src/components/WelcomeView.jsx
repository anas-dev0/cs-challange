import { Mic, CheckCircle, Target, TrendingUp } from "lucide-react";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all 0.3s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Icon size={24} color="white" />
      </div>
      <h3
        style={{
          color: "white",
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default function WelcomeView({ onGetStarted }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Mic size={60} color="white" />
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "800",
              marginBottom: "1rem",
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            AI Interview Coach
          </h1>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
              marginBottom: "3rem",
              maxWidth: "600px",
              margin: "0 auto 3rem",
              lineHeight: "1.6",
            }}
          >
            Practice interviews with AI-powered coaching. Get personalized
            feedback and improve your skills.
          </p>

          <button
            onClick={onGetStarted}
            style={{
              padding: "1.25rem 3rem",
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#667eea",
              background: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(0, 0, 0, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0, 0, 0, 0.3)";
            }}
          >
            Get Started
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          <FeatureCard
            icon={Target}
            title="Personalized Questions"
            description="Questions tailored to your CV and target role for realistic practice"
          />
          <FeatureCard
            icon={CheckCircle}
            title="Real-time Feedback"
            description="Get instant constructive feedback after each answer"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Detailed Reports"
            description="Receive comprehensive performance analysis at the end"
          />
        </div>

        {/* Bottom info */}
        <div
          style={{
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.875rem",
            }}
          >
            Powered by LiveKit & Advanced AI Technology
          </p>
        </div>
      </div>
    </div>
  );
}
