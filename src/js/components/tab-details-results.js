import React, { PropTypes } from 'react'

import { ADJUSTED, STATISTICS, EFFECTS } from '../constants'

const tabs = [
  [ADJUSTED, 'Adjusted series'], 
  [STATISTICS, 'Statistics'],
  [EFFECTS, 'Effect series']
]


function EntryList({ entries, select }) {
  return (
    <ul className="entries">
      {
        entries.map(({ name, label }, i) => 
          <li key={name} className={i % 2 ? '' : 'odd'} 
              onClick={() => select(name)}>
            {label}
          </li>)
      }
    </ul>
  )
}

EntryList.propTypes = {
  entries: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired
}

export default function TabDetailsResults(
  { resultsByType, selectSeries, selectStatistic, selectEffect, what }) {
  
  const detailsMapping = {
    [ADJUSTED]: selectSeries,
    [STATISTICS]: selectStatistic,
    [EFFECTS]: selectSeries
  }
      
  const select = detailsMapping[what]

  return (
    <div className="tab-details">
      <EntryList entries={resultsByType[what]} select={select} />
    </div>
  )
}

TabDetailsResults.propTypes = {
  resultsByType: PropTypes.object.isRequired,
  selectSeries: PropTypes.func.isRequired,
  selectStatistic: PropTypes.func.isRequired,
  what: PropTypes.string.isRequired
}