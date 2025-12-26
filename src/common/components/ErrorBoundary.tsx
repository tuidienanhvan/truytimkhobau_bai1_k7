import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    console.error("Game Crash:", error, errorInfo); 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-neon-pink font-mono p-8 text-center">
          <div className="border border-neon-pink p-8 bg-space-900/90">
            <h1 className="text-2xl font-bold mb-4">LỖI HỆ THỐNG NGHIÊM TRỌNG</h1>
            <p>Phát hiện lỗi mô-đun. Vui lòng tải lại trang.</p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}