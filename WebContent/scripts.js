/////////////////////////////
// PARAMETERS FOR THE PAGE //
/////////////////////////////

// Server address
var serverURL = 'http://localhost:8080/seasonal-adjustment-service';

// Default value
var activeMethod = 'ts'; 
var defaultResult = 1;
var defaultPrespec = 'RSA0';
var defaultSpec = 1;

// Graph object and margins
var graph = {margin : {top:10, right:10, bottom:30, left:50}};

// Mapping between HTML objects and JDemetra format in JSON  
var parametersType = {
	ts: {
		ts_transformSpec: {type: 'select', output: 'tag'}, 
		ts_autoModelSpec: {type: 'checkBoxExist', output:'branch', excluding:'ts_arimaSpec'},
		ts_arimaSpec_spec_p: {type: 'text', output: 'value'},	
		ts_arimaSpec_spec_d: {type: 'text', output: 'value'},	
		ts_arimaSpec_spec_q: {type: 'text', output: 'value'},	
		ts_arimaSpec_spec_bp: {type: 'text', output: 'value'},	
		ts_arimaSpec_spec_bd: {type: 'text', output: 'value'},	
		ts_arimaSpec_spec_bq: {type: 'text', output: 'value'},	
		ts_arimaSpec_spec_mean: {type: 'checkBox', value1:'true', value0:'false', output: 'value'},	
		ts_outlierSpec_types: {type:'checkBoxes', output: 'value'},
		ts_calendarSpec_tradingDays: {type:'selectExist', node:'ts_calendarSpec_tradingDays', output:'branch'},
		ts_calendarSpec_tradingDays_tdOption: {type:'select', output:'value'},
		ts_calendarSpec_tradingDays_lpOption: {type:'checkBox',value1:'LeapYear', value0:'None', output:'value'},
		ts_calendarSpec_tradingDays_testType: {type:'checkBox',value1:'Separate_T', value0:'None', output:'value'},
		ts_calendarSpec_movingHolidays_easter: {type:'selectExist', node:'ts_calendarSpec_movingHolidays', output:'branch'},
		ts_calendarSpec_movingHolidays_easter_duration: {type:'text', output:'value'},
		ts_calendarSpec_movingHolidays_easter_pretest: {type:'checkBox', value1:'true', value0:'false', output:'value'},
	}, 
	x13: {
		x13_transformSpec: {type: 'select', output:'tag'},
		x13_autoModelSpec: {type: 'checkBoxExist', output:'branch', excluding:'x13_arimaSpec'},
		x13_arimaSpec_spec_p: {type: 'text', output: 'value'},	
		x13_arimaSpec_spec_d: {type: 'text', output: 'value'},	
		x13_arimaSpec_spec_q: {type: 'text', output: 'value'},	
		x13_arimaSpec_spec_bp: {type: 'text', output: 'value'},	
		x13_arimaSpec_spec_bd: {type: 'text', output: 'value'},	
		x13_arimaSpec_spec_bq: {type: 'text', output: 'value'},	
		x13_arimaSpec_spec_mean: {type: 'checkBox', value1:'true', value0:'false', output:'value'},
		x13_outlierSpec_type_outlier_type: {type:'checkBoxes', output:'array'},
		x13_calendarSpec_tdVariables: {type:'selectExist', node:'x13_calendarSpec_tdVariables', output:'branch'},
		x13_calendarSpec_tdVariables_td: {type:'select', output:'value'},
		x13_calendarSpec_tdVariables_lp: {type:'checkBox', value1:'true', value0:'false', output:'value'},
		x13_calendarSpec_tdVariables_aicTest: {type:'checkBox',value1:'Remove', value0:'None', output:'value'},
		x13_calendarSpec_movingHolidaySpec_movingHolidaySpecType: {type:'selectExist', node:'x13_calendarSpec_movingHolidaySpec', output:'branch'}, 
		x13_calendarSpec_movingHolidaySpec_movingHolidaySpecType_w: {type:'text', output:'value', inArray:['Easter',0]},
		x13_calendarSpec_movingHolidaySpec_movingHolidaySpecType_aicTest: {type:'checkBox', value1:'Add', value0:'None', output:'value', inArray:['Easter',0]},
	} 
};

