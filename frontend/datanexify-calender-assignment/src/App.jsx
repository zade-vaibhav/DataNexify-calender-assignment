import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'
import Login from './pages/Auth/Login';
import Home from './pages/Home';

function App() {

  return (
    <GoogleOAuthProvider clientId="1009323095218-rtmecje2fqu3qpqsnt6k1ogq48qhqbdd.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Home />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>

  )
}

export default App
