import React, { PropTypes } from 'react'
import { checkbox, buildCmpnts } from './utils/form'
import { OUTPUT_MAPPING as O} from '../constants'

const outputOptions = buildCmpnts([
  [checkbox, 'sa', O.sa.label],
  [checkbox, 'likelihood', O.likelihood.label],
  [checkbox, 't', O.t.label],
  [checkbox, 'det', O.det.label],
  [checkbox, 's', O.s.label],
  [checkbox, 'i', O.i.label],
  [checkbox, 'ee', O.ee.label],
  [checkbox, 'tde', O.tde.label],
  [checkbox, 'mhe', O.mhe.label],
  [checkbox, 'cal', O.cal.label],
  [checkbox, 'reg', O.reg.label],
  [checkbox, 'out', O.out.label]
])

export default function OutputDetails({ spec, changeSpec }) {
  return ( 
    <div>{outputOptions(spec, changeSpec)}</div>
  )
}

OutputDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired
}

