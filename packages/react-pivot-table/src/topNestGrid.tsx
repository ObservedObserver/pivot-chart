import React, { useMemo, ReactNodeArray, useEffect } from 'react';
import deepcopy from 'deepcopy';
import styled from 'styled-components';
import { useNestTree } from './utils';
import { NestTree } from './common';

const Table = styled.table`
 td{
  border: 1px solid #333;
 }
`

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

function dfsRender (tree: NestTree, depth: number, rows: ReactNodeArray[], callback: (path: number[]) => void) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows[depth].push(<td key={`${tree.id}-total`} rowSpan={rows.length - depth}>{tree.id}(total)</td>)
    rows[depth].push(<td key={tree.id} onClick={() => { callback(tree.path); }} colSpan={getExpandedChildSize(tree) - 1}>{tree.id}</td>)
    for (let child of tree.children) {
      dfsRender(child, depth + 1, rows, callback);
    }
  } else {
    rows[depth].push(<td key={tree.id} rowSpan={rows.length - depth} onClick={() => { callback(tree.path); }}>{tree.id}</td>)
  }
}

const TopNestGrid: React.FC<LeftNestGridProps> = props => {
  let { data, depth } = props;
  const { nestTree, setNestTree, repaint } = useNestTree();

  useEffect(() => {
    let newTree = tree2renderTree(data);
    setNestTree(newTree);
  }, [data])

  const renderTree = useMemo<ReactNodeArray[]>(() => {
    let ans: ReactNodeArray[] = [];
    if (nestTree) {
      for (let i = 0; i < depth; i++) ans.push([]);
      dfsRender(nestTree, 0, ans, repaint);
    }
    return ans;
  }, [nestTree, repaint])

  return <div>
    <Table style={{ border: '1px solid #000'}}>
      <thead>
        {renderTree.map((row, index) => <tr key={`row-${index}`}>{row}</tr>)}
      </thead>
    </Table>
  </div>
}

export default TopNestGrid;
