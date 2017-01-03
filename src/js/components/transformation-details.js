import React, { PropTypes } from 'react'
import { select, buildCmpnts } from './utils/form'

const transformationOptions = buildCmpnts([
  [select, 'type', 'Function',
    [{
      value: 'auto', label: 'Auto'
    }, {
      value: 'log', label: 'Log'
    }, {
      value: 'level', label: 'None'
    }]]
])

export default function TransformationDetails({ spec, changeSpec }) {
  const els = transformationOptions(spec, changeSpec)
  return ( 
    <div>
      {els}
    </div>
  )
}

TransformationDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired
}

