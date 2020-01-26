import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { mockData, getTitanicData } from './mock';
import { DataSource } from '../src/common';
import MagicCube from '../src/index';
import DragableFields, { DraggableFieldState } from '../src/dragableFields/index';
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
  useEffect(() => {
    console.log({ dataSource, dimensions, measures })
    setData(dataSource);
  }, [])
  const rows = useMemo(() => fstate['rows'].map(f => f.id), [fstate['rows']]);
  const columns = useMemo(() => fstate['columns'].map(f => f.id), [fstate['columns']]);
  const measures = useMemo(() => fstate['measures'].map(f => f.id), [fstate['measures']]);
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <MagicCube dataSource={data} rows={rows} columns={columns} measures={measures} />
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))