require('../css/style.css')
//import 'babel-polyfill'
require('file?name=[name].[ext]!../index.html');
require('file?name=[name].[ext]!../img/spinner.gif');
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/root'


ReactDOM.render(
	<Root/>,
	document.getElementById('base'));


