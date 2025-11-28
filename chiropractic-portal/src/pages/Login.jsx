import React, { useState } from 'react'
import logo from '../assets/Logo.png'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setError('')
    console.log('Login attempt:', { email, password })

    // TODO: Replace with Axios POST to backend when ready
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2f46] to-[#09283a] px-4">
      <div className="w-full max-w-md p-10 rounded-2xl shadow-xl bg-[#dbe9f4] border border-gray-100">
        
        {/* Logo Only */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="ChiroSmith Logo"
            className="w-28 h-auto object-contain"
          />
        </div>

        {/* Centered Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:(outline-none ring-2 ring-[#133f59]) shadow-inner transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:(outline-none ring-2 ring-[#133f59]) shadow-inner transition"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#133f59] text-white rounded-lg font-semibold hover:(bg-[#0d2f46] shadow-lg -translate-y-0.5) transition-all"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?
          <Link to="/signup" className="text-[#133f59] hover:underline ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
