import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router";
import React from 'react';
import Login from './components/Login';
import Secure from './components/Secure';

const App: React.FC = () => {
  return (
      <div>
        <>
              <Router>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/secure" element={<Secure />} />
                </Routes>
              </Router>

        </>
      </div>
  );
}

export default App;
