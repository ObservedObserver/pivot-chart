import React, { Component } from 'react';
import 'whatwg-fetch';
import URL from './api.config.js'
import Sheet from './pages/sheet/index.js'
import store from './store/index.js'
class App extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: [],
      dataConfig: {}
    }
    let self = this
    store.subscribe(() => {
      let state = store.getState()
      console.log('state update', state)
      self.setState({
        dataSource: state.dataSource,
        dataConfig: state.dataConfig
      })
    })
  }
  componentDidMount () {
    store.dispatch({
      type: 'requestServerData',
      params: {
        url: URL
      }
    })
  }
  render() {
    return (
      <Sheet dataSource={this.state.dataSource} dataConfig={this.state.dataConfig}  />
    );
  }
}

export default App;