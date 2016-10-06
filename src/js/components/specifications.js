import React, { PropTypes } from 'react'
import InitialSpec from './initial-spec'
import SpecDetails from './spec-details'

export default function Specifications(
  { spec, changeSpec, method, changeMethod, prespec, changePrespec }) {
  return (
    <div>
      <h2>Specifications</h2>
      <InitialSpec
        method={method} changeMethod={changeMethod} 
        prespec={prespec} changePrespec={changePrespec} />
      <SpecDetails spec={spec} changeSpec={changeSpec} />
    </div>
  )
}

Specifications.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  changeMethod: PropTypes.func.isRequired,
  prespec: PropTypes.string.isRequired,
  changePrespec: PropTypes.func.isRequired
}
