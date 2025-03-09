import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import Calendar from './components/Calendar'; // Your component to display calendar events
import GoogleLoginButton from './components/GoogleLoginButton';
import FakturoidAuth from './components/FakturoidAuth';

const App: React.FC = () => {
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const handleLoginSuccess = (credential: string) => {
    // Verify the credential on your backend and obtain an access token
    // For demonstration, we'll assume the credential is the access token
    console.log("Login success.")
    setGoogleToken(credential);
  };

  const handleLogout = () => {
    setGoogleToken(null)
    console.log("Logged out.")
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >        </a>
      </header>      
      <div>
        <FakturoidAuth />   
        <GoogleLoginButton onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
        {!googleToken ? (
          "Please log in"
        ) : (
          <div className="container">
            <Calendar token={googleToken} />
          </div>
        )}
      </div>    </div>
  );
}

export default App;
