import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onAddPost?: () => void;
  showAddButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onAddPost, showAddButton }) => {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Header onAddPost={onAddPost} showAddButton={showAddButton} />
      <main className="container mx-auto px-4 pb-8">{children}</main>
    </div>
  );
};

export default Layout;