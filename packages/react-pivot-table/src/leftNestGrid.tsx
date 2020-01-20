import React, { useMemo, ReactNodeArray, ReactElement, useState, useEffect, useCallback } from 'react';
import deepcopy from 'deepcopy';
import styled from 'styled-components';
import produce from 'immer';

const Table = styled.table`
 td{
  border: 1px solid #333;
 }
`
export interface NestTree {
  id: string;
  children?: NestTree[];
  expanded?: boolean;
  path?: number[]
}

interface LeftNestGridProps {
  data: NestTree;
  depth: number;
}
function dfs (tree: NestTree) {
  tree.expanded = true;
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child, index) => {
      child.path = [...tree.path || [], index]
      dfs(child)
    })
  }
}
function tree2renderTree (tree: NestTree) {
  let renderTree = deepcopy(tree);
  dfs(renderTree);
  return renderTree;
}

function getExpandedChildSize (tree: NestTree): number {
  // todo: cache
  let size = 1;
  if (tree.expanded && tree.children && tree.children.length > 0) {
    for (let child of tree.children) {
      size += getExpandedChildSize(child);
    }
  }
  return size;
}

function dfsRender (tree: NestTree, leftRowNumber: number, rows: ReactNodeArray, callback: (path: number[]) => void) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows.push(
      <tr>
        <td
          rowSpan={getExpandedChildSize(tree)}
          onClick={() => { callback(tree.path); }}
        >
          {tree.id}
        </td>
        <td colSpan={leftRowNumber}>{tree.id}(total)</td>
      </tr>
    );
    for (let child of tree.children) {
      dfsRender(child, leftRowNumber - 1, rows, callback)
    }
  } else {
    rows.push(<tr><td colSpan={leftRowNumber} onClick={() => { callback(tree.path); }}>{tree.id}</td></tr>)
  } 
}

const LeftNestGrid: React.FC<LeftNestGridProps> = props => {
  let { data, depth } = props
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
  useEffect(() => {
    let newTree = tree2renderTree(data);
    setNestTree(newTree);
  }, [data])
  const renderTree = useMemo<ReactNodeArray>(() => {
    let ans: ReactNodeArray = [];
    if (nestTree) {
      dfsRender(nestTree, depth, ans, repaint);
    }

    return ans;
  }, [nestTree, repaint])

  return <div>
    <pre>
      {JSON.stringify(nestTree, null, 2)}
    </pre>
    <Table style={{ border: '1px solid #000'}}>
      {renderTree}
    </Table>
    
  </div>
}

export default LeftNestGrid;