// Functions to split and code tdOption object in X13 specification
var transcoRead = {
	x13_calendarSpec_tdVariables_tdoption: function(elem,data) {
		data.x13_calendarSpec_tdVariables_td = (!(/^Td1/.test(elem))).toString();
		data.x13_calendarSpec_tdVariables_lp = (!(/NoLpYear$/.test(elem))).toString();
	}
};

var transcoWrite = {
	x13: function(data) {
		if (typeof data.x13.calendarSpec.tdVariables != 'undefined') {
			var td = (data.x13.calendarSpec.tdVariables.td == 'true'); var lp = (data.x13.calendarSpec.tdVariables.lp == 'true');
			if (td && lp) data.x13.calendarSpec.tdVariables.tdoption = 'Td';
			else if (td && !lp) data.x13.calendarSpec.tdVariables.tdoption = 'TdNoLpYear';
			else if (!td && lp) data.x13.calendarSpec.tdVariables.tdoption = 'Td1Coef';
			else if (!td && !lp) data.x13.calendarSpec.tdVariables.tdoption = 'Td1NoLpYear';
			delete data.x13.calendarSpec.tdVariables.td; delete data.x13.calendarSpec.tdVariables.lp;
		}
	}
};

// Range values for free parameters
var rangeValues = {
	ts: {p:[0,3], d:[0,2], q:[0,3], bp:[0,1], bd:[0,1], bq:[0,1], duration:[1,15]},
	x13: {p:[0,4], d:[0,2], q:[0,4], bp:[0,1], bd:[0,1], bq:[0,1]},	
};		

// Groups and menus of results
var resultsTable = {
	y :  { menu:"adjustedSeries", type:'y'},
	sa:  { menu:"adjustedSeries", type:'y'},  
	t:   { menu:"adjustedSeries", type:'y'}, 
	det: { menu:"adjustedSeries", type:'c'},
	s:   { menu:"adjustedSeries", type:'c'},
	i:   { menu:"adjustedSeries", type:'c'},
	ee:  { menu:"effectsSeries", type:'r'}, 
	tde: { menu:"effectsSeries", type:'r'}, 
	mhe: { menu:"effectsSeries", type:'r'}, 
	cal: { menu:"effectsSeries", type:'r'}, 
	reg: { menu:"effectsSeries", type:'r'}, 
	out: { menu:"effectsSeries", type:'r'},	
	likelihood: {menu:"statistics", type:'s'},
};

// Plot colors
var colors = [ '#4B78A5', '#5A9857', '#CC625B', '#FF00FF', '#FBC457', '#BDBBD1'];

////////////////////
// INITIALIZATION //
////////////////////

// Initialize global variables
var activePrespec,activeSpec,newMethod,activeResult; // selected menus
var seriesData = [];                                 // data of original series 
var seriesName = '';                                 // name of original series 
var parameters = {};                                 // parameters for seasonal adjustment
var parametersPrespec = {};                          // parameters of all prespecifications
var results = {};                                    // container for results

loadPrespec();

/**
 * Get content of all prespecifications via web service calls
 */
function loadPrespec() {
	
	// Get methods and prespecification from page
	var methods = []; var prespecs = []; 
	$('#methodSelect option').each(function() {methods.push(this.value);});
	$('#prespecSelect option').each(function() {prespecs.push(this.value);});
	
	// Get prespecification from web service calls
	var requests=[]; 
	for (var i=0; i<methods.length; i++) for (var j=0; j<prespecs.length; j++) {
		requests.push($.ajax({
			type: "GET",
			url: serverURL+'/'+methods[i]+'/'+prespecs[j],
			dataType: "json",
			prespecData: {method:methods[i], prespec:prespecs[j]},
			success:function(data) {readParameters(data,this.prespecData.method,this.prespecData.prespec);}
		}));
	}
	
	// Wait for all request to finish, then initialize page or display error message
	$.when.apply(undefined, requests).then(init,function() {alert('Connexion error : cannot get prespecifications');});
} 

