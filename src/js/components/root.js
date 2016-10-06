import React, { Component, PropTypes } from 'react'
import Specifications from './specifications'
import TimeSeries from './time-series'
import { loadPrespecs, loadResults } from '../remote'
import { readResults } from '../process-results'

import { METHODS, PRESPECS } from '../constants'

export default class Root extends Component {
  constructor() {
    super()
    this.state = {
      spec: null,
      method: METHODS[0],
      prespec: PRESPECS[0],
      prespecs: null
    }
    this.changeSpec = spec => this.setState({ spec })
    this.changeMethod = method => this.setState({ 
      spec: this.state.prespecs[method][this.state.prespec],
      method
    })
    this.changePrespec = prespec => this.setState({
      spec: this.state.prespecs[this.state.method][prespec],
      prespec
    })
    this.adjust = series => { 
      const { method, spec } = this.state
      return loadResults(method, spec, series)
        .then(readResults)
    }
  }
  
  componentWillMount() {
    const { method, prespec } = this.state
    if (!this.state.prespecs) {
      loadPrespecs().then(specs => this.setState({ 
        spec: specs[method][prespec],
        prespecs: specs
       }))
    }
  }
  
  render() {
    const { spec, method, prespec } = this.state
    return (
      <div className="container">
        <h1>
          Seasonal adjustment
        </h1>
        { spec ?
            <Specifications
                spec={spec} changeSpec={this.changeSpec}
                method={method} changeMethod={this.changeMethod}
                prespec={prespec} changePrespec={this.changePrespec} /> :
            <img height="25px" width="25px" src="img/spinner.gif" />  
        }
        { spec &&
            <TimeSeries adjust={this.adjust}/>
        }  
      </div>
    )
  }
}