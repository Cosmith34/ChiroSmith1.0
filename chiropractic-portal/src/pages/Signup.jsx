import React, { useState } from 'react'
import logo from '../assets/Logo.png'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    address: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { email, password, confirmPassword } = formData
    if (!email || !password || !confirmPassword) {
      setError('Please complete all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    console.log('Signup data:', formData)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2f46] to-[#09283a] px-6 py-10">
      <div className="max-w-5xl mx-auto bg-[#dbe9f4] px-12 py-6 rounded-2xl shadow-xl border border-gray-100 mt-6">

        
      <div className="grid grid-cols-[auto_1fr] items-start gap-4 mb-2">
  <img src={logo} alt="ChiroSmith Logo" className="w-28 mt-1" />
  <h2 className="text-3xl font-bold text-[#0d2f46] text-center col-span-full mt-0 mb-2">
    Create an Account
  </h2>
</div>



        {error && <p className="text-red-600 text-sm text-center mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10">
          {/* Login Info Section */}
          <div>
            <h3 className="text-xl font-semibold text-[#0d2f46] mb-4 border-b border-[#0d2f46] pb-2">Login Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
              <div>
                <label>Phone Number</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
              <div>
                <label>Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
              <div>
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div>
            <h3 className="text-xl font-semibold text-[#0d2f46] mb-4 border-b border-[#0d2f46] pb-2">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
              <div>
                <label>Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
              <div>
                <label>Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
              <div>
                <label>Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 rounded border" />
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <button type="submit" className="w-full bg-[#133f59] text-white py-3 rounded-lg font-semibold hover:bg-[#0d2f46] transition">
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-[#133f59] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
