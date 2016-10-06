import React, { Component, PropTypes } from 'react'
import { numberInput, checkbox, select, buildNamedCmpnts } from './utils/form'


const calendarOptions = buildNamedCmpnts([
  [select, 'td', 'Calendar:', ['Default', 'None']],
  [select, 'tdOption', 'Regressors:', ['TradingDays', 'WorkingD ays']],
  [checkbox, 'tdLeapYear', 'Leap year', true],
  [checkbox, 'tdTestType', 'Pretest', true],
  [select, 'easter', 'Easter: ', ['None', 'In use']],
  [checkbox, 'easterPretest', 'Pretest:', true],
  [numberInput, 'easterDuration', 'Duration:', 1, 15]
])


  
export default function CalendarDetails({ spec, changeSpec }) {
  const { td, easter } = spec
  const els = calendarOptions(spec, changeSpec)

  return (
    <div className="cols-3">
      <div>
        {els.td}
      </div>
      <div>
        {td === 'Default' && [els.tdOption, els.tdLeapYear, els.tdTestType]}
      </div>
      <div>
        {els.easter}
        {easter === 'In use' && [els.easterDuration, els.easterPretest]}
      </div>
    </div>
  )
}

CalendarDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired
}