import { ReactNode } from 'react';
import AuthWrapper from './auth-wrapper';

interface WrapperProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Wrapper = ({ children, showHeader = true, showFooter = true }: WrapperProps) => {
  return (
    <AuthWrapper showHeader={showHeader} showFooter={showFooter}>
      {children}
    </AuthWrapper>
  );
};

export default Wrapper;
