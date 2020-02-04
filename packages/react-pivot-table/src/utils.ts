import { useCallback, useState } from 'react';
import { NestTree, DataSource, Record } from './common';
import produce from 'immer';
import { momentCube } from 'cube-core/built/core';
import { Node } from 'cube-core/built/core/momentCube';
import { AggFC } from 'cube-core/built/types';
const RootName = 'ALL';
export function useNestTree () {
  let [nestTree, setNestTree] = useState<NestTree>({ id: RootName, path: [] });
  const repaint = useCallback((path: number[]) => {
    setNestTree(tree => {
      const newTree = produce(tree, draft => {
        let node = draft;
        for (let i of path) {
          node = node.children[i];
        }
        node.expanded = !node.expanded;
      })
      return newTree
    });
  }, [setNestTree]);
  return { nestTree, setNestTree, repaint }
}

export function getPureNestTree (dataSource: DataSource, dimensions: string[]) {
  let hashTree: HashTree = new Map();
  let dataLen = dataSource.length;
  for (let i = 0; i < dataLen; i++) {
    insertNode(hashTree, dimensions, dataSource[i], 0);
  }
  return transHashTree2NestTree(hashTree);
}
type HashTree = Map<string, HashTree>;

function insertNode (tree: HashTree, dimensions: string[], record: Record, depth: number) {
  if (depth === dimensions.length) {
    return;
  }
  let childKey = record[dimensions[depth]];
  if (!tree.has(childKey)) {
    tree.set(childKey, new Map())
  }
  insertNode(tree.get(childKey), dimensions, record, depth + 1);
}

function transHashTree2NestTree (hasTree: HashTree) {
  let tree: NestTree = { id: RootName };
  transHashDFS(hasTree, tree);
  return tree;
}

function transHashDFS (hashNode: HashTree, node: NestTree) {
  if (hashNode.size === 0) {
    return;
  }
  node.children = []
  for (let child of hashNode) {
    let childInNode: NestTree = { id: child[0] };
    transHashDFS(child[1], childInNode)
    node.children.push(childInNode);
  }
}

export function transTree2LeafPathList (tree: NestTree): string[][] {
  console.log('nestTree', tree)
  let lpList: string[][] = [];
  // 根左右序
  const dfs = (node: NestTree, path: string[]) => {
    lpList.push(path);
    if (node.expanded && node.children && node.children.length > 0) {
      for (let child of node.children) {
        dfs(child, [...path, child.id]);
      }
    }
  }
  dfs(tree, []);
  return lpList;
}
interface QueryNode {
  dimCode: string;
  dimValue: string
}
export type QueryPath = QueryNode[]
export function queryCube(cube: momentCube, path: QueryPath, cubeDimensions: string[], measures: string[], aggFunc: AggFC): Record {
  let tree = cube.tree;
  let queryPath: QueryPath = [];
  for (let dim of cubeDimensions) {
    let target = path.find(p => p.dimCode === dim);
    if (target) {
      queryPath.push(target)
    } else{ 
      queryPath.push({
        dimCode: dim,
        dimValue: '*'
      })
    }
  }
  let queryNodeList: Node[] = queryNode(tree, queryPath, 0);
  let subset: DataSource = [];
  for (let node of queryNodeList) {
    for (let record of node.rawData) {
      subset.push(record);
    }
  }
  // todo different handler for holistic and algebra.
  return aggFunc(subset, measures);
}

function queryNode(node: Node, path: QueryPath, depth: number): Node[] {
  if (depth >= path.length) return [];
  const targetMember = path[depth].dimValue;
  const children = [...node.children.entries()];
  if (depth === path.length - 1) {
    if (targetMember === '*') {
      return children.map(child => child[1]);
    }
    return children.filter(child => {
      return child[0] === targetMember;
    }).map(child => child[1])
  }
  let ans: Node[] = [];
  for (let child of children) {
    if (targetMember === '*' || child[0] === targetMember) {
      ans.push(...queryNode(child[1], path, depth + 1))
    }
  }
  return ans;
}

export function getCossMatrix(cube: momentCube, rowLPList: string[][] = [], columnLPList: string[][] = [], rows: string[], columns: string[], measures: string[]): Record[][] {
  const rowLen = rowLPList.length;
  const columnLen = columnLPList.length;
  const dimensions = rows.concat(columns)
  let crossMatrix: Array<Array<Record>> = [];
  function getCell (node: Node, path: string[], depth: number): Record {
    if (typeof node === 'undefined') return null;
    if (depth === path.length) {
      return node._aggData;
    }
    return getCell(node.children.get(path[depth]), path, depth + 1);
  }
  for (let i = 0; i < rowLen; i++) {
    crossMatrix.push([])
    for (let j = 0; j < columnLen; j++) {
      let path: QueryPath = [
        ...rowLPList[i].map((d, i) => ({
          dimCode: rows[i],
          dimValue: d
        })),
        ...columnLPList[j].map((d, i) => ({
          dimCode: columns[i],
          dimValue: d
        }))
      ]
      let result = queryCube(cube, path, dimensions, measures, cube.aggFunc);
      crossMatrix[i].push(result);
    }
  }
  return crossMatrix;
}
