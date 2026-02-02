'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * Props for ErrorMessage component
 */
export interface ErrorMessageProps {
  error: string | null;
  onDismiss?: () => void;
  autoClose?: boolean;
  duration?: number;
  severity?: 'error' | 'warning' | 'info';
}

/**
 * ErrorMessage Component - Displays error messages with auto-dismiss capability
 * @param error - Error message to display
 * @param onDismiss - Callback when error is dismissed
 * @param autoClose - Auto-close after duration (default: true)
 * @param duration - Duration in ms before auto-close (default: 5000)
 * @param severity - Severity level for styling (default: 'error')
 */
export function ErrorMessage({
  error,
  onDismiss,
  autoClose = true,
  duration = 5000,
  severity = 'error',
}: ErrorMessageProps) {
  const [visible, setVisible] = useState(false);

  // Show/hide based on error prop
  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  // Auto-close timer
  useEffect(() => {
    if (!visible || !autoClose) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, autoClose, duration]);

  /**
   * Handle dismissal
   */
  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible || !error) return null;

  const severityClass = {
    error: styles.error,
    warning: styles.warning,
    info: styles.info,
  }[severity];

  return (
    <div className={`${styles.errorMessage} ${severityClass}`} role="alert" aria-live="polite">
      <span className={styles.icon}>
        {severity === 'error' && '✕'}
        {severity === 'warning' && '⚠'}
        {severity === 'info' && 'ℹ'}
      </span>
      <span className={styles.errorText}>{error}</span>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Close error message"
      >
        ×
      </button>
    </div>
  );
}

/**
 * ErrorBoundary Component - Catches React errors
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className={styles.errorBoundary}>
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className={styles.retryButton}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
