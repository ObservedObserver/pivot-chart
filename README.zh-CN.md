<img src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/lang-icons/icon128px.png" width="22px" /> English | [简体中文](./README.zh-CN.md)

# Pivot-Chart(数据透视图)
![](https://img.shields.io/npm/v/pivot-chart)
![](https://img.shields.io/github/license/ObservedObserver/pivot-chart)

pivot chart is a an extension data visualization type of pivot table. It allows user to observe the data in different chart type without limited to table and pure numbers.

数据透视图是数据透视表的增强拓展形式。其使得数据透视表数据展示的形式不再限于单纯的数字，使得用户可以同时拥有数据透视(旋转、切片、下钻、上卷)与可视化图表的能力。

pivot chart also provide with basic pivot table components for you to build your web apps, you can regard pivot table as a member in the subset of pivot charts. pivot chart is build based on [cube-core](https://github.com/ObservedObserver/cube-core): an MOLAP cube solution in js.

数据透视图也为你提供了基本的数据透视表组件。事实上，数据透视表是数据透视图的一种特殊情况，所以你也可以直接使用数据透视图来构建你的数据透视表组件。

## Demo

| feature | demo(gif) |
| - | - |
| 基本的nest/cross透视表(可展开、旋转) | ![basic expandable nest/cross table.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-basic.gif) |
| 自定义度量的聚合方式 | ![ustom aggregator of measures.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-aggregator.gif) |
| 数据透视表/使用不同的可视化类型 | ![different visualization type.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart.gif) |

## 使用

安装npm包.
```bash
npm i --save fast-pivot

# or

yarn add fast-pivot
```

使用组件
```js
import MagicCube from 'fast-pivot';

function App () {
  return <MagicCube
    visType={visType}
    dataSource={data}
    rows={rows}
    columns={columns}
    measures={measures} 
    />
}
```

一个完整的demo:
```js
import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { mockData, getTitanicData } from './mock';
import { DataSource, VisType } from '../src/common';
import MagicCube, { ToolBar } from '../src/index';
import DragableFields, { DraggableFieldState } from '../src/dragableFields/index';
import { sum, count, mean } from 'cube-core';
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
    console.log({ dataSource, dimensions, measures })
    setData(dataSource);
  }, [])
  console.log(fstate)
  const measures = useMemo(() => fstate['measures'].map(f => ({
    ...f,
    aggregator: aggregatorMapper[(f.aggName || 'sum') as keyof typeof aggregatorMapper]
  })), [fstate['measures']]);
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    <MagicCube visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))
```

你也可以将上面👆的demo在本地运行
```
npm run dev
```

## 其他碎碎念
另一个数据透视表的实现可以参考 `./packages/demo`