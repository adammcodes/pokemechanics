interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin relative`}>
        <div
          className="w-full h-full border-4 rounded-full"
          style={{
            borderColor: "var(--background-colour)",
            borderTopColor: "var(--text-colour)",
            borderBottomColor: "var(--shadow-colour)",
          }}
        ></div>
        {/* Middle circle */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            backgroundColor: "var(--text-colour)",
          }}
        />
      </div>
    </div>
  );
}
