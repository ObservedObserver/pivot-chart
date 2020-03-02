<img src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/lang-icons/icon128px.png" width="22px" /> [English](./README.md) | 简体中文

# Pivot-Chart(数据透视图)
![](https://img.shields.io/npm/v/pivot-chart)
![](https://img.shields.io/github/license/ObservedObserver/pivot-chart)


数据透视图是数据透视表的增强拓展形式。其使得数据透视表数据展示的形式不再限于单纯的数字，使得用户可以同时拥有数据透视(旋转、切片、下钻、上卷)与可视化图表的能力。

数据透视图也为你提供了基本的数据透视表组件。事实上，数据透视表是数据透视图的一种特殊情况，所以你也可以直接使用数据透视图来构建你的数据透视表组件。pivot-chart是基于[cube-core](https://github.com/ObservedObserver/cube-core)提供的前端cube计算能力搭建的。

## Demo

[线上demo](https://chspace.oss-cn-hongkong.aliyuncs.com/pivot-chart/index.html)

| 功能 | demo(gif) |
| - | - |
| 基本的nest/cross透视表(可展开、旋转) | ![basic expandable nest/cross table.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-basic.gif) |
| 自定义度量的聚合方式 | ![ustom aggregator of measures.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-table-aggregator.gif) |
| 数据透视表/使用不同的可视化类型 | ![different visualization type.gif](https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-light.gif)<br /> <img width="100%" src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/pivot-chart/pivot-chart-static-bar.jpg" /> |

## 使用

安装npm包.
```bash
npm i --save pivot-chart

# or

yarn add pivot-chart
```

使用组件
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

自定义主题/配置
```js
Theme.registerTheme({
  root: {
    display: true,
    label: 'root'
  },
  summary: {
    label: '(total)'
  }
})
```

同步计算:
```js
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


异步计算
```js
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

你也可以将上面👆的demo在本地运行
```bash
# 初始化开发环境
yarn workspace pivot-chart initenv
# 启动dev server
yarn workspace pivot-chart dev
```

## API
```js
interface PivotChartProps {
  dataSource: DataSource;
  rows: Field[];
  columns: Field[];
  measures: Measure[];
  visType?: VisType;
  defaultExpandedDepth?: {
    rowDepth: number;
    columnDepth: number;
  };
  async?: false;
  cubeQuery?: (path: QueryPath) => Promise<DataSource>;
}
```

```js
interface AsyncPivotChartProps {
  rows: Field[];
  columns: Field[];
  measures: Measure[];
  visType?: VisType;
  defaultExpandedDepth?: {
    rowDepth: number;
    columnDepth: number;
  };
  async?: boolean;
  cubeQuery: (path: QueryPath, measures: string[]) => Promise<DataSource>;
  branchFilters?: Filter[];
  dimensionCompare?: cmpFunc
}
```

## 其他碎碎念
另一个数据透视表的实现可以参考 `./packages/demo`