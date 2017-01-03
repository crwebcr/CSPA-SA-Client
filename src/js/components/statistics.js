import React, { PropTypes } from 'react'

function Likelihood({ label, entry }) {
  const { 
    neffectiveobs, np, logvalue, adjustedlogvalue, ssqerr, aic, aicc, bic
  } = entry
  
  return (
    <div className="statistics">
      <h2>{label}</h2>
      <div>Number of effective observations = {neffectiveobs}</div>
      <div>Number of estimated parameters = {np}</div><br/>
      <div>Logdivkelihood = {logvalue}</div>
      <div>Ajusted logdivkelihood = {adjustedlogvalue}</div><br/>
      <div>Standard error of the regression (ML estimator) = {ssqerr}</div>
      <div>AIC = {aic}</div>
      <div>AICC = {aicc}</div>
      <div>BIC (corrected for length) = {bic}</div>
    </div>
  )
}

export default function Statistics({ name, label, entry }) {
  return (
    <div className="statistics">
      {
        name === 'likelihood' ?
          <Likelihood entry={entry} /> :
          <span>not implemented yet</span>
      }  
    </div>
  )
}

Statistics.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  entry: PropTypes.object.isRequired
}