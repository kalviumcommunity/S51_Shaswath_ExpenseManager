import React from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import SignUp from './Components/SignUp'
import './index.css'

function App() {

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<SignUp/>} />          
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App


// import React from "react";
// import { TEInput } from "tw-elements-react";

// export default function InputText(): JSX.Element {
//   return (
    // <TEInput
    //   type="text"
    //   id="exampleFormControlInputText"
    //   label="Text input"
    // ></TEInput>
//   );
// }