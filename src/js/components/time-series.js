import React, { Component, PropTypes } from 'react'
import FilePicker from './file-picker'
import ResultsBrowser from './results-browser'
import Results from './results'
import { loadSeries, jsonSeries } from '../read-file'
import { defaultByType } from '../process-results'

import {
  FILE_LOADED, FILE_LOADING, FILE_NO,
  ADJUST_DONE, ADJUST_PENDING, ADJUST_NO,
  SHOW_GRAPH, SHOW_STATISTICS,
  ADJUSTED, EFFECTS, STATISTICS
} from '../constants'



export default class TimeSeries extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      statusFile: FILE_NO,
      statusAdjust: ADJUST_NO,
      filename: null,
      results: null,
      show: null
    }
    this.selectFile = () => this.refs.fileInput.click()
    this.loadFile = file => {
      this.setState({
        statusFile: FILE_LOADING,
        statusAdjust: ADJUST_NO,
        filename: file.name
      })
      loadSeries(file, this.saveSeries)
    }
    this.saveSeries = series => {
      this.setState({
        statusFile: FILE_LOADED,
        series,
        results: {
          byType: defaultByType,
          data: { y: series } },
        show: { type: SHOW_GRAPH, what: ['y'] }
      })
    }
    
    this.showSeries = () => this.selectSeries('y')
    
    this.adjust = () => {
      const { series } = this.state
      this.setState({
        statusAdjust: ADJUST_PENDING,
      })
      this.props.adjust(jsonSeries(series))
        .then(results => this.setState({
          statusAdjust: ADJUST_DONE,
          results
        }))
    }
    //Following methods need to be defined here since they have an effect on the
    //`Results` component which needs to be instiated here (since it take half
    //the width of this component).
    this.selectSeries = name => {
      let { type, what } = this.state.show
      if (type !== SHOW_GRAPH) what = [name]
      else {
        let i
        if ((i = what.indexOf(name)) > -1) what.splice(i, 1)
        else what.push(name)
      }
      this.setState({
        show: {
          type: SHOW_GRAPH,
          what
        }
      })
    }
    this.selectStatistic = name => this.setState({
      show: {
        type: SHOW_STATISTICS,
        what: name
      }
    })
  }
  
  render() {
    const { statusFile, statusAdjust, results, show } = this.state
      return (
        <div className="series">
          <div className="series-col">
            <h2>Time series</h2>
            <FilePicker status={statusFile}
                        loadFile={this.loadFile}
                        showSeries={this.showSeries}
                        filename={this.state.filename} />
                        
            { statusFile === FILE_LOADED &&
               <button onClick={this.adjust}>Seasonal adjust</button>
            }
            { statusAdjust === ADJUST_PENDING &&
              <img height="25px" width="25px" src="./img/spinner.gif" />
            }
            { statusAdjust === ADJUST_DONE && <h2>Results</h2> }
            { statusAdjust === ADJUST_DONE && 
              <ResultsBrowser resultsByType={results.byType}
                              selectSeries={this.selectSeries}
                              selectStatistic={this.selectStatistic} />
            }
          </div>
          <div className="series-col">
            { show &&
              <Results
                results={results} show={this.state.show} />
            }
          </div>
      </div>  
    )
  }
}

TimeSeries.propTypes = {
  adjust: PropTypes.func.isRequired
}