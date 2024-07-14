import React, { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Edit from './Components/Edit';
import Overview from './Components/Overview';
import Image from './Components/Image';
import Remainders from './Components/Remainders';
import Login from './Components/Login'
import TransactionForm from './Components/TransactionForm';
import Homex from './Components/Homex';
import Email from './Components/Email';
import Verifi from './Components/Verifi';

// 1. Create a context
const UserIdContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  // const [remindMe, setRemindMe] = useState(false); 



  useEffect(() => {
    handleLogin();
    handleLoginL();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLoginL = () => {
    const token = localStorage.getItem('token');
    console.log("Token", token);
    setIsLoggedIn(!!token);
    setUserId(token ? localStorage.getItem('id') : ''); // Set userId if logged in
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
    <UserIdContext.Provider value={userId}> 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homex userId={userId} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
          <Route path='/signup' element={<Login handleLogin={handleLogin} />} />
          <Route path='/edit/:id' element={<Edit />} />
          {/* <Route path='/overview/:userId' element={<Overview userId={userId}/>} /> */}
          <Route path='/form' element={<TransactionForm/>} />
          <Route path='/images' element={<Image userId={userId} />} />
          <Route path='/verification' element={<Email handleLoginL={handleLoginL} />} />
          <Route path='/verifi' element={<Verifi />} />
          <Route path='/rem' element={<Remainders userId={userId} />}></Route>
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

// import React, { useState } from 'react';
// import nlp from 'compromise';

// const TransactionForm = () => {
//     const [userText, setUserText] = useState('');
//     const [transactionInfo, setTransactionInfo] = useState({
//         title: "Transaction",
//         date: new Date(),
//         amount: 0,
//         category: "Others", // Default category
//         description: "",
//         mode: "Unknown"
//     });

//     const handleUserTextChange = (event) => {
//         setUserText(event.target.value);
//     };

//     const extractTransactionInfo = () => {
//         const amountMatch = userText.match(/\d+(\.\d+)?/);
//         const dateMatch = userText.match(/(\d{2})\/(\d{2})\/(\d{4})/);

//         const extractedInfo = {
//             amount: amountMatch ? parseFloat(amountMatch[0]) : 0,
//             date: dateMatch ? new Date(`${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2]}`) : new Date()
//         };

//         // Extract mode based on keywords for "credited" and "debited"
//         const creditKeywords = ['received', 'credited'];
//         const debitKeywords = ['paid', 'spent', 'bought'];
//         let mode = "Unknown";

//         creditKeywords.forEach(keyword => {
//             if (userText.toLowerCase().includes(keyword)) {
//                 mode = "Credited";
//             }
//         });

//         debitKeywords.forEach(keyword => {
//             if (userText.toLowerCase().includes(keyword)) {
//                 mode = "Debited";
//             }
//         });

//         extractedInfo.mode = mode;

//         // Extract category and generate title based on predefined options
//         const categories = {
//             Food: "Food Expense",
//             Transportation: "Transportation Expense",
//             Shopping: "Shopping Expense",
//             Utilities: "Utilities Expense",
//             Rent: "Rent Expense",
//             Healthcare: "Healthcare Expense",
//             Entertainment: "Entertainment Expense",
//             Education: "Education Expense",
//             Travel: "Travel Expense",
//             Salary: "Salary Income",
//             Others: "Other Expense"
//         };
        
//         const doc = nlp(userText.toLowerCase());
//         const keywords = doc.nouns().out('array');

//         Object.keys(categories).forEach(category => {
//             if (keywords.includes(category.toLowerCase())) {
//                 extractedInfo.category = category;
//                 extractedInfo.title = categories[category];
//             }
//         });

//         setTransactionInfo({ ...transactionInfo, ...extractedInfo });
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         extractTransactionInfo();
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Enter transaction details:
//                     <input type="text" value={userText} onChange={handleUserTextChange} />
//                 </label>
//                 <button type="submit">Extract Info</button>
//             </form>
//             <div>
//                 <h2>Extracted Transaction Info:</h2>
//                 <p>Amount: {transactionInfo.amount}</p>
//                 <p>Date: {transactionInfo.date.toLocaleDateString()}</p>
//                 <p>Mode: {transactionInfo.mode}</p>
//                 <p>Category: {transactionInfo.category}</p>
//                 <p>Title: {transactionInfo.title}</p>
//             </div>
//         </div>
//     );
// };

// export default TransactionForm;

