import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { getTitanicData } from './mock';
import { ToolBar, AsyncPivotChart, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState, Theme, Field, AggNodeConfig } from '../src/index';
import { TitanicCubeService } from './service';
import { QueryPath, queryCube, AsyncCacheCube } from '../src/utils';

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
  },
  // table: {
  //   thead: {
  //     backgroundColor: '#65B891'
  //   },
  //   borderColor: 'red'
  // }
})
function AsyncApp () {
  
  const [data, setData] = useState<DataSource>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [fstate, setFstate] = useState<DraggableFieldState>(initDraggableState)
  const [visType, setVisType] = useState<VisType>('number');
  const [aggNodeConfig, setAggNodeConfig] = useState<AggNodeConfig>({ row: false, column: false });
  const cubeRef = useRef<AsyncCacheCube>();

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
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }}
      showAggregatedNode={aggNodeConfig}
      onShowAggNodeChange={value => {
          setAggNodeConfig(value)
        }
      }
    />
    {/* <PivotChart visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} /> */}
    <AsyncPivotChart
      cubeRef={cubeRef}
      visType={visType}
      rows={fstate['rows']}
      columns={fstate['columns']}
      onNestTreeChange={(left, top) => {
        console.log({ left, top })
      }}
      // branchFilters={[
      //   {
      //     id: 'Pclass',
      //     name: 'Pclass',
      //     domain: [1,2,3],
      //     values: [1, 2]
      //   }
      // ]}
      defaultExpandedDepth={{
        rowDepth: 20,
        columnDepth: 20
      }}
      showAggregatedNode={aggNodeConfig}
      cubeQuery={cubeQuery}
      measures={measures} />
       {/* <AsyncPivotChart
      measures={[{ id: 'Survived', name: 'survived', aggName: 'sum' }]}
      rows={[{ id: 'Embarked', name: 'embarked' }]}
      columns={[{ id: 'Sex', name: 'sex' }]}
      visType="number"
      async
      cubeQuery={cubeQuery}
      defaultExpandedDepth={{
        rowDepth: 1,
        columnDepth: 1
      }}
    /> */}
  </div>
}

export default AsyncApp;
