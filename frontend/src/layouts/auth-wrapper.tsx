'use client';

import { ReactNode } from 'react';
import HeaderClient from './header-client';
import FooterClient from './footer-client';

interface AuthWrapperProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const AuthWrapper = ({ children, showHeader = true, showFooter = true }: AuthWrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <HeaderClient />}
      <main className="flex-1 w-full">{children}</main>
      {showFooter && <FooterClient />}
    </div>
  );
};

export default AuthWrapper;
