import React, { useMemo, ReactNodeArray, ReactElement } from 'react';
import deepcopy from 'deepcopy';
import styled from 'styled-components';

const Table = styled.table`
 td{
  border: 1px solid #333;
 }
`
export interface NestTree {
  id: string;
  children?: NestTree[];
  expanded?: boolean;
}

interface LeftNestGridProps {
  data: NestTree;
  depth: number;
}
function dfs (tree: NestTree) {
  tree.expanded = true;
  if (tree.children && tree.children.length > 0) {
    for (let child of tree.children) {
      dfs(child)
    }
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

function dfsRender (tree: NestTree, depth: number, rows: ReactNodeArray[]) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows[depth].push(<td rowSpan={rows.length - depth}>{tree.id}(total)</td>)
    rows[depth].push(<td colSpan={getExpandedChildSize(tree) - 1}>{tree.id}</td>)
    for (let child of tree.children) {
      dfsRender(child, depth + 1, rows);
    }
  } else {
    rows[depth].push(<td>{tree.id}</td>)
  }
}

const LeftNestGrid: React.FC<LeftNestGridProps> = props => {
  let { data, depth } = props
  const renderTree = useMemo<ReactNodeArray>(() => {
    let newTree = tree2renderTree(data);
    let ans: ReactNodeArray[] = [];
    for (let i = 0; i < depth; i++) ans.push([]);
    dfsRender(newTree, 0, ans);
    return ans;
  }, [data])

  return <div>
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
    <Table style={{ border: '1px solid #000'}}>
      {renderTree.map(row => <tr>{row}</tr>)}
    </Table>
    
  </div>
}

export default LeftNestGrid;
