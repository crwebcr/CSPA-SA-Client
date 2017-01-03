import { OUTPUT_MAPPING } from './constants' 
import { ADJUSTED, EFFECTS, STATISTICS } from './constants'

export const defaultByType =   {
	[ADJUSTED]: [{
		label: OUTPUT_MAPPING.y,
		name: 'y'
	}],
	[EFFECTS]: [],
	[STATISTICS]: []
}

/**
 * Store results of analysis in the format needed to graph series
 * Add related labels in result menus
 * @param data
 */
export function readResults(data) {
	return data.item.reduce((results, item) => {
		const { name } = item
		const { data, byType } = results
		const outputEntry = OUTPUT_MAPPING[item.name]
		if (!outputEntry) return results // not interested by this result item
		const label = outputEntry.label
		const { menu } = outputEntry
		switch (menu) {
			case (ADJUSTED):
			case (EFFECTS):
				byType[menu].push({
					name,
					label
				})
				data[name] = expandSeries(item.tsdata)
				break
			case (STATISTICS):
				byType[STATISTICS].push({
					name,
					label
				}) 
				data[name] = processStatistics(item.subset.item)
		}
		return results
	}, {
		data: {},
		byType: {
			[ADJUSTED]: [],
			[STATISTICS]: [],
			[EFFECTS]: []
		}
	})
}

function processStatistics(statistics) {
	return statistics.reduce((_, stat) => {
		_[stat.name] = stat.hasOwnProperty('integer') ? stat.integer : stat.double
		return _
	}, {})
}


/**
 * Transform Series in JDemetra format to array {value, date}
 * @param JSON object related to JDemetra format
 * @returns array {value, date}
 */
function expandSeries(tsdata) {

	// Get values of the series
	var values = tsdata.data.split(' ');

	// Get duration, first month and first year
	var duration = 12 / tsdata.freq;
	var month = tsdata.firstPeriod*duration-1;
	var year = tsdata.firstYear;

	// Transform values in float and compute dates from first date and frequency
	var series=[]; for (var i=0; i<values.length; i++) {
		series[i] = {value:parseFloat(values[i]), date:new Date(year, month + i*duration, 1, 12, 0, 0, 0)};
	}

	return series;
}