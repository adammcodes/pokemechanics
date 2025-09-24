"use client";
import React from "react";

interface GraphQLErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface GraphQLErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class GraphQLErrorBoundary extends React.Component<
  GraphQLErrorBoundaryProps,
  GraphQLErrorBoundaryState
> {
  constructor(props: GraphQLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): GraphQLErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        "GraphQL Error Boundary caught an error:",
        error,
        errorInfo
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="p-4 text-center text-red-600">
            <p>Something went wrong loading this data.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default GraphQLErrorBoundary;
