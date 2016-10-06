import React, { Component, PropTypes } from 'react'
import { loadSeries } from '../read-file'

import {
  FILE_LOADED, FILE_LOADING, FILE_NO,
} from '../constants'

export default class FilePicker extends Component {
  constructor(props) {
    super(props)
    this.selectFile = () => this.refs.fileInput.click()
    this.loadFile = e => {
      const files = e.target.files
      if (files.length > 0) this.props.loadFile(files[0])
    }
  }
  
  render() {
    const { status, showSeries, filename } = this.props
    let filenameEl
    if (status === FILE_LOADING) {
      filenameEl = <img height="25px" width="25px" src="img/spinner.gif" />
    } 
    else if (status === FILE_LOADED) {
      filenameEl = 
        <span className="filename" onClick={showSeries}>
          {filename}
        </span>
    }
    return (
      <div className="file-picker">
        <button onClick={this.selectFile}>Select series</button>
      	<input type="file" className="input-file"
               ref="fileInput" onChange={this.loadFile} />
        { filenameEl }
      </div>
    )
  }
}

FilePicker.propTypes = {
  status: PropTypes.string.isRequired,
  loadFile: PropTypes.func.isRequired,
  showSeries: PropTypes.func.isRequired
}