/**
 * Initialize page
 */
function init() {
	
	// Select method, prespecification, parameter menu 
	initMethod(activeMethod);
	initPrespec(defaultPrespec); setParameters(activeMethod,defaultPrespec);
	spec(defaultSpec);
	
	// Initialize graph
	initGraph();	
	
	// Display page
	$('#mask').hide(); $('#frame').show();
}

/////////////////////
// PAGE MANAGEMENT //
/////////////////////

// METHOD
/**
 * Set method 
 * @param method : method name
 */
function initMethod(method) {
	$('#methodSelect').children('[value$="'+method+'"]').prop('selected',true);
	activeMethod = newMethod = method;
}

/**
 * Change method
 */
function changeMethod() {
	newMethod = $('#methodSelect').find(":selected").val();
	initPrespec(defaultPrespec); setParameters(newMethod,activePrespec);
	spec(defaultSpec); activeMethod = newMethod;
}

// PRESPECIFICATION
/**
 * Set prespecification 
 * @param preSpec : prespecification name
 */
function initPrespec(preSpec) {
	$('#prespecSelect').children('[value$="'+preSpec+'"]').prop('selected',true);
	activePrespec = preSpec;
}

/**
 * Change prespecification
 */
function changePrespec() {
	activePrespec = $('#prespecSelect').find(":selected").val();
	setParameters(activeMethod,activePrespec);
	spec(defaultSpec);
}

// PARAMETERS AND RESUTS MENUS
/**
 * Select new parameters menu
 * @param newSpec : parameters menu number
 */
function spec(newSpec) {
    jQuery('#spec'+activeSpec).attr('class','tabPassive');
    jQuery('#spec'+newSpec).attr('class','tabActive');
    jQuery('#'+activeMethod+activeSpec).hide();
	jQuery('#'+newMethod+newSpec).show();	
    activeSpec=newSpec;   
}

/**
 * Select new results menu
 * @param newResult : results menu number
 */
function result(newResult) {
    jQuery('#result'+activeResult).attr('class','tabPassive');
    jQuery('#result'+newResult).attr('class','tabActive');
    jQuery('#res'+activeResult).hide();
	jQuery('#res'+newResult).show();	
    activeResult=newResult;   
}

// DISPLAY EXTRA MENUS
/**
 * Change AutoModel option
 * @param type : method name
 */
function changeAutoModel(type) {
	if ($('#'+type+'_autoModelSpec').prop('checked')) $('#'+type+'arima').hide();
	else $('#'+type+'arima').show();
}

/**
 * Change Calendar option
 * @param type : method name
 */
function changeCalendarOption(type) {
	var element = (type=='ts')?'ts_calendarSpec_tradingDays':'x13_calendarSpec_tdVariables';
	if ($('#'+element).find(":selected").val() != 'none') $('#'+type+'caldetail').show();
	else $('#'+type+'caldetail').hide();
}

/**
 * Change Easter option
 * @param type : method name
 */
function changeEasterOption(type) {
	var element = (type=='ts')?'ts_calendarSpec_movingHolidays_easter':'x13_calendarSpec_movingHolidaySpec_movingHolidaySpecType';
	if ($('#'+element).find(":selected").val() != 'none') $('#'+type+'eastdetail').show();
	else $('#'+type+'eastdetail').hide();
}

// CHECK RANGE OF VALUES IN INPUT TEXT
/**
 * Save the current value
 * @param elem : input object
 */
function saveValue(elem) {elem.defaultValue = elem.value;}

/**
 * Test if value belongs to range
 * @param elem : input object
 * @param method : method name 
 * @param type : parameter name
 */
function testRange(elem,method,type) {
	var range = rangeValues[method][type]; if (!range) return; 
	var value = elem.value; if (value>=range[0] && value<=range[1]) return; 
	alert('value must be between '+range[0]+' and '+range[1]); 
	elem.value=elem.defaultValue; window.getSelection().removeAllRanges();
}

/**
 * Check checkbox by click on label
 * @param object : td object storing the label
 */
