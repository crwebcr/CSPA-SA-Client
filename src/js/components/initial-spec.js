import React from 'react'
import PrespecPicker from './prespec-picker.js'
import MethodPicker from './method-picker'
import { METHODS, PRESPECS } from '../constants'

export default function InitialSpec(
  { method, changeMethod, prespec, changePrespec }) {
  
  return (
    <div>
      <MethodPicker method={method} methods={METHODS} onChange={changeMethod} />
      <PrespecPicker 
          prespec={prespec} 
          prespecs={PRESPECS[method]}
          onChange={changePrespec}/>
    </div>
  )
}