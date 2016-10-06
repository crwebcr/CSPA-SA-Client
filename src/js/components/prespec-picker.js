import React from 'react'

export default function PrespecPicker(
    { prespec, prespecs, onChange }) {
  return (
    <div className="inline">
      <label className="light">Default specification:</label>
      <select value={prespec} onChange={e => onChange(e.target.value)}>
        {
          prespecs.map(spec =>
            <option key={spec} value={spec}>{spec}</option>
          )
        }
      </select>
    </div>
  )
}