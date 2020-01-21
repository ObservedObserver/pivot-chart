import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { mockData, getTitanicData } from './mock';
import { DataSource } from '../src/common';
import MagicCube from '../src/index';
function App () {
  const [data, setData] = useState<DataSource>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [measures, setMeasures] = useState<string[]>([]);
  useEffect(() => {
    const { dataSource, dimensions, measures } = getTitanicData();
    console.log({ dataSource, dimensions, measures })
    setData(dataSource);
    setDimensions(dimensions);
    setMeasures(measures);
  }, [])
  return <MagicCube dataSource={data} rows={['Sex', 'Embarked', "Parch"]} columns={['Pclass', 'SibSp']} measures={['Count', 'Survived']} />
}

ReactDOM.render(<App />, document.getElementById('root'))