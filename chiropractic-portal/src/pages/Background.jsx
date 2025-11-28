import React, { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logo from '../assets/Logo.png'

export default function Background() {
  const location = useLocation()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const displayName = useMemo(() => {
    const stored =
      localStorage.getItem('firstName') ||
      localStorage.getItem('name') ||
      localStorage.getItem('userName')
    if (!stored) return 'User'
    try {
      const parsed = JSON.parse(stored)
      if (typeof parsed === 'string' && parsed.trim()) return parsed
    } catch (_) {}
    return String(stored)
  }, [])

  const panel = useMemo(() => {
    const path = location.pathname
    // If a calendar slot is selected, show that context first
    if (path.startsWith('/background') && selectedSlot) {
      return {
        title: `${selectedSlot.dayLabel} — ${selectedSlot.timeLabel}`,
        body: ''
      }
    }
    if (path === '/background' || path === '/background/') {
      return {
        title: 'Dashboard Overview',
        body: 'Quick snapshot of today’s activity, upcoming appointments, and recent updates.'
      }
    }
    if (path.startsWith('/background/patients')) {
      return {
        title: 'Patients',
        body: 'Browse, search, and manage patient profiles, histories, and notes.'
      }
    }
    if (path.startsWith('/background/appointments')) {
      return {
        title: 'Appointments',
        body: 'View and manage the schedule, book new visits, and track attendance.'
      }
    }
    if (path.startsWith('/background/billing')) {
      return {
        title: 'Billing',
        body: 'Review invoices, payments, and insurance claims at a glance.'
      }
    }
    return {
      title: 'Summary',
      body: 'Contextual information about the current page will appear here.'
    }
  }, [location.pathname, selectedSlot])

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0d2f46] to-[#09283a]">
      <aside className="w-44 min-h-screen bg-[#dbe9f4] text-[#0d2f46] border-r border-[#0d2f46]/10">
        <div className="px-5 py-6 border-b border-[#0d2f46]/10 flex items-center gap-3">
          <img src={logo} alt="ChiroSmith Logo" className="w-10 h-10" />
          <span className="text-lg font-semibold">ChiroSmith</span>
        </div>
        <nav className="px-3 py-4 space-y-1">
          <NavLink
            to="/background"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition text-[#0d2f46] visited:text-[#0d2f46] ${
                isActive ? 'bg-[#c9dced]' : 'hover:bg-[#cfe1ee]'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/background/patients"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition text-[#0d2f46] visited:text-[#0d2f46] ${
                isActive ? 'bg-[#c9dced]' : 'hover:bg-[#cfe1ee]'
              }`
            }
          >
            Patients
          </NavLink>
          <NavLink
            to="/background/appointments"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition text-[#0d2f46] visited:text-[#0d2f46] ${
                isActive ? 'bg-[#c9dced]' : 'hover:bg-[#cfe1ee]'
              }`
            }
          >
            Appointments
          </NavLink>
          <NavLink
            to="/background/billing"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition text-[#0d2f46] visited:text-[#0d2f46] ${
                isActive ? 'bg-[#c9dced]' : 'hover:bg-[#cfe1ee]'
              }`
            }
          >
            Billing
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 min-h-screen bg-white flex flex-col">
        <header className="h-16 bg-[#dbe9f4] border-b border-[#0d2f46]/10 px-6 flex items-center justify-between">
          <div className="text-[#0d2f46] font-semibold text-lg">Hello Connor</div>
          <button
            type="button"
            aria-label="Settings"
            className="h-9 w-9 rounded-full flex items-center justify-center text-[#0d2f46] hover:bg-[#cfe1ee] focus:(outline-none ring-2 ring-[#0d2f46]/30)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M11.983 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
              <path fillRule="evenodd" d="M10.007 2.276c.51-1.02 1.976-1.02 2.486 0l.37.739c.17.338.52.548.899.548h.832c1.147 0 1.9 1.214 1.357 2.232l-.38.71c-.18.338-.13.752.127 1.04.112.122.228.24.348.353.288.258.703.308 1.04.128l.71-.38c1.019-.543 2.233.21 2.233 1.357v.832c0 .38.21.73.548.899l.739.37c1.02.51 1.02 1.976 0 2.486l-.739.37a1.05 1.05 0 0 0-.548.899v.832c0 1.147-1.214 1.9-2.232 1.357l-.71-.38a1.05 1.05 0 0 0-1.04.127 7.4 7.4 0 0 1-.353.348 1.05 1.05 0 0 0-.127 1.04l.38.71c.543 1.019-.21 2.233-1.357 2.233h-.832a1.05 1.05 0 0 0-.899.548l-.37.739c-.51 1.02-1.976 1.02-2.486 0l-.37-.739a1.05 1.05 0 0 0-.899-.548h-.832c-1.147 0-1.9-1.214-1.357-2.232l.38-.71a1.05 1.05 0 0 0-.127-1.04 7.4 7.4 0 0 1-.348-.353 1.05 1.05 0 0 0-1.04-.127l-.71.38c-1.019.543-2.233-.21-2.233-1.357v-.832c0-.38-.21-.73-.548-.899l-.739-.37c-1.02-.51-1.02-1.976 0-2.486l.739-.37c.338-.17.548-.52.548-.899v-.832c0-1.147 1.214-1.9 2.232-1.357l.71.38c.338.18.752.13 1.04-.127.122-.112.24-.228.353-.348.258-.288.308-.703.128-1.04l-.38-.71c-.543-1.019.21-2.233 1.357-2.233h.832c.38 0 .73-.21.899-.548l.37-.739Z" clipRule="evenodd" />
            </svg>
          </button>
        </header>
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <Outlet context={{ selectedSlot, setSelectedSlot }} />
          </main>
          <aside className="w-72 border-l border-[#0d2f46]/10 bg-[#eef5fb]">
            <div className="p-6">
              <div className="text-[#0d2f46]/70 text-xs font-semibold uppercase tracking-wide mb-1">
                Appointment Summary
              </div>
              <h2 className="text-[#0d2f46] font-semibold text-lg mb-2">{panel.title}</h2>
              <pre className="text-[#0d2f46]/80 text-sm leading-6 whitespace-pre-wrap">
{panel.body}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

