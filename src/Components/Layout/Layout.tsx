import React from 'react';
import Header from '../Header/Header';
import MainContent from '../MainContent/MainContent';
import Footer from '../Footer/Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
};

export default Layout;
