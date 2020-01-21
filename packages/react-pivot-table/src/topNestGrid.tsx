import React, { useMemo, ReactNodeArray, useEffect, useRef } from 'react';
import deepcopy from 'deepcopy';
import styled from 'styled-components';
import { useNestTree, transTree2LeafPathList } from './utils';
import { NestTree } from './common';

const Table = styled.table`
  td {
    border: 1px solid #333;
    width: 100px;
  }
`;

interface TopNestGridProps {
  data: NestTree;
  depth: number;
  measures: string[];
  onSizeChange?: (width: number, height: number) => void;
  onExpandChange?: (lpList: string[][]) => void;
}

function dfs (tree: NestTree) {
  tree.expanded = true;
  tree.path ? null : tree.path = [];
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

function dfsRender (tree: NestTree, measures: string[], depth: number, rows: ReactNodeArray[], callback: (path: number[]) => void) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows[depth].push(<td key={`${tree.path.join('-')}-${tree.id}-total`} colSpan={measures.length} rowSpan={rows.length - depth - 1}>{tree.id}(total)</td>)
    rows[depth].push(<td key={`${tree.path.join('-')}-${tree.id}`} onClick={() => { callback(tree.path); }} colSpan={measures.length * (getExpandedChildSize(tree) - 1)}>{tree.id}</td>)
    measures.forEach(mea => {
      rows[rows.length - 1].push(<td key={`${tree.id}-${mea}`}>{mea}</td>)
    })
    for (let child of tree.children) {
      dfsRender(child, measures, depth + 1, rows, callback);
    }
  } else {
    rows[depth].push(<td key={`${tree.path.join('-')}-${tree.id}`} colSpan={measures.length} rowSpan={rows.length - depth - 1} onClick={() => { callback(tree.path); }}>{tree.id}</td>)
    measures.forEach(mea => {
      rows[rows.length - 1].push(<td key={`${tree.path.join('-')}-${tree.id}-${mea}`}>{mea}</td>)
    })
  }
}

const TopNestGrid: React.FC<TopNestGridProps> = props => {
  let { data, depth, measures, onSizeChange, onExpandChange } = props;
  const container = useRef<HTMLTableSectionElement>();
  const { nestTree, setNestTree, repaint } = useNestTree();

  useEffect(() => {
    let newTree = tree2renderTree(data);
    setNestTree(newTree);
  }, [data])

  const renderTree = useMemo<ReactNodeArray[]>(() => {
    let ans: ReactNodeArray[] = [];
    if (nestTree) {
      for (let i = 0; i <= depth + 1; i++) ans.push([]);
      dfsRender(nestTree, measures, 0, ans, repaint);
    }
    return ans;
  }, [nestTree, repaint])

  useEffect(() => {
    if (onExpandChange) {
      const lpList = transTree2LeafPathList(nestTree);
      onExpandChange(lpList);
    }
  }, [nestTree])

  useEffect(() => {
    if (onSizeChange) {
      const style = window.getComputedStyle(container.current, null);
      const width = parseInt(style.getPropertyValue('width'));
      const height = parseInt(style.getPropertyValue('height'));
      onSizeChange(width, height);
    }
  })

  return <thead ref={container} style={{ border: '1px solid #000'}}>
    {renderTree.map((row, index) => <tr key={`row-${index}`}>{row}</tr>)}
  </thead>
}

export default TopNestGrid;