function check(object) {
	var input = $(object).parent().find('input'); input.prop('checked',(input.is(':checked'))?false:'checked');
}

///////////////////////////
// PARAMETERS MANAGEMENT //
///////////////////////////

/**
 * Read parameters from JSON object returned by JDemetra and store it in parameters
 * @param data : JSON object
 * @param method : method name
 * @param prespec : prespecification name
 */
function readParameters(data, method, prespec) {
	parameters={}; readObject(data,method,parameters);
	parametersPrespec[method+'_'+prespec] = parameters;
}

/**
 * Store JSON object in a simple hash table 
 * @param root = current JSON object
 * @param prefix0 = prefix related to root in the hash table
 * @param data = hash table
 */
function readObject(root,prefix0,data) {
	
	// Add item with name "name" and value "value" in the hash table, if multiple entries, store in an array
	function add(name, value) {
		if (typeof data[name] != 'undefined') {if (data[name].constructor != Array) data[name] = [data[name]]; data[name].push(value);}
		else data[name] = value; 
	};
	
	// Loop on properties of the JSON object
	var prefix1, key2=''; for (var key in root) {
		prefix1 = prefix0 + '_' + key; // new prefix
		if (root[key].constructor == Array) for (var i in root[key]) readObject(root[key][i],prefix1,data);
		else if (typeof root[key] == 'object') {key2=key; readObject(root[key],prefix1,data);}
		else if (typeof root[key] == 'boolean') add(prefix1,root[key].toString());
		else if (transcoRead[prefix1]) transcoRead[prefix1](root[key],data);        // split combined objects of JDemetra 
		else add(prefix1,root[key]);
	}
	
	// Store also hierarchical structure
	add(prefix0,key2);
}

/**
 * Map parameters in hash table to HTML object in the page
 * @param method = method name
 * @param prespec = prespecification name
 */
function setParameters(method,prespec) {
	
	// Get stored parameters of the prespecification 
	var parameters = parametersPrespec[method+'_'+prespec];
	
	// Loop on the mapping of form inputs related to the method "method"
	var empty, elements; for (var key in parametersType[method]) {
		
		empty = (typeof(parameters[key]) == 'undefined');
		
		switch(parametersType[method][key].type) {
		
			case 'text' : if (!empty) jQuery('#'+key).val(parameters[key]); break;
			case 'select' : if (!empty) jQuery('#'+key).children('[value$="'+parameters[key]+'"]').prop('selected',true); break;
			case 'selectExist' : jQuery('#'+key).children('[value$="'+((empty)?'none':'exist')+'"]').prop('selected',true); break;
			case 'checkBox' : jQuery('#'+key).prop('checked', parametersType[method][key].value1 == parameters[key]); break;
			case 'checkBoxExist' : jQuery('#'+key).prop('checked',!empty); break;
			case 'checkBoxes' : jQuery('#'+key+' input').prop('checked',false); if (!empty) { 
				elements = (parameters[key].constructor == Array) ? parameters[key] : parameters[key].split(' '); 
				for (var i in elements) jQuery('#'+key).find('[value="'+elements[i]+'"]').prop('checked',true);	break;
			}
		}
	}
	
	// Page management
	changeCalendarOption(method); changeEasterOption(method); changeAutoModel(method); 
}

/**
 * Map content of HTML object related to the definition of parameters to JSON object in JDemetra format
 * @param method = method name
 * @param json = JSON object in which store the elements 
 */
