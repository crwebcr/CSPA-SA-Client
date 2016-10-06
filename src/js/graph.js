export function yearTicks(dateMin, dateMax, size) {
  const lastYear = dateMax.getFullYear()
  const firstYear = dateMin.getFullYear()
  const nbYears = lastYear - firstYear + 1
  //around ten ticks
  const interval = Math.floor(nbYears / 10)
  const unit = size / (dateMax - dateMin)
  const ticks = []
  let year = firstYear + 1
  let tick = {
    pos: (new Date(year, 0, 1) - dateMin) * unit,
    val: year
  }
  while (tick.pos < size) {
    ticks.push(tick)
    year += interval
    tick = {
      pos: (new Date(year, 0, 1) - dateMin) * unit,
      val: year
    }
  }
	return ticks
}

function calculateInterval(min, max, nb) {
	const rawInter = (max - min) / nb
	const tens = Math.pow(10, Math.floor(Math.log10(rawInter)))
	const unit = Math.log10(tens)
	return {
		interval: tens * Math.floor(rawInter / tens),
		nbDecimals: unit >= 0 ? 0 : -unit
	}
}

function reverse(ticks, size) {
	return ticks.map(({ pos, val }) => ({
		pos: size - pos,
		val: val
	}))
}

export function ticks(min, max, size, flip) {
  const range = max - min
  //around ten ticks
  const { interval, nbDecimals } = calculateInterval(min, max, 10)
  const unit = size / (max - min)
  const ticks = []
  let val = Math.ceil(min / interval) * interval
  let tick = {
    pos: (val - min) * unit,
    val: val.toFixed(nbDecimals)
  }
  while (tick.pos < size) {
    ticks.push(tick)
    val += interval
    tick = {
      pos: (val - min) * unit,
      val: val.toFixed(nbDecimals)
    }
  }
	return flip ? reverse(ticks, size) : ticks
}

//Will look for minimum and maximum values within all the series
export function initGraphMultiple(data, names, graphWidth, graphHeight) {
  //date are the same for all the series
  const firstSeries = data[names[0]]
  const dates = firstSeries.map(({ date }) => date)
  const dateMin = new Date(Math.min.apply(null, dates))
  const dateMax = new Date(Math.max.apply(null, dates))
  const xTicks = yearTicks(dateMin, dateMax, graphWidth)
  
  const values = [].concat.apply([], names.map(name => data[name]))
                  .map(({ value }) => value)
  
  const min = Math.min.apply(null, values)
  const max = Math.max.apply(null, values)
  const yTicks = ticks(min, max, graphHeight, true)
  
  return {
    dateMin, dateMax, min, max, xTicks, yTicks, graphWidth, graphHeight
  }
}

export function initGraph(data, graphWidth, graphHeight) {
  const dates = data.map(({ date }) => date)
  const values = data.map(({ value }) => value)
  const dateMin = new Date(Math.min.apply(null, dates))
  const dateMax = new Date(Math.max.apply(null, dates))
  const min = Math.min.apply(null, values)
  const max = Math.max.apply(null, values)
  const xTicks = yearTicks(dateMin, dateMax, graphWidth)
  const yTicks = ticks(min, max, graphHeight, true)
  
  return {
    dateMin, dateMax, min, max, xTicks, yTicks, graphWidth, graphHeight
  }
}

export function buildPath(serie, config) {
  const {
    dateMin, dateMax, min, max, xTicks, yTicks, graphWidth, graphHeight
  } = config
  
  const head = { x: 0, y: graphHeight - serie[0].value}
  const tail = serie.slice(1).map(({ date, value }) => ({
    x: (date - dateMin) / (dateMax - dateMin) * graphWidth,
    y: graphHeight - ((value - min) / (max - min) * graphHeight)
  }))
  return `M${head.x},${head.y}${tail.map(({ x, y}) => `L${x},${y}`).join('')}`
}