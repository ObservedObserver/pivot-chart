import React, { useEffect, useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { getTitanicData } from './mock';
import { ToolBar, PivotChart, AsyncPivotChart, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState, Theme, Field } from '../src/index';
import { TitanicCubeService } from './service';
import { QueryPath, queryCube } from '../src/utils';

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
    aggregator: Aggregators[(f.aggName || 'sum') as keyof typeof Aggregators]
  })), [fstate['measures']]);
  const cubeQuery = useCallback(async (path: QueryPath, measures: string[]) => {
    return TitanicCubeService(path.map(p => p.dimCode), measures);
  }, [])
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    {/* <PivotChart visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} /> */}
    <AsyncPivotChart
      visType={visType}
      rows={fstate['rows']}
      columns={fstate['columns']}
      async={true}
      branchFilters={[
        {
          id: 'Pclass',
          name: 'Pclass',
          domain: [1,2,3],
          values: [1, 2]
        }
      ]}
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

ReactDOM.render(<App />, document.getElementById('root'))