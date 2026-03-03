import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRedo, faHome } from '@fortawesome/free-solid-svg-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 text-[#F0F0FF]">
          <div className="max-w-md w-full bg-[#1A1A24] rounded-2xl p-8 border border-[#2A2A3A] shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4D6A] to-[#FF8A00] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,77,106,0.3)]">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-[#9898B8] mb-8">
              We encountered an unexpected error. Please try reloading the page or returning to the home screen.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={this.handleReload}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <FontAwesomeIcon icon={faRedo} />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="py-3 px-6 rounded-xl bg-[#2A2A3A] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#3A3A4A] transition-colors"
              >
                <FontAwesomeIcon icon={faHome} />
                Go to Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="text-left mt-6 border-t border-[#2A2A3A] pt-4">
                <button 
                  onClick={this.toggleDetails}
                  className="text-xs text-[#5C5C7A] hover:text-[#00D4FF] transition-colors mb-2"
                >
                  {this.state.showDetails ? 'Hide Error Details' : 'Show Error Details'}
                </button>
                
                {this.state.showDetails && (
                  <div className="bg-[#0D0D14] p-4 rounded-lg overflow-x-auto text-xs text-[#FF4D6A] font-mono">
                    <p className="font-bold mb-2">{this.state.error?.toString()}</p>
                    <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
