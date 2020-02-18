import React, { useMemo, useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Field, Measure, VisType, Record, Filter } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import {
  getPureNestTree,
  getCossMatrix,
  useNestFields,
  QueryPath,
  AsyncCacheCube,
  queryCube,
  cmpFunc
} from "./utils";
import { StyledTable } from './components/styledTable';
import { getTheme } from './theme';

const theme = getTheme();


interface AsyncPivotChartProps {
  rows: Field[];
  columns: Field[];
  measures: Measure[];
  visType?: VisType;
  defaultExpandedDepth?: {
    rowDepth: number;
    columnDepth: number;
  };
  async?: boolean;
  cubeQuery: (path: QueryPath, measures: string[]) => Promise<DataSource>;
  branchFilters?: Filter[];
  dimensionCompare?: cmpFunc
}
function useMetaTransform(rowList: Field[], columnList: Field[], measureList: Field[]) {
  const rows = useMemo<string[]>(() => rowList.map(f => f.id), [rowList])
  const columns = useMemo<string[]>(() => columnList.map(f => f.id), [columnList])
  const measures = useMemo<string[]>(() => measureList.map(f => f.id), [measureList])
  return { rows, columns, measures }
}
const AsyncPivotChart: React.FC<AsyncPivotChartProps> = props => {
  const {
    rows: rowList = [],
    columns: columnList = [],
    measures: measureList = [],
    visType = 'number',
    defaultExpandedDepth = {
      rowDepth: 0,
      columnDepth: 1
    },
    async,
    cubeQuery,
    branchFilters,
    dimensionCompare
  } = props;
  const {
    rowDepth: defaultRowDepth = 1,
    columnDepth: defaultColumnDepth = 1
  } = defaultExpandedDepth;
  const asyncCubeRef = useRef<AsyncCacheCube>();
  const [emptyGridHeight, setEmptyGridHeight] = useState<number>(0);
  const [rowLPList, setRowLPList] = useState<string[][]>([]);
  const [columnLPList, setColumnLPList] = useState<string[][]>([]);
  const [leftNestTree, setLeftNestTree] = useState<NestTree>({ id: 'root' });
  const [topNestTree, setTopNestTree] = useState<NestTree>({ id: 'root' });
  const [crossMatrix, setCrossMatrix] = useState<Record[][] | Record[][][]>([]);
  const { rows, columns, measures } = useMetaTransform(rowList, columnList, measureList);

  const {
    nestRows,
    nestColumns,
    dimensionsInView,
    facetMeasures,
    viewMeasures
  } = useNestFields(visType, rows, columns, measureList);

  useEffect(() => {
    asyncCubeRef.current = new AsyncCacheCube({
      asyncCubeQuery: cubeQuery,
      cmp: dimensionCompare
    })
  }, [cubeQuery, dimensionCompare])

  useEffect(() => {
    asyncCubeRef.current.getCuboidNestTree(nestRows, branchFilters).then(tree => {
      setLeftNestTree(tree);
    })
  }, [nestRows, branchFilters]);
  useEffect(() => {
    asyncCubeRef.current.getCuboidNestTree(nestColumns, branchFilters).then(tree => {
      setTopNestTree(tree);
    })
  }, [nestColumns, branchFilters]);

  useEffect(() => {
    asyncCubeRef.current.requestCossMatrix(visType, rowLPList, columnLPList, rows, columns, measureList, dimensionsInView).then(matrix => {
      setCrossMatrix(matrix);
    })
  }, [rows, columns, measures, rowLPList, columnLPList, visType, dimensionsInView, measureList])
  return (
    <div
      style={{ border: `1px solid ${theme.table.borderColor}`, overflowX: "auto" }}
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
            onExpandChange={lpList => {
              setRowLPList(lpList);
            }}
          />
        </div>
        <StyledTable>
          <TopNestGrid
            defaultExpandedDepth={defaultColumnDepth}
            depth={nestColumns.length}
            measures={measureList}
            data={topNestTree}
            onSizeChange={(w, h) => {
              setEmptyGridHeight(h);
            }}
            onExpandChange={lpList => {
              setColumnLPList(lpList);
            }}
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
