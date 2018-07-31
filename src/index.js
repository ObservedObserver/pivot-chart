import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import Sheet from './pages/sheet/index.js'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
