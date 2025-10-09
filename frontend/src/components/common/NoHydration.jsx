'use client';

import { useEffect, useState } from 'react';

const NoHydration = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback || (
      <div className="hydration-loading">
        <div className="hydration-spinner"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NoHydration;
