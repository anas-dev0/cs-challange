export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  style = {},
  ...props
}) {
  const baseStyle = {
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    },
    secondary: {
      background: "#f3f4f6",
      color: "#374151",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    destructive: {
      background: "#ef4444",
      color: "white",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
    },
  };

  const sizes = {
    sm: {
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
    },
    md: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
    },
    lg: {
      padding: "1rem 2rem",
      fontSize: "1.125rem",
    },
    icon: {
      padding: "0.75rem",
      fontSize: "1rem",
      width: "40px",
      height: "40px",
    },
  };

  const combinedStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
  };

  const handleMouseOver = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = "scale(1.05)";
    }
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...props}
    >
      {children}
    </button>
  );
}
