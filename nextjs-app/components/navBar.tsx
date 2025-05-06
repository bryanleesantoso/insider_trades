'use client';
import React, { useState, useEffect } from 'react';

const NavBar = () => {
  const [bannerVisible, setBannerVisible] = useState(true);

  // Check if banner is closed on mount
  useEffect(() => {
    const bannerClosed = localStorage.getItem('progressBannerClosed');
    if (bannerClosed === 'true') {
      setBannerVisible(false);
    }

    // Listen for storage events (when banner is closed)
    const handleStorageChange = () => {
      const bannerClosed = localStorage.getItem('progressBannerClosed');
      if (bannerClosed === 'true') {
        setBannerVisible(false);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    
    if (targetId) {
      // Update URL with hash
      window.history.pushState(null, '', `#${targetId}`);
      
      // Scroll to element
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '0.8rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: bannerVisible ? '40px' : 0, 
      left: 0,
      right: 0,
      marginTop: 0,
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      zIndex: 1000,
      transition: 'top 0.3s ease', 
    }}>
      <a 
        href="#insider-transactions-anchor" 
        onClick={handleNavClick}
        style={{
          color: 'black',
          fontWeight: 'normal',
          fontSize: '1rem',
          fontFamily: 'Helvetica, Arial, sans-serif',
          textDecoration: 'none', 
          transition: 'color 0.2s ease', 
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'grey'} 
        onMouseOut={(e) => e.currentTarget.style.color = 'black'} 
      >
        Insider Trades
      </a>
    </nav>
  );
};

export default NavBar;