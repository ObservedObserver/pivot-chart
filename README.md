# Faster-Pivot-Table

[details about the data structure](https://www.atatech.org/articles/114708)
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