import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../elements/Button';

/** Catches render errors (including failed lazy chunk loads) so the user never sees a blank page. */
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <FiAlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-lg font-semibold text-ink">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted">
            An unexpected error stopped this page from loading. Reloading usually fixes it.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
