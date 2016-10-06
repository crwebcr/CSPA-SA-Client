import fetch from 'isomorphic-fetch'
import { METHODS, PRESPECS } from './constants'
import { specToState } from './spec-to-state'
import { stateToSpec } from './state-to-spec'
// Server address
var serverURL = 'http://localhost:8081/seasonal-adjustment-service'

export const loadPrespecs = () => {
  const specs = { x13: {}, ts: {} }
  const requests = METHODS.reduce((_, method) => 
    _.concat(PRESPECS.map(prespec => loadPrespec(method, prespec, specs))), [])
  return Promise.all(requests)
    .then(rslt => specs)
}

const loadPrespec = (method, prespec, prespecs) =>
  fetch(`${serverURL}/sas/${method}/${prespec}`, {
    headers: {
      Accept: 'application/json'
    }
  })
  .then(res => res.json())
  .then(spec => prespecs[method][prespec] = specToState(spec))
  
export const loadResults = (method, spec, series) => 
  fetch(`${serverURL}/sas/${method}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      ...stateToSpec(spec), //includes `Specification` and `OutputFilter`
      Series: series
    })
  })
  .then(res => {
    if (res.ok) return res.json()
    return Promise.reject({
      status: res.status,
      responseText: '' //FIXME don't know how to get `responseText` with fetch
    })
  })
  .catch(displayError)
  
/**
 * Display error message according to the returned HTML error code
 */
//FIXME handle network error
function displayError(err) {
  const { status, responseText } = err
  let message
	switch(status) {
		case 400:
      message = `Error in request: ${responseText}`
      break
		case 404:
      message = 'Cannot access service'
      break
		case 500:
      message = `Error while seasonal adjustment ${responseText}`
      break
		default:
      message = `Error ${responseText}`
	}
	alert(message)
  return Promise.reject(err)
}