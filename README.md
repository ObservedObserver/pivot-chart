<img src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/lang-icons/icon128px.png" width="22px" /> English | [简体中文](./README.zh-CN.md)

# Pivot-Chart
![](https://img.shields.io/npm/v/pivot-chart)
![](https://img.shields.io/github/license/ObservedObserver/pivot-chart)

Pivot-Chart is a comprehensive data visualization tool that enhances pivot tables with visualizations and charts, offering a more intuitive and informative way to analyze your data. With Pivot-Chart, you can elevate your data analysis and take a new approach to exploring your data. Unlike other pivot-table + vis solution, pivot chart retains nest multi-level aggregation feature of pivot table, which allows you to compare between different aggregation levels and make it easier to drill down and roll up.

Integrating Pivot-Chart into your data applications is easy, simply import the npm package. 

> While this is a proof-of-concept project, your feedback and suggestions are valued and appreciated.

`pivot-chart` also provide with basic pivot table components for you to build your web apps, you can regard pivot table as a member in the subset of pivot charts.

## Demo

[Online Demo](https://pivot-chart.vercel.app/)

## Features

| feature | demo(gif) |
| - | - |
| basic expandable nest/cross table | ![basic expandable nest/cross table.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-basic.gif) |
| custom aggregator of measures | ![ustom aggregator of measures.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-aggregator.gif) |
| different visualization type | ![different visualization type.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-light.gif)<br /> <img width="100%" src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-static-bar.jpg" /> |

## Usage

<br />install npm package.<br />

```bash
npm i --save pivot-chart

# or

yarn add pivot-chart
```

<br />basic usage.<br />

```javascript
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

<br />
<br />
<br />demo above can be run locally with<br />

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
### common
common interface are those used in both async pivot table and sync pivot table.

- **rows**: `Field[]` dimensions in row. required
- **columns**: `Field[]` dimensions in column.required
- **measures**: `Measure[]` measures or indicators.required
- **visType**: `VisType` mark type in cell. `number` as default(which is a common pivot table).optional
- **defaultExpandedDepth**. default expanded level in row or column nest tree.optional
  - defaultExpandedDepth.rowDepth: `number` 
  - defaultExpandedDepth.columnDepth: `number` 
- **showAggregatedNode**: `{row: boolean; column: boolean}` whether display aggregated node for each group. optional
<a name="f7jCH"></a>
#### SyncPivotTable

- **dataSource**: `Record[]` . Array of record(normaly plain object). (json style data array). required


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

#### AsyncPivotTable (WIP)

- **cubeQuery**: `(path: QueryPath, measures: string[]) => Promise;` . A function handle for cube query. path is the groupby dimension path(made of a series of dimension and its value). measures are the fields needed to be aggregated. required
- **branchFilter**: bad api, not recommanded to use it. a fake filter whihc only control display of node and not influence the aggregated result of parent node. optional
- **dimensionCompare**: `(a: string, b: string) => number` .compare function for sort of dimension node. optional



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
  const cubeQuery = useCallback(async (path: QueryPath, meas: string[]) => {
    const ops = measures.filter(m => meas.includes(m.id)).map(m => m.aggName || 'sum');
    return TitanicCubeService(path.map(p => p.dimCode), meas, ops);
  }, [measures])
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

<a name="OPzwK"></a>
### Common Question
> SyncPivotChart vs. AsyncPivotChart ?

Sync Pivot Chart does all cube computaion in frontend.(In future, it may do those work in webworker and it will seems to be async). 
<br />
Async Pivot Chart can use cube query from server or customed implementation(either on server or browser, async or sync), but developer need to figure out how to speed up those by themsleves.
