import React, { PropTypes } from 'react'
import OutputDetails from './output-details'
import CalendarDetails from './calendar-details'
import OutlierDetails from './outlier-details'
import ModelDetails from './model-details'
import TransformationDetails from './transformation-details'

import {
  TRANSFORMATION, MODEL, OUTLIERS, CALENDAR, OUTPUTS
} from '../constants'

const detailsMapping = {
  [TRANSFORMATION]: [TransformationDetails, 'transformSpec'],
  [MODEL]: [ModelDetails, 'arimaSpec'],
  [OUTLIERS]: [OutlierDetails, 'outlierSpec'],
  [CALENDAR]: [CalendarDetails, 'calendarSpec'],
  [OUTPUTS]: [OutputDetails, 'outputFilter']
}

export default function SpecTabDetails({ spec, changeSpec, what }) {
  const [Cmpnt, key] = detailsMapping[what]
  const changeSpecKey = val => changeSpec({
    ...spec,
    [key]: val
  })
  return (
    <div className="tab-details">
      <Cmpnt spec={spec[key]} changeSpec={changeSpecKey} />
    </div>
  )
}

SpecTabDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired,
  what: PropTypes.string.isRequired
}