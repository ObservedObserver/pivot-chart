import React, { Component } from 'react';
import 'whatwg-fetch';
import URL from './api.config.js'
import Sheet from './pages/sheet/index.js'

class App extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: [],
      dataConfig: {}
    }
  }
  componentDidMount () {
    let self = this
    fetch(URL, {
      method: 'get'
    }).then((res) => {
      return res.json()
    }).then((res) => {
      self.setState({
        dataSource: res.dataSource,
        dataConfig: res.config
      })
    })
  }
  render() {
    return (
      <Sheet dataSource={this.state.dataSource} dataConfig={this.state.dataConfig}  />
    );
  }
}

export default App;