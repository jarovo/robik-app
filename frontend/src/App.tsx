import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router";
import React from 'react';
import Login from './components/Login';
import Secure from './components/Secure';
import FakturoidLogin from './components/FakturoidLogin';
import GoogleLogin from './components/GoogleLogin';

const App: React.FC = () => {
  return (
      <div>
        <>
              <Router>
                <Routes>
                  <Route path="/login/google" element={<GoogleLogin />} />
                  <Route path="/login/fakturoid" element={<FakturoidLogin />} />
                  <Route path="/secure" element={<Secure />} />
                  <Route path="/" element={<Login />} />
                </Routes>
              </Router>

        </>
      </div>
  );
}

export default App;
