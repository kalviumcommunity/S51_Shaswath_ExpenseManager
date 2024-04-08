import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import './index.css';
import Edit from './Components/Edit';
import Overview from './Components/Overview';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    handleLogin()
  },[])
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

  const handleLogin = () => {
    const token = getCookie('token') 
    setIsLoggedIn(!!token);
  };


  const handleLogout = () => {
  
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
    setIsLoggedIn(false);
  };
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
          <Route path='/login' element={<Login handleLogin={handleLogin} />} />
          <Route path='/signup' element={<SignUp handleLogin={handleLogin} />} />
          <Route path='/edit/:id' element={<Edit/>} />
          <Route path='/overview/:userId' element={<Overview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;