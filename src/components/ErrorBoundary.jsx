import React from 'react';
import { errorLogger } from '../services/ErrorLogger';
import { useI18n } from '../hooks/useI18n';

// Functional component that uses the i18n hook to render the error screen
function ErrorFallback({ error }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen cat-bg flex items-center justify-center p-4">
      <div className="game-container rounded-2xl p-6 shadow-2xl text-center">
        <h1 className="text-3xl font-cat font-bold text-white mb-4">
          {t('error.title')}
        </h1>
        <p className="text-white/80 mb-4">
          {t('error.message')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-cat-green to-cat-blue text-white font-bold py-3 px-6 rounded-xl hover:from-cat-blue hover:to-cat-green transition-all duration-200 border-2 border-white/30"
        >
          {t('error.restart')}
        </button>
        {import.meta.env.DEV && (
          <details className="mt-4 text-left">
            <summary className="text-white/60 cursor-pointer">{t('error.details')}</summary>
            <pre className="text-red-400 text-xs mt-2 bg-black/20 p-2 rounded overflow-auto">
              {error?.toString()}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    errorLogger.logError('ErrorBoundary', 'componentDidCatch', error.message, {
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