function jsonParameters(method,json) {

	// Get node in JSON object from key in the hash table
	// key = node.last, node = parent.previous
	function getNode(key) {
		var elements = key.split('_'); var last = elements.pop(); var element,previous,parent,node = json; parent=element=previous=null;
		for (var i in elements) {previous=element=elements[i]; parent=node; if (typeof node[element] == 'undefined') node[element]={}; node=node[element];}
		return {node:node, last:last, parent:parent, previous:previous};
	}

	// Add set property related to "key" in JSON to value "value"
	// if inArray is set, store value in an array. inArray = [array name, property name]
	function add(key,value,inArray) {
		r=getNode(key); if (typeof inArray == 'undefined') r.node[r.last]=value;
		else { 
			if (r.parent[r.previous].constructor != Array) r.parent[r.previous]=[]; 
			if (typeof r.parent[r.previous][inArray[1]] == 'undefined') r.parent[r.previous][inArray[1]] = {type:inArray[0]};
			r.parent[r.previous][inArray[1]][r.last]=value; 
		}
	}
	
	// Loop on the mapping of form inputs related to the method "method"
	var element, array, inArray, toDelete = []; for (var key in parametersType[method]) {
		
		element = parametersType[method][key]; inArray = element.inArray;
		
		switch(element.type) {
		
			case 'text': 	if (element.output=='value') add(key,jQuery('#'+key).val(),inArray); 
							else if (element.output=='tag') add(key+'_'+jQuery('#'+key).val(),{},inArray); 
							break;
			case 'select':	if (element.output=='value') add(key,jQuery('#'+key).find(":selected").val(),inArray);
							else if (element.output=='tag') add(key+'_'+jQuery('#'+key).find(":selected").val(),{},inArray); 
							break;
			case 'selectExist': if (element.output=='branch') 
									if (jQuery('#'+key).find(":selected").val()=='none') toDelete.push(getNode(element.node)); 
								break;
			case 'checkBox': if (element.output=='value') add(key,jQuery('#'+key).prop('checked')?element.value1:element.value0,inArray); 
							 break;
			case 'checkBoxExist': 	if (element.output=='branch') if (jQuery('#'+key).prop('checked')) {
										add(key,{},inArray); if (element.excluding) toDelete.push(getNode(element.excluding)); 
									} 
									break;
			case 'checkBoxes' : array=jQuery('#'+key).find(':checked').map(function () {return this.value;}).get();
								if (element.output=='value') add(key,array.join(' '),inArray); 
								else if (element.output=='array') for (var i in array) add(key,array[i],['',i]);
								break;
		}
	}
	
	// Exclusion management => delete properties stored in "toDelete"
	for (var key in toDelete) delete toDelete[key].node[toDelete[key].last];
	
	// Some object need to be combined in JDemetra format
	if (transcoWrite[method]) transcoWrite[method](json);
}

/**
 *	Map content of HTML objects related to output selection to string
 */
function jsonOutputs(method) {
	
	return 
	
}

///////////////////////
// SERIES MANAGEMENT //
///////////////////////

/**
 * Open file selector to select series file
 */
function selectSeries() {
	$('#selectSeries').click();
}

/**
 * Load the selected series
 */
function loadSeries() {
	
	// Check if a file is selected
	var files = $('#selectSeries').prop('files');
    if (!files.length || !files[0]) return;
    
    // Reset series and page Management
    seriesData = [];
    $('#loadName').hide(); $('#adjust').hide(); $('#results').hide(); newGraph(); $('#loadSpinner').show();
    
    // Define and launch series reader
    var reader = new FileReader(); reader.onload = function(event) {
    	
        if (event.target.readyState == FileReader.DONE) {
        	
        	// Read series and get file name
        	seriesData = readCsv(event.target.result); seriesName = files[0].name;     
        	
        	// Page management
        	$('#loadSpinner').hide();                  
        	if (seriesData && checkSeries(seriesData)) {
        		$('#loadName').text(seriesName).show(); $('#adjust').show(); showSeries();
        	}	
        }
     };
     reader.readAsText(files[0]);
}

/**
 * Read time series in csv format
 * @param file : csv context as a string
 * @returns array {value, data}
 */
