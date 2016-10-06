export const sampleSpec = {
  ini: {
    method: 'tramoseatsSpecType',
    defaultSpec: 'RS0'
  },
  transformSpec: {
    type: 'Auto' // or `Log` and `None`
  },
  // arimaSpec not present if `automatic` has been checkrf in the model pane
  arimaSpec: {
    automatic: true,
    mean: false,
    p: 0,
    d: 1,
    q: 1,
    bp: 0,
    bd: 1,
    bq: 1
  },
  //`calendarSpec` can be missing in the specification sent to the server if
  //there is no relevant information. The prespeicfication has two entries, one
  //related to the trading days, one to easter (moving holidays). We chose to
  //represent all these options with a single object to make state manipulation
  //easier in the component. When we switch trading days from `Default` to
  //`None` or when we uncheck `Easter`, the value previously filled in will be
  //kept in memory. These values will be restored if we switch back.
  calendarSpec: {
    //Information for the `tradingDays` entry
    td: 'Default', //or `None`
    tdOption: 'tradingDays', //or `workingDays`
    tdLeapYear: false, // will go to lpOption
    tdTestType: false, // will go to test type, 'None' or 'Separatec_T'
    //Information for easter entry
    easter: 'None', // or `In use`
    easterPretest: false,
    easterDuration: 6
  },
  outlierFilter: {
    AO: false,
    LS: false,
    TC: false
  },
  outputFilter: {
    sa: false,
    likelihood: false,
    t: false,
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
}


export function stateToSpec(state) {
  
}