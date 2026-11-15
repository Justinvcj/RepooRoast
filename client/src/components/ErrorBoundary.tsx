import React from 'react';
import { Link } from 'react-router-dom';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-serif font-semibold text-danger mb-4">
              Something broke.
            </h1>
            <p className="text-textSecondary mb-8">
              Something went wrong rendering this page. It's not you, it's us — try heading back home.
            </p>
            {import.meta.env.DEV && this.state.error?.message && (
              <p className="font-mono text-xs text-textSecondary/50 mb-8 break-words">
                {this.state.error.message}
              </p>
            )}
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
