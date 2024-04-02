import React, {useState} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import './index.css';
import Edit from './Components/Edit';
import Overview from './Components/Overview';

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/edit/:id' element={<Edit/>} />
          <Route path='/overview/:userId' element={<Overview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
