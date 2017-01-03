import React, { Component, PropTypes } from 'react'
import Tabs from './tabs'
import TabDetailsResults from './tab-details-results'
import {  ADJUSTED, EFFECTS, STATISTICS, OUTPUT_MAPPING } from '../constants' 

const tabs = [
  [ADJUSTED, 'Adjusted series'],
  [STATISTICS, 'Statistics'],
  [EFFECTS, 'Effect series']
]

export default class ResultsBrowser extends Component {
    constructor() {
      super()
      this.state = { active: ADJUSTED }
      this.selectTab = selectedTab => this.setState({ active: selectedTab })
    }
    
    render() {
      const {
        resultsByType, selectSeries, selectStatistic
      } = this.props
      const { active } = this.state
      return (
        <div className="results-browser">
          <Tabs active={active} selectTab={this.selectTab} tabs={tabs}/>
          <TabDetailsResults 
            resultsByType={resultsByType}
            selectSeries={selectSeries}
            selectStatistic={selectStatistic}
            what={active} />
        </div>
      )
    }
}

ResultsBrowser.propTypes = {
  resultsByType: PropTypes.object.isRequired,
  selectSeries: PropTypes.func.isRequired,
  selectStatistic: PropTypes.func.isRequired
}