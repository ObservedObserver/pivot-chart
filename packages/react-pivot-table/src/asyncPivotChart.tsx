import React, { useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Record, Filter, DimensionArea, PivotBaseProps, Measure } from './common';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import {
  useNestFields,
  QueryPath,
  AsyncCacheCube,
  cmpFunc
} from "./utils";
import { StyledTable } from './components/styledTable';
import { getTheme } from './theme';

const theme = getTheme();


interface AsyncPivotChartProps extends PivotBaseProps {
  cubeQuery: (path: QueryPath, measures: string[]) => Promise<DataSource>;
  branchFilters?: Filter[];
  dimensionCompare?: cmpFunc;
  onNestTreeChange?: (leftTree: NestTree, topTree: NestTree) => void;
  cubeRef?: { current: AsyncCacheCube | undefined };
  highlightPathList?: any[][];
}

const AsyncPivotChart: React.FC<AsyncPivotChartProps> = props => {
  const {
    rows = [],
    columns = [],
    measures = [],
    visType = 'number',
    defaultExpandedDepth = {
      rowDepth: 0,
      columnDepth: 1
    },
    cubeQuery,
    branchFilters,
    dimensionCompare,
    showAggregatedNode = {
      [DimensionArea.row]: true,
      [DimensionArea.column]: true
    },
    onNestTreeChange,
    cubeRef,
    highlightPathList = []
  } = props;
  const {
    rowDepth: defaultRowDepth = 1,
    columnDepth: defaultColumnDepth = 1
  } = defaultExpandedDepth;
  const asyncCubeRef = useRef<AsyncCacheCube>();
  // todo: use rxjs to handle complex async request problem
  const requestIndex = useRef<{left: number;top: number; matrix: number}>({
    left: 0,
    top: 0,
    matrix: 0
  });
  const bothUpdateFlag = useRef<{
    left: boolean;
    top: boolean;
    leftCache: string[][];
    topCache: string[][]
  }>({
    left: true,
    top: true,
    leftCache: [],
    topCache: []
  });
  const [emptyGridHeight, setEmptyGridHeight] = useState<number>(0);
  const [rowLPList, setRowLPList] = useState<string[][]>([]);
  const [columnLPList, setColumnLPList] = useState<string[][]>([]);
  const [leftNestTree, setLeftNestTree] = useState<NestTree>({ id: 'root' });
  const [topNestTree, setTopNestTree] = useState<NestTree>({ id: 'root' });
  const [crossMatrix, setCrossMatrix] = useState<Record[][] | Record[][][]>([]);
  const expandedNestTrees = useRef<{left: NestTree; top: NestTree}>({ left: null, top: null });

  const {
    nestRows,
    nestColumns,
    dimensionsInView,
    facetMeasures,
    viewMeasures
  } = useNestFields(visType, rows, columns, measures);
  useEffect(() => {
    asyncCubeRef.current = new AsyncCacheCube({
      asyncCubeQuery: cubeQuery,
      cmp: dimensionCompare
    })
    if (cubeRef) {
      cubeRef.current = asyncCubeRef.current
    }
  }, [cubeQuery, dimensionCompare])

  useEffect(() => {
    requestIndex.current.left++;
    requestIndex.current.top++;
    let topId = requestIndex.current.top;
    let leftId = requestIndex.current.left;
    Promise.all([
      asyncCubeRef.current.getCuboidNestTree(nestRows, branchFilters),
      asyncCubeRef.current.getCuboidNestTree(nestColumns, branchFilters)
    ]).then(trees => {
      const [leftTree, topTree] = trees;
      bothUpdateFlag.current.left = false;
      bothUpdateFlag.current.top = false;
      if (leftId === requestIndex.current.left) {
        setLeftNestTree(leftTree);
      }
      if (topId === requestIndex.current.top) {
        setTopNestTree(topTree);
      }
    });
  }, [nestRows, nestColumns, branchFilters]);

  useEffect(() => {
    if (bothUpdateFlag.current.left && bothUpdateFlag.current.top) {
      requestIndex.current.matrix++;
      let id = requestIndex.current.matrix;
      asyncCubeRef.current.requestCossMatrix(visType, bothUpdateFlag.current.leftCache, bothUpdateFlag.current.topCache, rows, columns, measures, dimensionsInView).then(matrix => {
        if (requestIndex.current.matrix === id) {
          setCrossMatrix(matrix);
          if (onNestTreeChange && expandedNestTrees.current.left && expandedNestTrees.current.top) {
            onNestTreeChange(expandedNestTrees.current.left, expandedNestTrees.current.top);
          }
        }
      })
    }
  }, [measures, rowLPList, columnLPList, visType])
  return (
    <div
      style={{ border: `1px solid ${theme.table.borderColor}`, overflow: 'auto' }}
    >
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <div>
          <div
            style={{ height: emptyGridHeight, backgroundColor: theme.table.thead.backgroundColor }}
          ></div>
          <LeftNestGrid
            defaultExpandedDepth={defaultRowDepth}
            visType={visType}
            depth={nestRows.length}
            data={leftNestTree}
            onExpandChange={(lpList, tree) => {
              bothUpdateFlag.current.left = true;
              bothUpdateFlag.current.leftCache = lpList;
              setRowLPList(lpList);
              expandedNestTrees.current.left = tree;
            }}
            showAggregatedNode={showAggregatedNode.row}
            highlightPathList={highlightPathList}
          />
        </div>
        <StyledTable>
          <TopNestGrid
            defaultExpandedDepth={defaultColumnDepth}
            depth={nestColumns.length}
            measures={measures}
            data={topNestTree}
            onSizeChange={(w, h) => {
              setEmptyGridHeight(h);
            }}
            onExpandChange={(lpList, tree) => {
              bothUpdateFlag.current.top = true;
              bothUpdateFlag.current.topCache = lpList;
              setColumnLPList(lpList);
              expandedNestTrees.current.top = tree;
            }}
            showAggregatedNode={showAggregatedNode.column}
            highlightPathList={highlightPathList}
          />
          <CrossTable
            visType={visType}
            matrix={crossMatrix}
            measures={facetMeasures}
            dimensionsInView={dimensionsInView}
            measuresInView={viewMeasures}
          />
        </StyledTable>
      </div>
    </div>
  );
}

export default AsyncPivotChart;
