import 'whatwg-fetch';
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
    }
}
function selector (oldSelector = defaultState.selector, action) {
    if (action.type !== 'editSelector') {return oldSelector}
    console.log('selector', action)
    const { field, name, type } = action.params || {}
    if (typeof field === 'undefined') {return oldSelector}
    let newSelector = {...oldSelector}
    let pos = newSelector[field].map(item => item.name).indexOf(window.currentLabel.name)
    if (pos >= 0) {
        newSelector[field].splice(pos, 1)
    }
    newSelector[field].push(window.currentLabel)
    window.currentLabel = {}
    return newSelector
}

function config (oldConfig = defaultState.config, action) {
    if (action.type !== 'editConfig') {return oldConfig}
    const { todo, url, dispatch, data } = action.params
    console.log()
    console.log('http request', action)
    switch (todo) {
        case 'request':
            fetch(url, {
                method: 'get'
            }).then((res) => {
                return res.json()
            }).then((res) => {
                console.log(dispatch, action.params)
                dispatch({
                    type: 'editConfig',
                    params: {
                        todo: 'save',
                        data: res,
                        dispatch
                    }
                })
            })
            return oldConfig
        case 'save':
            return {
                dataSource: data.dataSource,
                Dimensions: data.config.Dimensions,
                Measures: data.config.Measures
            }
    }
}
function settings (oldSettings= defaultState.settings, action) {
    if (action.type !== 'editSettings') {return oldSettings}
    const { field, value } = action.params
    let newSettings = {...oldSettings}
    newSettings[field] = value
    return newSettings
}

export {
    selector,
    config,
    settings
};