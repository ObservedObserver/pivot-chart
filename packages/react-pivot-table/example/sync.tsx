import React, { useEffect, useState, useMemo } from 'react';
import { getTitanicData } from './mock';
import { ToolBar, PivotChart, DragableFields, Aggregators, DataSource, VisType, DraggableFieldState, Theme, Field } from '../src/index';

const initDraggableState: DraggableFieldState = {
  fields: [],
  rows: [],
  columns: [],
  measures: []
};

function SyncApp () {
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
  return <div>
    <DragableFields onStateChange={(state) => {setFstate(state)}} fields={fields} />
    <ToolBar visType={visType} onVisTypeChange={(type) => { setVisType(type) }} />
    <PivotChart
      defaultExpandedDepth={{
        rowDepth: 20,
        columnDepth: 20
      }}
      visType={visType} dataSource={data} rows={fstate['rows']} columns={fstate['columns']} measures={measures} />
  </div>
}

export default SyncApp;
