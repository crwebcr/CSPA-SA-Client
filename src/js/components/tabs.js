import React, { PropTypes } from 'react'

export default function Tabs({ active, selectTab, tabs }) {
  return (
      <ul className="tabs">
        {
          tabs.map(([name, label]) => 
            <li key={label} className={name === active && 'active'}
                onClick={() => selectTab(name)}>
              {label}
            </li>)
        }
      </ul>
  )
}

Tabs.propTypes = {
  active: PropTypes.string.isRequired,
  selectTab: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired
}