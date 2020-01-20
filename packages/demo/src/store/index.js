import { createStore, combineReducers } from 'redux'
import * as reducers from './reducers.js'

const defaultState = {
    config: {
        dataSource: [],
        Dimensions: [],
        Measures: []
    },
    selector: {
        Rows: [],
        Columns: [],
        Measures: []
    },
    settings: {
        tableType: '1d',
        aggFunc: 'MEAN'
    },
    pivot: {
        height: 720,
        size: 'middle'
    },
    currentLabel: {}
}
console.log('resucers', reducers)
const reducer = combineReducers(reducers)
console.log(reducer)
const store = createStore(reducer, defaultState)
console.log(store.getState())

export default store