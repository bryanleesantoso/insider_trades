import React from 'react';

const Welcome = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
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
          Get insights into what executives and board members are doing with their own company shares to inform your investment decisions.
        </p>
      </div>
    </div>
  );
};

export default Welcome;