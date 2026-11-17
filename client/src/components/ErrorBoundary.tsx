import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from './ui';
import { AlertCircle, Home } from 'lucide-react';

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
        <main className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-background flex items-center justify-center p-6 select-none">
          <Card level={1} className="max-w-md w-full p-8 sm:p-10 text-center border-border-hairline flex flex-col items-center">
            <div className="p-3.5 rounded-lg bg-data-critical/10 text-data-critical border border-data-critical/20 mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h1 className="text-3xl font-medium text-textPrimary tracking-tight font-sans mb-3">
              This page failed to load
            </h1>

            <p className="text-sm text-textSecondary font-normal leading-relaxed mb-8">
              The page hit an error while rendering. Go back home and run the roast again.
            </p>

            {import.meta.env.DEV && this.state.error?.message && (
              <div className="w-full bg-surface-secondary p-3 rounded-lg border border-border-hairline text-left font-mono text-xs text-textMuted mb-6 break-words overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              tabIndex={-1}
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Back to Home
              </Button>
            </Link>
          </Card>
        </main>
      );
    }
    return this.props.children;
  }
}
