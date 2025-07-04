import { Component } from 'react';
import { toast } from 'react-hot-toast';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    toast.error(`Error: ${error.message}`);
    console.error('Error Boundary caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md p-6 text-center bg-red-100 rounded-lg">
            <h2 className="text-xl font-bold text-red-800">Something went wrong</h2>
            <p className="mt-2 text-red-600">
              We're having trouble processing your request. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}