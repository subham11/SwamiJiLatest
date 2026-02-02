'use client';

import styles from './Loading.module.css';

/**
 * Loading skeleton component for better UX
 */
export interface LoadingProps {
  count?: number;
  type?: 'card' | 'text' | 'list' | 'image';
}

/**
 * LoadingSkeletons Component - Shows skeleton loaders for content
 */
export function LoadingSkeletons({ count = 4, type = 'card' }: LoadingProps) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className={styles.skeletonGrid}>
        {items.map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonText} style={{ width: '80%' }} />
            <div className={styles.skeletonText} style={{ width: '60%' }} />
            <div className={styles.skeletonText} style={{ width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={styles.skeletonList}>
        {items.map((_, index) => (
          <div key={index} className={styles.skeletonTextRow}>
            <div className={styles.skeletonText} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={styles.skeletonList}>
        {items.map((_, index) => (
          <div key={index} className={styles.skeletonListItem}>
            <div className={styles.skeletonCircle} />
            <div className={styles.skeletonTextBlock}>
              <div className={styles.skeletonText} style={{ width: '70%' }} />
              <div className={styles.skeletonText} style={{ width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className={styles.skeletonGrid}>
        {items.map((_, index) => (
          <div key={index} className={styles.skeletonImage} style={{ height: '300px' }} />
        ))}
      </div>
    );
  }

  return null;
}

/**
 * Props for LoadingSpinner component
 */
export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
}

/**
 * LoadingSpinner Component - Shows a loading spinner with optional message
 */
export function LoadingSpinner({
  message = 'Loading...',
  size = 'medium',
  fullscreen = false,
}: LoadingSpinnerProps) {
  const containerClass = `${styles.spinnerContainer} ${fullscreen ? styles.fullscreen : ''}`;
  const spinnerClass = `${styles.spinner} ${styles[size]}`;

  return (
    <div className={containerClass} role="status" aria-label="Loading">
      <div className={spinnerClass} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

/**
 * Props for LoadingBar component
 */
export interface LoadingBarProps {
  progress?: number;
}

/**
 * LoadingBar Component - Shows progress bar at top of page
 */
export function LoadingBar({ progress = 30 }: LoadingBarProps) {
  return (
    <div
      className={styles.loadingBar}
      style={{ width: `${Math.min(progress, 100)}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
