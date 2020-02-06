<img src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/lang-icons/icon128px.png" width="22px" /> English | [简体中文](./README.zh-CN.md)

# Pivot-Chart
![](https://img.shields.io/npm/v/pivot-chart)
![](https://img.shields.io/github/license/ObservedObserver/pivot-chart)

pivot chart is a an extension data visualization type of pivot table. It allows user to observe the data in different chart type without limited to table and pure numbers.

pivot chart also provide with basic pivot table components for you to build your web apps, you can regard pivot table as a member in the subset of pivot charts. pivot chart is build based on [cube-core](https://github.com/ObservedObserver/cube-core): an MOLAP cube solution in js.

## Demo

| feature | demo(gif) |
| - | - |
| basic expandable nest/cross table | ![basic expandable nest/cross table.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-basic.gif) |
| custom aggregator of measures | ![ustom aggregator of measures.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-aggregator.gif) |
| different visualization type | ![different visualization type.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-fast.gif) |

## Usage

install npm package.
```bash
npm i --save fast-pivot

# or

yarn add fast-pivot
```

use component
```js
import { PivotChart } from 'fast-pivot';

function App () {
  return <PivotChart
    visType={visType}
    dataSource={data}
    rows={rows}
    columns={columns}
    measures={measures} 
    />
}
```

full demo:
```js
import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getTitanicData } from './mock';
import { ToolBar, PivotTable, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState } from '../src/index';

const { sum, count, mean } = Aggregators;
const aggregatorMapper = { sum, count, mean } as const;
const { dataSource, dimensions, measures } = getTitanicData();
const fields = dimensions.concat(measures).map(f => ({ id: f, name: f }));

const initDraggableState: DraggableFieldState = {
  fields: [],
  rows: [],
  columns: [],
  measures: []
};

function App () {
  const [data, setData] = useState<DataSource>([]);
  const [fstate, setFstate] = useState<DraggableFieldState>(initDraggableState)
  const [visType, setVisType] = useState<VisType>('number');
  useEffect(() => {
    setData(dataSource);
  }, [])
  const measures = useMemo(() => fstate['measures'].map(f => ({
    ...f,
    aggregator: aggregatorMapper[(f.aggName || 'sum') as keyof typeof aggregatorMapper]
  })), [fstate['measures']]);
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    <PivotTable visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))
```

demo above can be run locally with
```
npm run dev
```

## Others
another implementation of cube-core pivot-table can be found as `./packages/demo`