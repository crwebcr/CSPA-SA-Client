import React, { PropTypes } from 'react'
import { checkbox, buildCmpnts } from './utils/form'

const outlierOptions = buildCmpnts([
  [checkbox, 'AO', 'Additive'],
  [checkbox, 'LS', 'Level shift'],
  [checkbox, 'TC', 'Transitory'],
])

export default function OutlierDetails({ spec, changeSpec }) {
  return ( 
    <div>{outlierOptions(spec, changeSpec)}</div>
  )
}

OutlierDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired
}

