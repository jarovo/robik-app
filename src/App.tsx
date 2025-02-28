import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import Login from './components/Login';
import Calendar from './components/Calendar'; // Your component to display calendar events
import GoogleLoginButton from './components/GoogleLoginButton';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (credential: string) => {
    // Verify the credential on your backend and obtain an access token
    // For demonstration, we'll assume the credential is the access token
    setToken(credential);
  };

  const handleLogout = () => {
    setToken(null)
  }

  return (
    <div className="App">

      <div>   
        <GoogleLoginButton onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
        {!token ? (
          "Please log in"
        ) : (
          <Calendar token={token} />
        )}
      </div>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>      
    </div>
  );
}

export default App;
