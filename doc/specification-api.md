## Specification

The default specifications hold more information that what is handled by the ui.
The information not shown in the ui won't be sent to the server, this can be
confusing if we expect the default specification to be fully implemented.
For instance `estimateSpec` and `x11Spec` are two entries found in the default
specifications for X13, but which won't be present in the data sent to the
server. In the same way, `decompositionSpec` is set in the default
specifications for tramoseats but are not present in the data sent to the
server.

```javascript
{
  type: 'tramoseatsSpecType',
  transformSpec: {
    //What it looks like in default specifications:
    //`transformSpec: { auto: {fct: 0.95} }`
    level: {} //other options are `log` and `auto`
  },
  //if automatic model is checked, we'll have a `autoModelSpec` entry set to 
  //`{}` and no `arimaSpec` entry
  arimaSpec: {
    spec: {
      mean: false,
      p: 0,
      d: 1,
      q: 1,
      bp: 0,
      bd: 1,
      bq: 1
    }
  },
  //`calendarSpec` can be missing if there is no information on moving holidays
  //and trading days. `calendarSpec` can be present with only one of these
  //entries filled in.
  //TODO document values for X13
  calendarSpec: {
    movingHolidays: {
      easter: {
        pretest: true,
        duration: 6
      }
    },
    tradingDays: {
      testType: 'Separate_T',
      tdOption: 'WorkingDays',
      lpOption: 'LeapYear'
    }
  },
  outlierSpec: {
    //What it looks like in default specifications:
    //`span:{ all: {}}, types: 'AO TC LS', va: 0.0, imvx: 0, tcrate: 0.7}`
    types: 'AO LS TC', //pick zero to three of these options
  }
}
```

Outliers attributes: 
- AO: Additive
- LS: Level shift
- TC: Transitory

## Output filter

OutputFilter looks like:
`OutputFilter: 'sa likelihood* y t det s i ee tde mhe cal reg out'`

Each string except for `y` is related to a checkbox in the ui (present in the
`OutputFilter` string if checked in the ui):
- sa: Seasonally adjusted series
- likelihood*: Likelihood statistics
- t: Trend component
- det: Deterministic component
- s: Seasonal component
- i: Irregular component
- ee: Easter effect
- tde: Trading days effect
- mhe: Moving holidays effect
- cal: Calendar effect
- reg: Regression effect
- out: Outliers effect