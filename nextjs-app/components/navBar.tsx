import React from 'react';

const NavBar = () => {
  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '0.8rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <span style={{
        color: 'black',
        fontWeight: 'normal',
        fontSize: '1rem',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}>
        Insider Trades
      </span>
    </nav>
  );
};

export default NavBar;