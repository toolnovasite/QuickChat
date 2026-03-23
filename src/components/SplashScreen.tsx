import React, { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 seconds splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.container}>
      <img
        src={`${process.env.PUBLIC_URL}/splash_logo.png`}
        alt="Splash Logo"
        style={styles.logo}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#ffffff',
  } as React.CSSProperties,
  logo: {
    width: '200px',
    height: '200px',
  } as React.CSSProperties,
};

export default SplashScreen;