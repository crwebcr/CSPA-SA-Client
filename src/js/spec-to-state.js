
const defaultCalendar = {
  td: 'None',
  tdOption: 'workingDays',
  tdLeapYear: false,
  tdTestType: false,
  easter: 'None',
  easterPretest: false,
  easterDuration: 6
}

const defaultOutputFilter = {
  sa: true,
  likelihood: true,
  y: true,
  t: true,
  det: false,
  s: false,
  i: false,
  ee: false,
  tde: false,
  mhe: false,
  cal: false,
  reg: false,
  out: false
}

const defaultArima = {
  p: 0, d: 1, q: 1, bp: 0, bd: 1, bq: 1, mean: false
}

function processOutlier(outlierSpec, method) {
  const defaultOutlier = { AO: false, LS: false, TC: false }
  if (method === 'ts') {
    return outlierSpec && outlierSpec.types ?
      outlierSpec.types.reduce((_, name) => {
       _[name] = true
       return _
      }, {})
      : defaultOutlier
  }
  if (method === 'x13') {
   return outlierSpec && outlierSpec.type && outlierSpec.type.outlier ?
    outlierSpec.type.outlier.reduce((_, { type }) => {
      _[type] = true
      return _
    }, defaultOutlier) :
    defaultOutlier
  }
}
 
function processCalendar(calendarSpec, method) {
  if (method === 'ts') return processCalendarTS(calendarSpec)
  if (method === 'x13') return processCalendarX13(calendarSpec)
}

function processCalendarTS(calendarSpec) {
  let cs = Object.assign({}, defaultCalendar)
  let easter
  if (calendarSpec) {
    const { tradingDays, movingHolidays } = calendarSpec
    if (tradingDays) {
      const { testType, tdOption, lpOption } = tradingDays
      cs.td = 'Default'
      cs.tdOption = tdOption
      cs.tdLeapYear = lpOption === 'LeapYear' // `LeapYear` or `None`
      cs.tdTestType = testType === 'Separate_T'// `Separate_T` or `None`
    }
    if (movingHolidays && (easter = movingHolidays.easter)) {
      const { pretest, duration } = easter
      cs.easter = 'In use'
      cs.easterPretest = pretest
      cs.easterDuration = duration
    }
  }
  return cs
}

function processCalendarX13(calendarSpec) {
  let cs = Object.assign({}, defaultCalendar)
  let td, mh
  if (td = calendarSpec.tdVariables) {
    cs.td = 'Default'
    //observed values for `tdVariables.tdOption` in the prespecs loaded:
    //`Td`, 'Td1', 'Td1NoLpYear'
     cs.tdOption = td.tdoption.startsWith('Td1') ? 'WorkingDays' : 'TradingDays'
    //there is an `lpOption` entry, set to `None` for each prespec, which is
    //consistent if the information retrieved by destructuring the `tdOption`
    //entry: are we just lucky, or could we use this information instead ?
    cs.tdLeapYear = !td.tdoption.endsWith('NoLpYear')
    cs.tdTestType = td.aicTest === 'Remove' //`Remove` or `None`
  }
  if (calendarSpec.movingHolidaySpec && 
      (mh = calendarSpec.movingHolidaySpec.movingHolidaySpecType)) {
    const easterEntry = mh.filter(({ type }) => type === 'Easter').pop()
    if (easterEntry) {
      cs.easter = 'In use'
      cs.easterDuration = easterEntry.w
      cs.easterPretest = easterEntry.aicTest === 'Add' //`Add` or `None`
    }
  }
  return cs
}

function processArima(arimaSpec) {
  return arimaSpec ?
    { automatic: false, ...defaultArima, ...arimaSpec.spec } :
    //`autoModelSpec` should be present
    { automatic: true, ...defaultArima }
}

function processTransform(transformSpec) {
  return {
    //valid values for `transformSpec` look like
    //`{ level: {}}` or `{ auto: { fct: 0.95 }}`
    type: Object.keys(transformSpec).pop()
  }
}


export function specToState(method, spec) {
  /*
   decompositionSpec: not used
   autoModelSpec: not used, when `arimaSpec` is missing
   x11Spec: not used, for x13 only
  */
  
  return {
    method, 
    transformSpec: processTransform(spec.transformSpec),
    arimaSpec: processArima(spec.arimaSpec),
    outlierSpec: processOutlier(spec.outlierSpec, method),
    calendarSpec: processCalendar(spec.calendarSpec, method),
    outputFilter: defaultOutputFilter
  }
}
