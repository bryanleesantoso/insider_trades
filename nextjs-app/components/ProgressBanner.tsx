'use client';
import React, { useState, useEffect } from 'react';

const ProgressBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 120000);

    return () => clearTimeout(timeoutId);
  }, []);   

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ffce38',
      color: '#333',
      padding: '0.6rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2000, 
      fontFamily: 'helvetica, Arial, sans-serif',
    }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ fontWeight: '500' }}>🚧 This project is still in development. Some features may be incomplete. 🚧</span>
      </div>
      <button 
        onClick={closeBanner}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          padding: '0 0.5rem',
          marginRight: '2.1rem',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          transition: 'background-color 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        aria-label="Close banner"
      >
        ×
      </button>
    </div>
  );
};

export default ProgressBanner;