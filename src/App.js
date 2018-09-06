import React, { Component } from 'react';
import { Provider } from 'react-redux'
import URL from './api.config.js'
import Sheet from './store/containers/index.js'
import store from './store/index.js'
window.currentLabel = {}
class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Sheet  />
      </Provider>
    );
  }
}

export default App;