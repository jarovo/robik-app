// GoogleSignInButton.tsx
import React, { useEffect, useRef } from 'react';

const client_id = process.env.REACT_APP_CLIENT_ID

// Extend the Window interface to include the google property
declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignInButton: React.FC = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Checking")
    // Ensure the google object and the ref are available
    if (window.google && buttonRef.current) {
      window.google.accounts.id.initialize({
        client_id: client_id, // Replace with your actual Client ID
        callback: (response: { credential: string }) => {
          // The response contains a JWT in response.credential
          console.log('Google Auth Response:', response);
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline', // Options: 'outline', 'filled_blue', 'filled_black'
        size: 'large',    // Options: 'small', 'medium', 'large'
      });
    } else {
        console.log("No")
    }
  }, []);

  return <div ref={buttonRef}></div>;
};

export default GoogleSignInButton;
