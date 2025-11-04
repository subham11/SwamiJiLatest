'use client';

import { useEffect, useState } from 'react';

type PageLoaderProps = {
  /**
   * When provided, the loader becomes controlled: it renders only when `active` is true.
   * When omitted, the loader auto-shows and auto-hides after a minimum duration.
   */
  active?: boolean;
  /** Optional message to display under the spinner */
  message?: string;
  /** Minimum duration in ms for auto mode (ignored in controlled mode). Default: 1000 */
  minDurationMs?: number;
};

export function PageLoader({ active, message = 'Loading...', minDurationMs = 1000 }: PageLoaderProps) {
  // Auto mode (backward compatible with existing usage in layout)
  const [autoVisible, setAutoVisible] = useState<boolean>(typeof active === 'boolean' ? !!active : true);

  useEffect(() => {
    if (typeof active === 'boolean') {
      // Controlled mode: visibility driven by prop
      setAutoVisible(!!active);
      return;
    }
    // Auto mode: show for a minimum duration
    const timer = setTimeout(() => {
      setAutoVisible(false);
    }, Math.max(0, minDurationMs));
    return () => clearTimeout(timer);
  }, [active, minDurationMs]);

  // Determine if we should render
  const visible = typeof active === 'boolean' ? !!active : autoVisible;
  if (!visible) return null;

  return (
    <div className="pageLoader">
      <div className="loaderContent">
        <div className="loaderSpinner">
          <div className="spinnerRing"></div>
          <div className="spinnerRing"></div>
          <div className="spinnerRing"></div>
          <div className="om">🕉</div>
        </div>
        <h2 className="loaderText">{message}</h2>
        <div className="loaderBar">
          <div className="loaderProgress"></div>
        </div>
      </div>
    </div>
  );
}
