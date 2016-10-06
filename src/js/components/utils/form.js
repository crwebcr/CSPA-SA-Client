import React, { Component, PropTypes } from 'react'



export const checkbox = (name, label, before) => (data, cb) => {
  const onChange = () => {
    data[name] = !data[name]
    cb(data)
  }
  return (
    <div className="label" key={name}>
      { before && <label>{label}</label>}
      <input type="checkbox" checked={data[name]} onChange={onChange}/>
      { !before && <label className="after">{label}</label>}
    </div>
  )
}

export const select = (name, label, options) => (data, cb) => {
  const onChange = e => {
    data[name] = e.target.value //we mutate the state, we could make it cleaner,
                    //but there is no need for it right now since it will be
                    //wrapped in the `setState` of the main component via the
                    //calling component `changeSpec` prop
    cb(data)
  }
  return (
    <div className="label" key={name}>
      <label>{label}</label>
      <select value={data[name]} onChange={onChange}>
        {
          options.map(option => {
            let value, label
            if (typeof option === 'string') value = label = option
            else {
              value = option.value
              label = option.label
            }
            return <option key={value} value={value}>{label}</option>
          })
        }
      </select>
    </div>
  )
}

export const numberInput = (name, label, min, max) => (data, cb) => {
  const onChange = e => {
    e.preventDefault()
    const val = e.target.value
    if (!(val >= min && val <= max)) return
    data[name] = parseInt(val) || undefined
    return cb(data)
    //TODO show an hint if an invalid input was filled in.
    //In the previous version, an alert message was shown, but it might not be
    //the best way of informing the user about the valid range.
    //Old message:  `value must be between ${min} and ${max}`
  }
  const val = data[name] !== undefined ? data[name] : ''

  return (
    <div className="label" key={name}>
      <label>{label}</label>
      <input type="text" value={val} onChange={onChange} />
    </div>
  )
}

export const buildCmpnts = dscrs => {
  const fns = dscrs.map(([fn, ...params]) => fn(...params))
  return (data, cb) => fns.map(f => f(data, cb))
}

export const buildNamedCmpnts = dscrs => {
  const fns = dscrs.map(([fn, ...params]) => fn(...params))
  const names = dscrs.map(([,name]) => name)
  return (data, cb) => names.reduce((_, name, i) => {
    _[name] = fns[i](data, cb)
    return _
  }, {})
}

  