function readCsv(file) {
	
	// Get lines, check if file is not empty
	var lines = file.split(/\r?\n/);
	if (lines.length==0) {alert("Empty file or cannot read file"); return null;}	
	
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
	if (lines.length==0) {alert("Empty file or cannot read file"); return null;}
  
	// Read all the lines, transform values to float, dates to javascript dates
	var elements, value, date; var data = [];
	while (line) {
		elements = line.split(sep);
		value = parseFloat(elements[ivalue].replace(",","."));
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

/**
 * Transform series in array {value, date} format to series in JDemetra format
 * @param array {value, date} 
 * @returns JSON object related to JDemetra format
 */
function jsonSeries(series) {
  
	// Get first date and frequency
	var first = series[0].date; var duration = 12/series.frequency;
	
	// Return JSON object related to JDemetra format
	return {
		freq : series.frequency, 
		firstYear : first.getFullYear(), 
		firstPeriod : Math.round((1+first.getMonth())/duration),
		data : $.map(series,function(d) {return d.value;}).join(' ')
	};
}

/////////////////////////
// SEASONAL ADJUSTMENT //
/////////////////////////

/**
 * Web service call to seasonal adjust
 */
function adjust() {
	
	// Build request
	var request={}; 
	var specification={}; jsonParameters(activeMethod,specification); request.Specification = specification[activeMethod];
	request.Series = jsonSeries(seriesData);
	request.OutputFilter = jQuery('#'+activeMethod+'_OutputFilter').find(':checked').map(function () {
								var output = this.value; 
								if (resultsTable[output].type=='s') output += '*';
								return output;
							}).get().join(' ');
	
	// Page action
	$('#results').hide(); newGraph(); showSeries(); $('#adjustSpinner').show();
	
	// Web service call
	$.ajax({
		type:"POST",
		url:serverURL+'/'+activeMethod,
		data:JSON.stringify(request),
		dataType:"json",
		contentType:"application/json; charset=utf-8",
		activeMethod:activeMethod,
		success:readResults,
		error:displayError,
		complete:function(){$('#adjustSpinner').hide();}
	});
}

/**
 * Display error message according to the returned HTML error code
 * @param xhr = XHR object
 */
function displayError(xhr) {
	var message = xhr.responseText; if (message) message = " : "+message;
	switch(xhr.status) {
		case 0: message="Cannot access server"; break;
		case 400: message="Error in request"+message; break;
		case 404: message="Cannot access service"; break;
		case 500: message="Error while seasonal adjustment"+message; break;
		default: message='Error'+message;
	}
	alert(message);
}

/**
 * Store results of analysis in the format needed to graph series
 * Add related labels in result menus
 * @param data
 */
function readResults(data) {
	
	// Clean results object and result menus in the page
	results = {}; $('#results').find('[class="col1"]').remove(); $('#results').find('[class="col2"]').remove(); 
	
	// Get label of the series from the page
	var items = data.item; var col = {}; var cols = ['col1','col2']; var item, name, table, res;
	
	for (var i in items) {
	
		item = items[i].name; if (resultsTable[item]) {
			
			name = jQuery('#'+this.activeMethod+'_OutputFilter').find('[value="'+item+'"]').parent().siblings().text();
		
			// Case of a result series
			if (items[i].tsdata) results[item] = {name: name, series: expandSeries(items[i].tsdata)}; 
			
			// Case of statistics
			else if (resultsTable[item].type=='s') {
				table = items[i].subset.item; res={name:name}; for (var j in table) {
					if (table[j].double) res[table[j].name] = table[j].double;
					else if (table[j].integer) res[table[j].name] = table[j].integer; 
				}
				results[item] = res;
			}
			
			// Add label in result menus
			table = resultsTable[item].menu; if (table) {
				if (typeof col[table] == 'undefined') col[table]=0; else col[table] = 1-col[table];
				$('#'+table).last().append('<tr class="'+cols[col[table]]+'" onclick="javascript:showResult(\''+item+'\');"><td>'+name+'</td></tr>');
			}
		}
	}
	
	// Display result menus
	if (items.length>0) {$('#results').show(); result(defaultResult);}
}

/**
 * Display result series
 * @param item = short name of result
 */
function showResult(item) {
	if (resultsTable[item].type=='s') showStatistics(item);
	else showCurve(item);
}

/**
 * Display statistics result
 */
function showStatistics(item) {
	$('#'+item).find('span').each(function() { this.innerHTML = results[item][this.id.replace(/^.*_/,'')]; });
	newGraph(); $('#graph').hide(); $('#'+item).show(); 
}

//////////////////////
// GRAPH MANAGEMENT //
//////////////////////

/**
 *  Clean button
 */
function clean() {newGraph(); $('#clean').hide();}

/**
 *  Display any curve 
 *  @param item = short name of the curve
 *  @param data = curve points
 */
function showCurve(item) {	
	$('.statistics').hide(); $('#graph').show(); if (typeof graph.curves[item] != 'undefined') return;
	var type = resultsTable[item].type; if (type != graph.type) { newGraph(); graph.type=type; }
	graph.ncurves++; graph.curves[item]=''; plotGraph(); 
}

/**
 *  Display the original series
 */
function showSeries() {showCurve('y');}

/**
 * Initialize the graph dimension
 */
function initGraph() {
	
	graph.width = $('#graph').width() - graph.margin.left - graph.margin.right;
	graph.height = $('#graph').height() - graph.margin.top - graph.margin.bottom - 10;

	graph.x = d3.time.scale().range([0, graph.width]);
	graph.y = d3.scale.linear().range([graph.height, 0]);
}

/**
 *  Reset graph
 */
function newGraph() {
	graph.curves = {}; graph.ncurves = 0; graph.type = '';
	graph.rangeX = []; graph.rangeY = [];
	d3.select("svg").remove();
}
 
/**
 * Add plot to the graph, update the scale and the legend
 */
function plotGraph() {

	// series to plot
	var name, data, names = []; for (var i in graph.curves) names.push(i);

	// Delete graph zone
	d3.select("svg").remove();
	
	// Add graph zone
	graph.svg = d3.select("#graph")
    			.append("svg").attr("width", $('#graph').width()).attr("height", $('#graph').height())
    			.append("g").attr("transform","translate(" + graph.margin.left + "," + graph.margin.top + ")");
	
	// Define axis 
	graph.line = d3.svg.line()
				.x(function(d) {return graph.x(d.date);})
				.y(function(d) {return graph.y(d.value);});

	graph.xAxis = d3.svg.axis().scale(graph.x).orient("bottom");
	graph.yAxis = d3.svg.axis().scale(graph.y).orient("left");	
	
	// Update range of axis
	name = names[names.length-1]; data = (name=='y') ? seriesData : results[name].series;
	graph.rangeX = d3.extent(graph.rangeX.concat(d3.extent(data, function(d) { return d.date; })));
	graph.rangeY = d3.extent(graph.rangeY.concat(d3.extent(data, function(d) { return d.value; })));
	
	graph.x.domain(graph.rangeX);
	graph.y.domain(graph.rangeY);
	
	// Add axis
	graph.svg.append("g")
	         .attr("class","x axis")
	         .attr("transform", "translate(0," + graph.height + ")")
	         .call(graph.xAxis);
	
    graph.svg.append("g")
	         .attr("class","y axis")
	         .call(graph.yAxis);
	
    // Add plots
    for (var j in names) {
    	name = names[j]; data = (name=='y') ? seriesData : results[name].series;
    	graph.svg.append("path")
    		.datum(data)
    		.attr("class", "line")
    		.style("stroke", colors[j])
    		.attr("d", graph.line);	
    }
    
	// Define legend zone
	var legend = graph.svg.append("g")
	  			    	  .attr("class", "legend")
	  			          .attr("x",25)
	  			          .attr("y",graph.height + 25)
	  			          .attr("height", 50)
	  			          .attr("width", 100);

	// Add series name in the legend
	legend.selectAll('g').data(names).enter().append('g')
    	  .each(function(d,i) {
    		  var g = d3.select(this);
    		  
    		  g.append("rect")
    		   .attr("x", 25 + 60*i)
               .attr("y", graph.height + 25)
               .attr("width", 10)
               .attr("height", 10)
               .style("fill", colors[i]);
      
    		  g.append("text")
    		  	.attr("x", 40 + 60*i)
    		  	.attr("y", graph.height + 35)
    		  	.attr("height", 30)
    		  	.attr("width", 40)
    		  	.style("fill", colors[i])
    		  	.text(d);
    });
	
	// Show button clean
	if (names.length==1) $('#clean').show();
}
