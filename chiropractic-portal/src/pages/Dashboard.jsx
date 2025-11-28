import React, { useMemo, useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'

function formatTimeLabel(dateObj) {
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = ((hours + 11) % 12) + 1
  const minStr = minutes.toString().padStart(2, '0')
  return `${hour12}:${minStr} ${period}`
}

export default function Dashboard() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const dateInputRef = useRef(null)
  const outlet = useOutletContext() || {}
  const setSelectedSlot = outlet.setSelectedSlot

  function formatInputDate(d) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const days = useMemo(() => {
    const base = new Date(startDate)
    base.setHours(0, 0, 0, 0)
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return {
        key: d.toISOString().slice(0, 10),
        weekday: d.toLocaleDateString(undefined, { weekday: 'short' }),
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }
    })
  }, [startDate])

  const timeSlots = useMemo(() => {
    const start = new Date()
    start.setHours(5, 0, 0, 0)   // 5:00 AM
    const end = new Date()
    end.setHours(22, 0, 0, 0)    // 10:00 PM
    const slots = []
    const stepMinutes = 15
    const cursor = new Date(start)
    while (cursor < end) {
      slots.push(new Date(cursor))
      cursor.setMinutes(cursor.getMinutes() + stepMinutes)
    }
    return slots
  }, [])

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: '100px repeat(5, minmax(0, 1fr))' }}>
          <div
            className="bg-[#eef5fb] px-3 py-2 text-sm text-[#0d2f46] flex items-center"
            style={{ border: '2px solid #cfd8e3' }}
          >
            <button
              type="button"
              aria-label="Select start date"
              onClick={() => {
                const el = dateInputRef.current
                if (!el) return
                if (typeof el.showPicker === 'function') {
                  el.showPicker()
                } else {
                  el.click()
                }
              }}
              className="inline-flex items-center justify-center h-8 w-8 rounded-none bg-white text-[#0d2f46] border border-[#cfd8e3] hover:bg-[#f7fbff] focus:(outline-none ring-2 ring-[#0d2f46]/30)"
              title="Change start date"
            >
              {/* calendar icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 9H3v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8ZM5 7a1 1 0 0 0-1 1v1h16V8a1 1 0 0 0-1-1H5Z" />
              </svg>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={formatInputDate(startDate)}
              onChange={(e) => {
                const val = e.target.value
                if (!val) return
                const [y, m, d] = val.split('-').map(Number)
                const next = new Date(y, m - 1, d)
                next.setHours(0, 0, 0, 0)
                setStartDate(next)
              }}
              className="sr-only"
              style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          {days.map((d, i) => (
            <div
              key={d.key}
              className="bg-[#eef5fb] px-3 py-2"
              style={{
                borderTop: '2px solid #cfd8e3',
                borderLeft: '2px solid #cfd8e3',
                borderBottom: '2px solid #cfd8e3',
                borderRight: i === days.length - 1 ? '2px solid #cfd8e3' : 'none'
              }}
            >
              <div className="text-[#0d2f46] text-sm font-semibold">{d.weekday}</div>
              <div className="text-[#0d2f46]/70 text-xs">{d.date}</div>
            </div>
          ))}
        </div>

        <div className="max-h-[70vh] overflow-auto">
          {timeSlots.map((slot, idx) => {
            const minutes = slot.getMinutes()
            const isHourLine = minutes === 0
            const showLabel = minutes === 0 || minutes === 30
            const rowBg = idx % 2 === 0 ? '#ffffff' : '#eaf3fb'
            return (
              <div
                key={slot.toISOString()}
                className="grid"
                style={{
                  gridTemplateColumns: '100px repeat(5, minmax(0, 1fr))',
                  backgroundColor: rowBg,
                  backgroundImage: 'linear-gradient(#cfd8e3, #cfd8e3)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 1px',
                  backgroundPosition: '0 0',
                  borderBottom: idx === timeSlots.length - 1 ? '1px solid #cfd8e3' : 'none'
                }}
              >
                <div className="px-3 py-1 text-[11px] text-gray-600 flex items-center"
                  style={{
                    borderLeft: '2px solid #cfd8e3',
                    borderRight: '2px solid #cfd8e3',
                    height: '16px',
                    boxSizing: 'border-box'
                  }}>
                  {showLabel ? formatTimeLabel(slot) : ''}
                </div>
                {days.map((d, i) => (
                  <div
                    key={`${d.key}-${idx}`}
                    className="hover:bg-[#e1effd] transition"
                    style={{
                      borderLeft: '2px solid #cfd8e3',
                      borderRight: i === days.length - 1 ? '2px solid #cfd8e3' : 'none',
                      height: '16px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => {
                      if (!setSelectedSlot) return
                      const timeLabel = formatTimeLabel(slot)
                      const dayDate = new Date(`${d.key}T00:00:00`)
                      const dayLabel = dayDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                      setSelectedSlot({ timeLabel, dayLabel })
                    }}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

