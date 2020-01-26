import React, { useMemo, ReactNodeArray, useEffect } from 'react';
import deepcopy from 'deepcopy';
import styled from 'styled-components';
import { NestTree } from './common';
import { useNestTree, transTree2LeafPathList } from './utils';
import ExpandButton from './components/expandButton';
import { StyledTable } from './components/styledTable';

interface LeftNestGridProps {
  data: NestTree;
  depth: number;
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

function dfsRender (tree: NestTree, leftRowNumber: number, rows: ReactNodeArray, callback: (path: number[]) => void) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows.push(
      <tr key={`${tree.path.join('-')}-${tree.id}`}>
        <th
          rowSpan={getExpandedChildSize(tree)}
          onClick={() => { callback(tree.path); }}
        >
          <ExpandButton type={tree.expanded ? 'minus' : 'plus'} />&nbsp;{tree.id}
        </th>
        <th colSpan={leftRowNumber}>{tree.id}(total)</th>
      </tr>
    );
    for (let child of tree.children) {
      dfsRender(child, leftRowNumber - 1, rows, callback)
    }
  } else {
    rows.push(
      <tr key={`${tree.path.join("-")}-${tree.id}`}>
        <th
          colSpan={leftRowNumber + 1}
          onClick={() => {
            callback(tree.path);
          }}
        >
          { tree.children && tree.children.length > 0 && <ExpandButton type={tree.expanded ? 'minus' : 'plus'} /> }
          &nbsp;{tree.id}
        </th>
      </tr>
    );
  } 
}

const LeftNestGrid: React.FC<LeftNestGridProps> = props => {
  let { data, depth, onExpandChange } = props
  const { nestTree, setNestTree, repaint } = useNestTree();

  useEffect(() => {
    let newTree = tree2renderTree(data);
    setNestTree(newTree);
  }, [data])

  useEffect(() => {
    if (onExpandChange) {
      const lpList = transTree2LeafPathList(nestTree);
      onExpandChange(lpList);
    }
  }, [nestTree])

  const renderTree = useMemo<ReactNodeArray>(() => {
    let ans: ReactNodeArray = [];
    if (nestTree) {
      dfsRender(nestTree, depth, ans, repaint);
    }
    return ans;
  }, [nestTree, repaint])

  return <div>
    <StyledTable>
      <thead>
        {renderTree}
      </thead>
    </StyledTable>
  </div>
}

export default LeftNestGrid;
