import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import Calendar from './components/Calendar'; // Your component to display calendar events
import GoogleLoginButton from './components/GoogleLoginButton';
import Invoices from './components/Invoices';
import FakturoidAuth from './components/FakturoidAuth';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (credential: string) => {
    // Verify the credential on your backend and obtain an access token
    // For demonstration, we'll assume the credential is the access token
    console.log("Login success.")
    setToken(credential);
  };

  const handleLogout = () => {
    setToken(null)
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
        <Invoices />
        <FakturoidAuth />   
        <GoogleLoginButton onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
        {!token ? (
          "Please log in"
        ) : (
          <div className="container">
            <Calendar token={token} />
          </div>
        )}
      </div>    </div>
  );
}

export default App;
