import React from 'react';
import './MainContent.css';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="main">
      <div className="container">{children}</div>
    </main>
  );
};

export default MainContent;
