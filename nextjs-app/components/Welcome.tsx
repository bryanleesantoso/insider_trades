'use client';
import React, { useState, useEffect } from 'react';

const Welcome = () => {
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

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      maxWidth: '1200px',
      margin: `${bannerVisible ? '80px' : '60px'} auto 0`, // Increased margin-top to make room for NavBar + Banner
      gap: '2rem'
    }}>
      <div style={{
        flex: '0.4',
        textAlign: 'right',
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          fontFamily: 'Helvetica, Arial, sans-serif',
          margin: '0'
        }}>
          Get Ahead <br/> Trading Hub
        </h1>
      </div>
      
      <div style={{
        flex: '0.4',
        textAlign: 'justify',
      }}>
        <p style={{
          fontSize: '1rem',
          fontFamily: 'Helvetica, Arial, sans-serif',
          lineHeight: '1.6',
          color: '#333'
        }}>
          Welcome to Get Ahead Trading Hub, your comprehensive platform for tracking and analyzing stock trades made by company insiders. 
          Get insights into what executives and board members are doing with their own company shares to inform your investment decisions. Made by Bryan Lee Santoso
        </p>
      </div>
    </div>
  );
};

export default Welcome;