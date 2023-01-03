import React, { useMemo, useEffect, ReactNode } from "react";
import deepcopy from "deepcopy";
import { NestTree, VisType, DimensionArea } from "./common";
import { useNestTree, transTree2LeafPathList, labelHighlightNode, clearHighlight } from "./utils";
import ExpandButton from "./components/expandButton";
import { StyledTable } from "./components/styledTable";
import { getTheme } from "./theme";
const theme = getTheme();

interface LeftNestGridProps {
  data: NestTree;
  visType: VisType;
  depth: number;
  defaultExpandedDepth: number;
  onExpandChange?: (lpList: string[][], nestTree: NestTree) => void;
  showAggregatedNode?: boolean;
  highlightPathList?: any[][];
}

function dfs(tree: NestTree, defaultExpandedDepth: number, depth: number) {
  tree.expanded = depth < defaultExpandedDepth;
  tree.isHighlight = false;
  tree.path ? null : (tree.path = []);
  tree.valuePath ? null : (tree.valuePath = []);
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child, index) => {
      child.path = [...(tree.path || []), index];
      child.valuePath = [...(tree.valuePath || []), index];
      dfs(child, defaultExpandedDepth, depth + 1);
    });
  }
}
function tree2renderTree(tree: NestTree, defaultExpandedDepth: number) {
  let renderTree = deepcopy(tree);
  dfs(renderTree, defaultExpandedDepth, 0);
  return renderTree;
}

function getExpandedChildSize(tree: NestTree): number {
  // todo: cache
  let size = 1;
  if (tree.expanded && tree.children && tree.children.length > 0) {
    for (let child of tree.children) {
      size += getExpandedChildSize(child);
    }
  }
  return size;
}

function dfsRender(
  tree: NestTree,
  leftRowNumber: number,
  rows: ReactNode[],
  showAggregatedNode: boolean,
  callback: (path: number[]) => void
) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    rows.push(
      <tr key={`${tree.path.join("-")}-${tree.id}`}>
        <th
          className={tree.isHighlight ? "highlight" : undefined}
          rowSpan={getExpandedChildSize(tree)}
          onClick={() => {
            callback(tree.path);
          }}
        >
          <ExpandButton type={tree.expanded ? "minus" : "plus"} />
          &nbsp;{tree.id}
        </th>
        {showAggregatedNode && (
          <th colSpan={leftRowNumber}>
            {tree.id}
            {theme.summary.label}
          </th>
        )}
      </tr>
    );
    for (let child of tree.children) {
      dfsRender(child, leftRowNumber - 1, rows, showAggregatedNode, callback);
    }
  } else {
    rows.push(
      <tr key={`${tree.path.join("-")}-${tree.id}`}>
        <th
          className={tree.isHighlight ? "highlight" : undefined}
          colSpan={leftRowNumber + 1}
          onClick={() => {
            callback(tree.path);
          }}
        >
          {tree.children && tree.children.length > 0 && (
            <ExpandButton type={tree.expanded ? "minus" : "plus"} />
          )}
          &nbsp;{tree.id}
        </th>
      </tr>
    );
  }
}

const LeftNestGrid: React.FC<LeftNestGridProps> = (props) => {
  let {
    data,
    depth,
    onExpandChange,
    visType,
    defaultExpandedDepth,
    showAggregatedNode,
    highlightPathList = []
  } = props;
  const { nestTree, setNestTree, repaint } = useNestTree();

  useEffect(() => {
    let newTree = tree2renderTree(data, defaultExpandedDepth);
    setNestTree(newTree);
  }, [data, defaultExpandedDepth]);

  useEffect(() => {
    if (onExpandChange) {
      const lpList = transTree2LeafPathList(nestTree, showAggregatedNode);
      onExpandChange(lpList, nestTree);
    }
  }, [nestTree, showAggregatedNode]);

  const renderTree = useMemo<ReactNode[]>(() => {
    let ans: ReactNode[] = [];
    if (nestTree) {
      clearHighlight(nestTree);
      highlightPathList.forEach((path) => {
        labelHighlightNode(nestTree, [], path, 0);
      });
      dfsRender(nestTree, depth, ans, showAggregatedNode, repaint);
    }
    return ans;
  }, [nestTree, repaint, showAggregatedNode, highlightPathList]);

  return (
    <div>
      <StyledTable>
        <thead className={visType === "number" ? undefined : "vis"}>
          {renderTree}
        </thead>
      </StyledTable>
    </div>
  );
};

export default LeftNestGrid;
