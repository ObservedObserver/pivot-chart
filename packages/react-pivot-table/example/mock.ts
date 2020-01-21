import { DataSource, Record } from "../src/common";
import titanic from './titanic.json';

interface DataDemo {
  dataSource: DataSource;
  dimensions: string[];
  measures: string[];
}

export function getTitanicData () {
  const { dataSource, config } = titanic;
  const { Dimensions: dimensions, Measures: measures } = config;
  return {
    dataSource,
    dimensions,
    measures
  }
}

export function mockData(): DataDemo {
  let size = 100;
  let dimensions = ['Sex', 'Place', 'Date'];
  let measures = ['slaes', 'rate', 'mean'];
  let ans: DataSource = []
  for (let i = 0; i < size; i++) {
    let record: Record = {};
    dimensions.forEach(d => record[d] = Math.random().toFixed(0))
    measures.forEach(d => record[d] = Math.random())
    ans.push(record);
  }
  return {
    dataSource: ans,
    dimensions,
    measures
  };
}

interface TreeData {
  id: string;
  [key: string]: any;
  children?: TreeData[];
}

export function mockTreeData (depth: number = 3): TreeData {
  let data: TreeData = {
    id: 'root'
  };
  let nodeIndex = 0;
  const dfs = (node: TreeData, d: number) => {
    if (d < depth - 1) {
      let childrenSize = 1 + Math.round(Math.random() * 3);
      if (childrenSize > 0) {
        node.children = [];
        for (let i = 0; i < childrenSize; i++) {
          node.children.push({
            id: `level(${d})-node(${nodeIndex++})`//'node' + nodeIndex++
          })
        }
        for (let i = 0; i < childrenSize; i++) {
          dfs(node.children[i], d + 1);
        }
      }
    }
  }
  dfs(data, 0);
  return data;
}