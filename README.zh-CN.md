<img src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/lang-icons/icon128px.png" width="22px" /> [English](./README.md) | 简体中文

# Pivot-Chart(数据透视图)
![](https://img.shields.io/npm/v/pivot-chart)
![](https://img.shields.io/github/license/observedobserver/pivot-chart)
![](https://img.shields.io/github/issues-pr/observedobserver/pivot-chart)
![](https://img.shields.io/github/actions/workflow/status/observedobserver/pivot-chart/build.yml)


数据透视图是数据透视表的增强拓展形式。其使得数据透视表数据展示的形式不再限于单纯的数字，使得用户可以同时拥有数据透视(旋转、切片、下钻、上卷)与可视化图表的能力。

数据透视图也为你提供了基本的数据透视表组件。事实上，数据透视表是数据透视图的一种特殊情况，所以你也可以直接使用数据透视图来构建你的数据透视表组件。

## Demo

[线上demo](https://pivot-chart.vercel.app/)

## 特性

| 功能 | demo(gif) |
| - | - |
| 基本的nest/cross透视表(可展开、旋转) | ![basic expandable nest/cross table.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-basic.gif) |
| 自定义度量的聚合方式 | ![ustom aggregator of measures.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-aggregator.gif) |
| 数据透视表/使用不同的可视化类型 | ![different visualization type.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-light.gif)<br /> <img width="100%" src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-static-bar.jpg" /> |

## Usage

<br />install npm package.<br />

```bash
npm i --save pivot-chart

# or

yarn add pivot-chart
```

<br />basic usage.<br />

```javascript
import { PivotChart } from 'pivot-chart';

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

本地测试

```bash
# init development environment
yarn workspace react-pivot-table initenv
# start dev server
yarn workspace react-pivot-table dev
```


<a name="API"></a>
## API


<a name="Types"></a>
### Types
| Type | Desc |
| --- | --- |
| Field | <br />- `id` <string><br />- `name` <string><br />- `aggName` <string> aggregator's name.<br />- `cmp` <(a: any, b: any) => number><br /> |
| Measure | extends Field<br />- `aggregator` aggregator function.<br />- `minWidth` <number><br />- `formatter` <value: number> => number | string | ReactNode<br /> |
| VisType | currently support `number` , `bar` , `line` , `scatter` . |
| Record | a plain javascript object |
| DataSource | `Record[]` , Array of Record. |
| QueryNode | <br />- `dimCode` <string><br />- `dimValue` <string><br /> |
| QueryPath | <QueryNode[]>.<br />example: `[{dimCode: 'Sex', dimValue: 'male'}, {dimCode: 'Age', dimValue:'*'}]`   |


<br />

<a name="jzdLj"></a>
### 公共接口
所有透视表组件的公共接口

- **rows**: `Field[]` 行维度. required
- **columns**: `Field[]` 列维度.required
- **measures**: `Measure[]` 度量/指标.required
- **visType**: `VisType` 单元格里的标记类型（可以理解为图表类型）. `number` as default(此时是常规的透视表).optional
- **defaultExpandedDepth**. 行维度树或列维度树的默认展开层数.optional
  - defaultExpandedDepth.rowDepth: `number` 
  - defaultExpandedDepth.columnDepth: `number` 
- **showAggregatedNode**: `{row: boolean; column: boolean}`是否展示汇总节点. optional
<a name="f7jCH"></a>
#### SyncPivotTable

- **dataSource**: `Record[]` . 数据源，一个类json的对象数组. required


<br />
example:

```javascript
import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getTitanicData } from './mock';
import { ToolBar, PivotChart, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState } from '../src/index';

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
    aggregator: Aggregators[(f.aggName || 'sum') as keyof typeof Aggregators]
  })), [fstate['measures']]);
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    <PivotChart visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))
```
<a name="8ppwU"></a>
#### AsyncPivotTable

- **cubeQuery**: `(path: QueryPath, measures: string[]) => Promise;` . 处理cube计算服务的函数. path 是维度分组的路径，由一系列的维度和维度成员值构成. 度量是需要进行聚合计算的度量字段. required
- **branchFilter**: bad api, not recommanded to use it. a fake filter whihc only control display of node and not influence the aggregated result of parent node. optional
- **dimensionCompare**: `(a: string, b: string) => number` .对维度进行排序的比较函数、默认是字典序. optional



```javascript
function AsyncApp () {
  
  const [data, setData] = useState<DataSource>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [fstate, setFstate] = useState<DraggableFieldState>(initDraggableState)
  const [visType, setVisType] = useState<VisType>('number');
  useEffect(() => {
    const { dataSource, dimensions, measures } = getTitanicData();
    setData(dataSource);
    const fs: Field[] = [...dimensions, ...measures].map((f: string) => ({ id: f, name: f }));
    setFields(fs);
  }, [])
  const measures = useMemo(() => fstate['measures'].map(f => ({
    ...f,
    aggregator: Aggregators[(f.aggName || 'sum') as keyof typeof Aggregators],
    minWidth: 100,
    formatter: f.id === 'Survived' && ((val: any) => `${val} *`)
  })), [fstate['measures']]);
  const cubeQuery = useCallback(async (path: QueryPath, measures: string[]) => {
    return TitanicCubeService(path.map(p => p.dimCode), measures);
  }, [])
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    <AsyncPivotChart
      visType={visType}
      rows={fstate['rows']}
      columns={fstate['columns']}
      async
      defaultExpandedDepth={{
        rowDepth: 20,
        columnDepth: 20
      }}
      cubeQuery={cubeQuery}
      measures={measures} />
  </div>
}
```


<a name="yi5rr"></a>
### Theme

- Theme.registerTheme(theme: ThemeConfig)
- `ThemeConfig` 



```typescript
interface ThemeConfig {
  root?: {
    display?: boolean,
    label?: string
  },
  summary?: {
    label?: string
  },
  table?: {
    thead?: {
      backgroundColor?: string;
      color?: string;
    }
    borderColor?: string;
    color?: string;
  }
}
// default config
const THEME_CONFIG: ThemeConfig = {
  root: {
    display: true,
    label: 'All'
  },
  summary: {
    label: '(total)'
  },
  table: {
    thead: {
      backgroundColor: '#E9EDF2',
      color: '#5A6C84'
    },
    borderColor: '#DFE3E8',
    color: '#333333'
  }
};
```


```javascript
import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getTitanicData } from './mock';
import { ToolBar, PivotChart, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState, Theme } from '../src/index';

