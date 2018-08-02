
import store from './index.js'

const defaultState = {
    dataSource: [],
    dataConfig: {
        Dimensions: [],
        Measures: []
    },
    sheet: {
        Dimensions: [],
        Measures: [],
        Color: [],
        content: 'table',
        chartType: 'bar'
    }
}
const reducer = (state = defaultState, action) => {
    console.log(action)
    if (typeof reducerCenter[action.type] !== 'undefined') {
        return reducerCenter[action.type](state, action)
    }
    return state
};


const reducerCenter = {
    setContent (state, action) {
        const { content } = action.params
        let newState = { ...state }
        newState.sheet.content = content
        return newState
    },
    setChartType (state, action) {
        const { chartType } = action.params
        let newState = { ...state }
        newState.sheet.chartType = chartType
        return newState
    },
    addLabel (state, action) {
        const { type, name } = action.params
        let newState = { ...state }
        if (newState.sheet[type].indexOf(name) > -1) {
            this.removeLabel(state, action)
        }
        newState.sheet[type].push(name)
        return newState
    },
    removeLabel (state, action) {
        const { type, name } = action.params
        let newState = { ...state }
        let index = state.sheet[type].indexOf(name)
        newState.sheet[type].splice(index, 1)
        return newState
    },
    requestServerData (state, action) {
        const { url } = action.params
        fetch(url, {
            method: 'get'
        }).then((res) => {
            return res.json()
        }).then((res) => {
            // this
            store.dispatch({
                type: 'storeServerData',
                params: res
            })
        })
        return state
    },
    storeServerData (state, action) {
        const { config, dataSource } = action.params
        let newState = { ...state }
        newState.dataConfig = config
        // newState.dataConfig.Measures.push('MeasureValue')
        // newState.dataConfig.Dimensions.push('MeasureType')
        newState.dataSource = dataSource
        console.log('data rows', newState.dataSource.length)
        return newState
    }
}
export default reducer;