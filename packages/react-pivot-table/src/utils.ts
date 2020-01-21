import { useCallback, useState } from 'react';
import { NestTree, DataSource, Record } from './common';
import produce from 'immer';

export function useNestTree () {
  let [nestTree, setNestTree] = useState<NestTree>({ id: 'root', path: [] });
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
  let tree: NestTree = { id: 'root' };
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