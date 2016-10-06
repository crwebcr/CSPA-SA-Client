import React, { PropTypes } from 'react'
import { checkbox, numberInput, buildNamedCmpnts } from './utils/form'

const modelOptions = buildNamedCmpnts([
  [checkbox, 'automatic', 'Automatic'],
  [numberInput, 'p', 'p', 0, 5],
  [numberInput, 'd', 'd', 0, 5],
  [numberInput, 'q', 'q', 0, 5],
  [numberInput, 'bp', 'bp', 0, 5],
  [numberInput, 'bd', 'bd', 0, 5],
  [numberInput, 'bq', 'bq', 0, 5],
  [checkbox, 'mean', 'Mean']
])

export default function ModelDetails({ spec, changeSpec }) {
  const { automatic } = spec
  const els = modelOptions(spec, changeSpec)
  return ( 
    <div className="cols">
      <div>{els.automatic}</div>
      <div>
        {!automatic && [els.p, els.d, els.q]}
      </div>
      <div>
        {!automatic && [els.bp, els.bd, els.bq]}
      </div>
      <div>
        {!automatic && els.mean}
      </div>
    </div>
  )
}

ModelDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired
}

