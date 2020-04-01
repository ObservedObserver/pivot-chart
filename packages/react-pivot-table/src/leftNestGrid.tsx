import React, { useMemo, ReactNodeArray, useEffect } from 'react';
import deepcopy from 'deepcopy';
import { NestTree, VisType, DimensionArea } from './common';
import { useNestTree, transTree2LeafPathList } from './utils';
import ExpandButton from './components/expandButton';
import { StyledTable } from './components/styledTable';
import { getTheme } from './theme';
const theme = getTheme();

interface LeftNestGridProps {
  data: NestTree;
  visType: VisType;
  depth: number;
  defaultExpandedDepth: number;
  onExpandChange?: (lpList: string[][]) => void;
  showAggregatedNode?: boolean
}

function dfs (tree: NestTree, defaultExpandedDepth: number, depth: number) {
  tree.expanded = (depth < defaultExpandedDepth);
  tree.path ? null : tree.path = [];
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child, index) => {
      child.path = [...tree.path || [], index]
      dfs(child, defaultExpandedDepth, depth + 1)
    })
  }
}
function tree2renderTree (tree: NestTree, defaultExpandedDepth: number) {
  let renderTree = deepcopy(tree);
  dfs(renderTree, defaultExpandedDepth, 0);
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

function dfsRender (tree: NestTree, leftRowNumber: number, rows: ReactNodeArray, showAggregatedNode: boolean, callback: (path: number[]) => void) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows.push(
      <tr key={`${tree.path.join('-')}-${tree.id}`}>
        <th
          rowSpan={getExpandedChildSize(tree)}
          onClick={() => { callback(tree.path); }}
        >
          <ExpandButton type={tree.expanded ? 'minus' : 'plus'} />&nbsp;{tree.id}
        </th>
      { showAggregatedNode && <th colSpan={leftRowNumber}>{tree.id}{theme.summary.label}</th> }
      </tr>
    );
    for (let child of tree.children) {
      dfsRender(child, leftRowNumber - 1, rows, showAggregatedNode, callback)
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
  let { data, depth, onExpandChange, visType, defaultExpandedDepth, showAggregatedNode } = props
  const { nestTree, setNestTree, repaint } = useNestTree();

  useEffect(() => {
    let newTree = tree2renderTree(data, defaultExpandedDepth);
    setNestTree(newTree);
  }, [data, defaultExpandedDepth])

  useEffect(() => {
    if (onExpandChange) {
      const lpList = transTree2LeafPathList(nestTree, showAggregatedNode);
      onExpandChange(lpList);
    }
  }, [nestTree, showAggregatedNode])

  const renderTree = useMemo<ReactNodeArray>(() => {
    let ans: ReactNodeArray = [];
    if (nestTree) {
      dfsRender(nestTree, depth, ans, showAggregatedNode, repaint);
    }
    return ans;
  }, [nestTree, repaint, showAggregatedNode])

  return <div>
    <StyledTable>
      <thead className={visType === 'number' ? undefined : 'vis'}>
        {renderTree}
      </thead>
    </StyledTable>
  </div>
}

export default LeftNestGrid;
