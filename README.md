# Faster-Pivot-Table
An demo based on [Core-Cube](https://github.com/ObservedObserver/cube-core)

![](http://imglf4.nosdn0.126.net/img/UnhEMnlSbXBDeGo0RUNuWjVncFBYa1NCMWVvd1hyZXhFWjJLckcydG9kRlU4aW1ueTF2YndnPT0.gif)

[details about the data structure](https://www.yuque.com/chenhao-sv93h/evfohb/eiu24v)
## Usage
```js
import { PivotTable } from '/src/components/pivot/index.js'
```

## Install
```bash
npm i

npm start/yarn start
```

## Demo
set your own data service in `api.config.js`
```js
const HOST = '127.0.0.1'
const PORT = '2018'
const API = 'api/data/titanic'

const URL = `http://${HOST}:${PORT}/${API}`

export default URL;
```
