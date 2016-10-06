import React, { Component, PropTypes } from 'react'
import Tabs from './tabs'
import SpecTabDetails from './spec-tab-details'

import {
  TRANSFORMATION, MODEL, OUTLIERS, CALENDAR, OUTPUTS
} from '../constants'

const tabs = [
  [TRANSFORMATION, 'Transformation'],
  [MODEL, 'Model'],
  [OUTLIERS, 'Outliers'],
  [CALENDAR, 'Calendar'],
  [OUTPUTS, 'Outputs']
]

export default class SpecDetails extends Component {
    constructor() {
      super()
      this.state = { 
        active: TRANSFORMATION
      }
      this.selectTab = selectedTab => this.setState({ active: selectedTab })
    }
    
    render() {
      const { spec, changeSpec } = this.props
      const { active } = this.state
      return (
        <div>
          <Tabs active={active} selectTab={this.selectTab} tabs={tabs}/>
          <SpecTabDetails spec={spec} changeSpec={changeSpec} what={active}/>
        </div>
      )
    }
}

SpecDetails.propTypes = {
  spec: PropTypes.object.isRequired,
  changeSpec: PropTypes.func.isRequired
}