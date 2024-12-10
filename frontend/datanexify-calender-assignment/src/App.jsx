import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Auth/Login';
import Home from './pages/Home';

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="login" element={<Login />} />
        <Route path="/" element={<Home />}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
