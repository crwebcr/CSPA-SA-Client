import React from 'react'

export default function Axes({ config }) {
  const {
    xTicks, yTicks, graphWidth, graphHeight
  } = config
  
  return (
    <g>
      {/* axes */}
      {/* x axis */} 
      <g style={{ transform: `translateY(${graphHeight}px)`}}>
        <line x2={graphWidth} />
        { 
          xTicks.map(({ pos, val}, i) => 
            <g key={i} style={{ transform: `translateX(${pos}px)`}}>
              <line y2={5} />
              <text y={16}>{val}</text>
            </g>
          )
        }
      </g>
      {/* y axis */} 
      <g> 
        <line y2={graphHeight}/>
        { 
          yTicks.map(({ pos, val}, i) => 
            <g key={i} style={{ transform: `translateY(${pos}px)`}}>
              <line x2={-5} />
              <text x={-16} y={3}>{val}</text>
            </g>
          )
        }
      </g>      
    </g>
  )
}