
/*
  Includes outputFiler (not really part of the spec, but display in the same
  way that specifications details in the ui.
*/
export function stateToSpec(state) {
  const spec = {}
  
  const { method, arimaSpec } = state
  if (arimaSpec.automatic === true) spec.autoModelSpec = {}
  else {
    const { p, d, q, bp, bd, bq, mean } = arimaSpec
    spec.arimaSpec = { 
      spec: {
        p, d, q, bp, bd, bq, mean
      }
    }
  }
  const outlierSpec = buildOutlier(state.outlierSpec, state.method)
  //if there is no outlier option checked and if the method is X13, we do not
  //add an entry for `outlierSpec`
  if (outlierSpec) spec.outlierSpec = outlierSpec
  
  //calendarSpec might be an empty object
  spec.calendarSpec = buildCalendar(state.calendarSpec)
  
  spec.transformSpec = {
    [state.transformSpec.type]: {}
  }
  const outputFilter = buildOuput(state.outputFilter)
  
  
  return {
    OutputFilter: outputFilter,
    Specification: spec
  }
}

function buildOutlier(outlierSpec, method) {
  //keep only checked options
  const checked = Object.keys(outlierSpec).reduce((_, option) => {
      if (outlierSpec[option]) _.push(option)
      return _
    }, [])
  if (method === 'tramoseatsSpecType') return {
    types: checked.join(' ')
  }
  else if (method === 'x13SpecType') {
    //no return value if no option is checked
    if (checked.length > 0) return {
      type: {
        outlier: checked.map(option => ({ type: option }))
      }
    } 
  }
}

function buildOuput(outputFilter) {
  const parameters = [
    'sa', 'likelihood', 'y', 't', 'det', 's', 'i', 'ee',
    'tde', 'mhe', 'cal', 'reg', 'out'
  ]
  return parameters
   .filter(val => outputFilter[val])
   .join(' ')
   .replace('likelihood', 'likelihood*')
}

function buildCalendar(calendarSpec, method) {
  const { 
    td, tdOption, tdLeapYear, tdTestType,
    easter, easterPretest, easterDuration
  } = calendarSpec
  const calendar = {}
  if (method === 'tramoseatsSpecType') {
    if (td === 'Default') {
      calendar.tradingDays = {
        tdOption: tdOption === 'WorkingDays' ? 'WorkingDays' : 'TradingDays',
        lpOption: tdLeapYear ? 'LeapYear' : 'None',
        testType: tdTestType ? 'Separate_T' : 'None'
      }
    }
    if (easter === 'In use') {
      calendar.movingHolidays = {
        easter: {
          duration: easterDuration,
          pretest: easterPretest
        }
      }
    }
  }
  if (method === 'x13SpecType') {
    if (td === 'Default') calendar.tdVariables = {
      aicTest: tdTestType ? 'Remove' : 'None',
      tdOption: 
        tdOption === 'TradingDays' && tdLeapYear ? 'Td' :
        tdOption === 'TradingDays' && !tdLeapYear ? 'TdNoLpYear' :
        tdOption === 'WorkingDays' && tdLeapYear ? 'Td1Coef' :
        tdOption === 'WorkingDays' && !tdLeapYear ? 'Td1NoLpYear' : 'error'
    }
    if (easter === 'In use') {
      calendar.movingHolidaySpec = {
        movingHolidaySpecType: [{ 
          type: 'Easter',
          w: easterDuration,
          aicTest: easterPretest ? 'Add' : 'None'
        }]
      }
    }
  }
  return calendar
}