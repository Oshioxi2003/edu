'use client';

import { useEffect, useState } from 'react';

const HydrationBoundary = ({ children, fallback = null }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true);
    
    // Additional cleanup for browser extensions
    const cleanup = () => {
      const problematicAttrs = [
        'bis_skin_checked',
        'bis_register',
        'bis_id',
        'bis_size',
        'cz-shortcut-listen',
        '__processed_0d190e9b-0470-483d-baf1-5c1e1faddbff__',
        '__processed_568d8506-79b7-406c-97d7-752bfc41d06f__'
      ];

      const cleanElement = (element) => {
        if (!element || element.nodeType !== 1) return;
        
        problematicAttrs.forEach(attr => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });

        if (element.children) {
          Array.from(element.children).forEach(child => {
            cleanElement(child);
          });
        }
      };

      // Clean the entire document
      cleanElement(document.documentElement);
      cleanElement(document.body);
    };

    // Run cleanup
    cleanup();

    // Set up interval to continuously clean
    const interval = setInterval(cleanup, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!isHydrated) {
    return fallback || (
      <div className="hydration-loading">
        <div className="hydration-spinner"></div>
      </div>
    );
  }

  return <div className="hydration-boundary" suppressHydrationWarning>{children}</div>;
};

export default HydrationBoundary;
