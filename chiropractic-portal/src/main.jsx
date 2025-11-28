import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Background from './pages/Background.jsx'
import Dashboard from './pages/Dashboard.jsx'

import 'uno.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/background" element={<Background />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<div className="text-[#0d2f46]">Patients page (placeholder)</div>} />
          <Route path="appointments" element={<div className="text-[#0d2f46]">Appointments page (placeholder)</div>} />
          <Route path="billing" element={<div className="text-[#0d2f46]">Billing page (placeholder)</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
