import React, { Component, PropTypes } from 'react'
import {
  SHOW_GRAPH, SHOW_STATISTICS, ADJUSTED, STATISTICS, OUTPUT_MAPPING
} from '../constants'

import Graph from './graph'
import Statistics from './statistics'

export default function Results({ results, show }) {
  const { type, what } = show
  
  return type === SHOW_GRAPH ?
    <Graph results={results} seriesToPlot={what} /> :
    <Statistics name={what} 
                label={OUTPUT_MAPPING[what].label} 
                entry={results.data[what]} />
}


Results.propTypes = {
  results: PropTypes.object.isRequired,
  show: PropTypes.object.isRequired
}