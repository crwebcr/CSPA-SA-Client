import React, { Component, PropTypes } from 'react'
import Axes from './axes'
import { yearTicks, ticks, initGraphMultiple, buildPath } from '../graph'
import { SERIES_COLORS, ADJUSTED, EFFECTS } from '../constants'

const width = 450
const height = 280
const graphWidth = 390
const graphHeight = 240

export default function Graph({ results, seriesToPlot }) {
  const { byType, data } = results
  const allSeries = byType[ADJUSTED].concat(byType[EFFECTS])
                      .map(({ name }) => name)
  const config = initGraphMultiple(data, allSeries, graphWidth, graphHeight)

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g className="graph-area">
          <Axes config={config} />
          <g>
            {
              seriesToPlot.map(name => 
                <path
                  key={name}
                  className={SERIES_COLORS[name] || 'color-6'}
                  d={buildPath(data[name], config)}  />)}
          </g>
        </g>
      </svg>
      <div className="legend">
        { 
          seriesToPlot.map(name => {
            const cn = `item ${SERIES_COLORS[name] || 'color-6'}`
            return <div key={name} className={cn}>{name}</div>
          })
        }
      </div>
    </div>
  )
}


Graph.propTypes = {
  results: PropTypes.object.isRequired,
  seriesToPlot: PropTypes.array.isRequired
}