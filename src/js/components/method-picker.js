import React from 'react'

const methodLabels = {
  x13: 'X13',
  ts: 'Tramoseats'
}
export default function MethodPicker({ method, methods, onChange }) {
  return (
    <div className="inline" >
      <label className="light">Method:</label>
      <select value={method} onChange={e => onChange(e.target.value)}>
        {
          methods.map(method => 
            <option key={method} value={method}>{methodLabels[method]}</option>
          )
        }
      </select>
    </div>
  )
}