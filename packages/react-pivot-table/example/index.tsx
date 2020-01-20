import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { mockData } from './mock';
import { DataSource } from '../src/common';
import MagicCube from '../src/index';
function App () {
  const [data, setData] = useState<DataSource>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [measures, setMeasures] = useState<string[]>([]);
  useEffect(() => {
    const { dataSource, dimensions, measures } = mockData();
    setData(dataSource);
    setDimensions(dimensions);
    setMeasures(measures);
  }, [])
  return <MagicCube dataSource={data} dimensions={dimensions} measures={measures} />
}

ReactDOM.render(<App />, document.getElementById('root'))