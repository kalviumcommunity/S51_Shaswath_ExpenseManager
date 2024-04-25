import React, { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import './index.css';
import Edit from './Components/Edit';
import Overview from './Components/Overview';
import Animate from './Animate';
import Image from './Components/Image';

// 1. Create a context
const UserIdContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    handleLogin();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLogin = () => {
    const token = getCookie('token');
    console.log("Token", token);
    setIsLoggedIn(!!token);
    setUserId(token ? getCookie('id') : ''); // Set userId if logged in
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false);
    setUserId('');
  };

  return (
    <UserIdContext.Provider value={userId}> {/* 2. Provide userId context */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
          <Route path='/signup' element={<Animate handleLogin={handleLogin} />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/overview/:userId' element={<Overview />} />
          {/* 3. Pass userId as a prop to the Image component */}
          <Route path='/images' element={<Image userId={userId} />} />
        </Routes>
      </BrowserRouter>
    </UserIdContext.Provider>
  );
}

// Custom hook to access userId context
function useUserId() {
  return useContext(UserIdContext);
}

export default App;