const { dataSource, dimensions, measures } = getTitanicData();
const fields = dimensions.concat(measures).map(f => ({ id: f, name: f }));

const initDraggableState: DraggableFieldState = {
  fields: [],
  rows: [],
  columns: [],
  measures: []
};

Theme.registerTheme({
  root: {
    display: true,
    label: 'root'
  },
  summary: {
    label: '(total)'
  }
})

function App () {
  const [data, setData] = useState<DataSource>([]);
  const [fstate, setFstate] = useState<DraggableFieldState>(initDraggableState)
  const [visType, setVisType] = useState<VisType>('number');
  useEffect(() => {
    setData(dataSource);
  }, [])
  const measures = useMemo(() => fstate['measures'].map(f => ({
    ...f,
    aggregator: Aggregators[(f.aggName || 'sum') as keyof typeof Aggregators]
  })), [fstate['measures']]);
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    <PivotChart visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))
```


### Common Question
> SyncPivotChart vs. AsyncPivotChart ?

Sync Pivot Chart 的计算都发生在前端。这里叫sync其实有点不合适，因为后续优化这些计算也可以发生在webworker中。

Async Pivot Chart的cube计算是服务端或用户自己提供的。组件本身会帮助用户缓存一些已经计算过的结果，所以重复的查询会比较少，但相似的查询之间公共结果的复用仍需要用户自己实现。

### 碎碎念
这个项目是很久之前写的了，过去一段时间没有做维护更新。如果你想要一些类似的组件或分析工具，可以了解我近期在开发的项目[graphic-walker](https://github.com/Kanaries/graphic-walker)，它基本上可以替代pivot-chart的场景。如果你觉得pivot-chart这个项目能帮到你，欢迎在issue中告诉我，我会很开心的重新迭代这个项目~