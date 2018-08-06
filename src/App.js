import React, { Component } from 'react';
import 'whatwg-fetch';
import URL from './api.config.js'
import Sheet from './pages/sheet/index.js'
import store from './store/index.js'
class App extends Component {
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
      <Sheet  />
    );
  }
}

export default App;