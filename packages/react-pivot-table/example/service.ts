import { getTitanicData } from './mock';
import { DataSource, Record } from '../src';
// import aggregate from 'cube-core';

const { dataSource, dimensions, measures } = getTitanicData();
function aggregate(dataSource: DataSource, dimensions: string[], measures: string[]): DataSource {
  let map = new Map<string, Record>();
  for (let record of dataSource) {
    let unionDims = dimensions.map(d => record[d]);
    let unionKey = unionDims.join('-');
    if (!map.has(unionKey)) {
      let ans: Record = {};
      measures.forEach(mea => { ans[mea] = 0 });
      dimensions.forEach(dim => { ans[dim] = record[dim] });
      map.set(unionKey, ans);
    }
    let ans = map.get(unionKey);
    measures.forEach(mea => { ans[mea] += record[mea] });
  }
  return [...map.values()];
}
export function TitanicCubeService (dimensions: string[], measures: string[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      // if (measures.length > 0) {
      //   const result = aggregate(
      //     dataSource,
      //     dimensions,
      //     measures,
      //   );
      //   console.log('service', dimensions, measures, result)
      //   resolve(result);
      // } else {
      //   resolve([])
      // }
      const result = aggregate(
        dataSource,
        dimensions,
        measures,
      );
      console.log('service', dimensions, measures, result)
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}