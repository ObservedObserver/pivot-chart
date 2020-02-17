import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getTitanicData } from './mock';
import { ToolBar, PivotChart, AsyncPivotChart, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState, Theme } from '../src/index';
import { TitanicCubeService } from './service';
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
    {/* <PivotChart visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} /> */}
    <AsyncPivotChart
      visType={visType}
      rows={fstate['rows']}
      columns={fstate['columns']}
      async={true}
      cubeQuery={async (path) => {
        return TitanicCubeService(path.map(p => p.dimCode), measures.map(m => m.id));
      }}
      measures={measures} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))