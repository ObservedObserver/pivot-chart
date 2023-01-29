import { getTitanicData } from './mock';
import { DataSource, Measure, Record } from '../src';
import { createCube, sum, mean, count } from 'cube-core';
import momentCube from 'cube-core/built/core/momentCube';
// import aggregate from 'cube-core';

function getAggregator (type?: string) {
  switch (type) {
    case 'sum':
      return sum;
    case 'mean':
      return mean;
    case 'count':
      return count;
    default:
      return sum;
  }
}

const { dataSource, dimensions, measures } = getTitanicData();
function aggregate(dataSource: DataSource, dimensions: string[], measures: string[], ops: string[]): DataSource {
  let map = new Map<string, Record>();
  for (let record of dataSource) {
    let unionDims = dimensions.map(d => record[d]);
    let unionKey = unionDims.join('-');
    if (!map.has(unionKey)) {
      let ans: Record = {};
      measures.forEach(mea => { ans[mea] = [] });
      dimensions.forEach(dim => { ans[dim] = record[dim] });
      map.set(unionKey, ans);
    }
    let ans = map.get(unionKey)!;
    measures.forEach(mea => { ans[mea].push(record) });
  }
  for (let preAggRow of map.values()) {
    measures.forEach((mea, meaIndex) => {
      console.log(preAggRow[mea], 'rows')
      const op  = getAggregator(ops[meaIndex]);
      preAggRow[mea] = op(preAggRow[mea], [mea])[mea];
    })
  }
  
  return [...map.values()];
}
export function TitanicCubeService (dimensions: string[], meaList: string[], ops: string[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      console.log('[service]', dimensions)
      const result = aggregate(
        dataSource,
        dimensions,
        meaList,
        ops
      );
      resolve(result);
      setTimeout(() => {
        resolve(result);
      }, Math.round(Math.random() * 500))
      console.log('[service]', result)
    } catch (error) {
      console.error('error occur')
      reject(error);
    }
  });
}