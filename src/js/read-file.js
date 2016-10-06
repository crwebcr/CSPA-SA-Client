/**
 * Load the selected series
 */
export function loadSeries(file, cb) {
  // Define and launch series reader
  var reader = new FileReader()
  reader.onload = function(e) {
    if (e.target.readyState === FileReader.DONE) {
    	// Read series and get file name
    	const seriesData = readCsv(e.target.result)
    	if (seriesData && checkSeries(seriesData)) cb(seriesData)
    }
  }
  reader.readAsText(file);
}

/**
 * Read time series in csv format
 * @param file : csv context as a string
 * @returns array {value, data}
 */
function readCsv(file) {

	// Get lines, check if file is not empty
	var lines = file.split(/\r?\n/);
	if (lines.length==0) alert('Empty file or cannot read file')

	// Regexp patterns of csv lines
	var pattern1 = /^\d+(?:[\.,]\d+)?([,;])\d{2}\D\d{2}\D\d{4}$/;
	var pattern2 = /^\d{2}\D\d{2}\D\d{4}([,;])\d+(?:[\.,]\d+)?$/;

	// Read lines until identifying csv format : columns order and seperator
	var ivalue = 0; var sep = ''; var line=lines.shift();
	while (line) {
		if (pattern1.test(line)) {ivalue=0; var match = pattern1.exec(line); sep = match[1]; break;}
		if (pattern2.test(line)) {ivalue=1; var match = pattern2.exec(line); sep = match[1]; break;}
		line = lines.shift();
	}
	if (lines.length==0) alert('Empty file or cannot read file')

	// Read all the lines, transform values to float, dates to javascript dates
	var elements, value, date; var data = [];
	while (line) {
		elements = line.split(sep);
		value = parseFloat(elements[ivalue].replace(',', '.'))
		elements = elements[1-ivalue].split(/\D/);
		date = new Date(parseInt(elements[2]),parseInt(elements[1])-1,parseInt(elements[0]),12,0,0,0);
		if (isFinite(value) && isFinite(date)) {data.push({value:value, date:date});}
		line = lines.shift();
	}

	return data;
}


/**
 * Guess frequency of the series and check if no point is missing
 * @param series as an array {value, date}
 * @returns series is ok
 */
function checkSeries(series) {

	// Enough points to guess the frequency ?
	if (series.length < 2) {alert('Not enough points in series'); return false;}

	// Sort series according to date
	series.sort(function(a, b){return a.date.getTime()-b.date.getTime();});

	// Guess the frequency and check if it divides 12
	var d1 = series[0].date.getTime(); var d2 = series[1].date.getTime();

	var duration = Math.floor((d2-d1)/2419200000); if (duration==0) {
		alert('Series frequency must be >= 1 month'); return false;
	}

	series.frequency = 12/duration; if (Math.floor(series.frequency)!=series.frequency) {
		alert('Series frequency must divide 12 months'); return false;
	}

	// Check if there is no missing data
	for (var i=2; i<series.length; i++) {
		d1=d2; d2=series[i].date.getTime(); if (Math.floor((d2-d1)/2419200000) != duration) {
			alert('Missing point near date '+series[i].date); return false;
		}
	}

	return true;
}


/**
 * Transform series in array {value, date} format to series in JDemetra format
 * @param array {value, date}
 * @returns JSON object related to JDemetra format
 */
export function jsonSeries(series) {

	// Get first date and frequency
	var first = series[0].date; var duration = 12/series.frequency;

	// Return JSON object related to JDemetra format
	return {
		freq : series.frequency,
		firstYear : first.getFullYear(),
		firstPeriod : Math.round((1+first.getMonth())/duration),
		data : series.map(d => d.value).join(' ')
	};
}