import { useCallback, useState } from 'react';
import { NestTree } from './common';
import produce from 'immer';

export function useNestTree () {
  let [nestTree, setNestTree] = useState<NestTree>();
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