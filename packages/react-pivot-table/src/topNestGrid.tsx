import React, { useMemo, ReactNodeArray, useEffect, useRef } from "react";
import deepcopy from "deepcopy";
import { useNestTree, transTree2LeafPathList, labelHighlightNode, clearHighlight } from "./utils";
import { NestTree, Measure } from "./common";
import ExpandButton from "./components/expandButton";
import { getTheme } from "./theme";

const theme = getTheme();

interface TopNestGridProps {
  data: NestTree;
  depth: number;
  measures: Measure[];
  onSizeChange?: (width: number, height: number) => void;
  onExpandChange?: (lpList: string[][], nestTree: NestTree) => void;
  defaultExpandedDepth: number;
  showAggregatedNode?: boolean;
  highlightPathList?: any[][];
}

function dfs(tree: NestTree, defaultExpandedDepth: number, depth: number) {
  tree.expanded = (depth < defaultExpandedDepth);
  tree.isHighlight = false;
  tree.path ? null : (tree.path = []);
  tree.valuePath ? null : tree.valuePath = [];
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child, index) => {
      child.path = [...(tree.path || []), index];
      child.valuePath = [...(tree.valuePath || []), index]
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
  measures: Measure[],
  depth: number,
  rows: ReactNodeArray[],
  showAggregatedNode: boolean,
  callback: (path: number[]) => void
) {
  if (tree.expanded && tree.children && tree.children.length > 0) {
    if (showAggregatedNode) {
      rows[depth].push(
        <th
          key={`${tree.path.join("-")}-${tree.id}-total`}
          colSpan={measures.length}
          rowSpan={rows.length - depth - 1}
        >
          {tree.id}{theme.summary.label}
        </th>
      );
      measures.forEach(mea => {
        rows[rows.length - 1].push(<th key={`${tree.path.join("-")}-${tree.id}-${mea.id}`} style={{ minWidth: `${mea.minWidth}px` }}>{mea.name}</th>);
      });
    }
    
    rows[depth].push(
      <th
        key={`${tree.path.join("-")}-${tree.id}`}
        onClick={() => {
          callback(tree.path);
        }}
        colSpan={(measures.length || 1) * (getExpandedChildSize(tree) - 1)}
        className={tree.isHighlight ? 'highlight' : undefined}
      >
        <ExpandButton type={tree.expanded ? "minus" : "plus"} />
        &nbsp;
        {tree.id}
      </th>
    );
    for (let child of tree.children) {
      dfsRender(child, measures, depth + 1, rows, showAggregatedNode, callback);
    }
  } else {
    rows[depth].push(
      <th
        key={`${tree.path.join("-")}-${tree.id}`}
        colSpan={(measures.length || 1) * getExpandedChildSize(tree)}
        rowSpan={rows.length - depth - 1}
        onClick={() => {
          callback(tree.path);
        }}
        className={tree.isHighlight ? 'highlight' : undefined}
      >
        { tree.children && tree.children.length > 0 && <ExpandButton type={tree.expanded ? 'minus' : 'plus'} /> }
        &nbsp;{tree.id}
      </th>
    );
    measures.forEach(mea => {
      rows[rows.length - 1].push(
        <th key={`${tree.path.join("-")}-${tree.id}-${mea.id}`} style={{ minWidth: `${mea.minWidth}px` }}>{mea.name}</th>
      );
    });
  }
}

const TopNestGrid: React.FC<TopNestGridProps> = props => {
  let {
    data,
    depth,
    measures,
    onSizeChange,
    onExpandChange,
    defaultExpandedDepth,
    showAggregatedNode,
    highlightPathList = []
  } = props;
  const container = useRef<HTMLTableSectionElement>();
  const { nestTree, setNestTree, repaint } = useNestTree();
  useEffect(() => {
    let newTree = tree2renderTree(data, defaultExpandedDepth);
    setNestTree(newTree);
  }, [data, defaultExpandedDepth]);

  const renderTree = useMemo<ReactNodeArray[]>(() => {
    let ans: ReactNodeArray[] = [];
    if (nestTree) {
      clearHighlight(nestTree);
      highlightPathList.forEach((path) => {
        labelHighlightNode(nestTree, [], path, 0);
      });
      for (let i = 0; i <= depth + 1; i++) ans.push([]);
      // todo: bad side effect will change nestTree
      dfsRender(nestTree, measures, 0, ans, showAggregatedNode, repaint);
    }
    return ans;
  }, [nestTree, repaint, measures, showAggregatedNode, highlightPathList]);

  useEffect(() => {
    if (onExpandChange) {
      const lpList = transTree2LeafPathList(nestTree, showAggregatedNode);
      onExpandChange(lpList, nestTree);
    }
    // measures caused by side effect of dfsRender.
  }, [nestTree, measures, showAggregatedNode]);

  useEffect(() => {
    if (onSizeChange) {
      const width = container.current.offsetWidth;
      const height = container.current.offsetHeight;
      onSizeChange(width, height);
    }
  });

  return (
    <thead ref={container} style={{ border: "1px solid #000" }}>
      {renderTree.map((row, index) => (
        <tr key={`row-${index}`}>{row}</tr>
      ))}
    </thead>
  );
};

export default TopNestGrid;
