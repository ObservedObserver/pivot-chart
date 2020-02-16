import React, { useMemo, useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Field, Measure, VisType, Record } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import { getPureNestTree, getCossMatrix, getNestFields, QueryPath, AsyncCacheCube, queryCube } from './utils';
import { StyledTable, TABLE_BG_COLOR, TABLE_BORDER_COLOR } from './components/styledTable';


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
  cubeQuery: (path: QueryPath) => Promise<DataSource>;
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
    cubeQuery
  } = props;
  const {
    rowDepth: defaultRowDepth = 1,
    columnDepth: defaultColumnDepth = 1
  } = defaultExpandedDepth;
  const cubeRef = useRef<momentCube>();
  const asyncCubeRef = useRef<AsyncCacheCube>();
  const [emptyGridHeight, setEmptyGridHeight] = useState<number>(0);
  const [rowLPList, setRowLPList] = useState<string[][]>([]);
  const [columnLPList, setColumnLPList] = useState<string[][]>([]);
  const { rows, columns, measures } = useMetaTransform(rowList, columnList, measureList);
  const {
    nestRows,
    nestColumns,
    dimensionsInView,
    facetMeasures,
    viewMeasures
  } = useMemo(() => {
    return getNestFields(visType, rows, columns, measureList)
  }, [rows, columns, measureList, visType]);

  useEffect(() => {
    const dimensions = [...rows, ...columns];
    asyncCubeRef.current = new AsyncCacheCube({
      dimensions: dimensions,
      asyncCubeQuery: cubeQuery
      // test
      // asyncCubeQuery: async (path) => {
      //   return queryCube(cubeRef.current, path, dimensions)
      // }
    })
  }, [rows, columns, measures])

  // {rows, columns, dimsInVis} = getNestDimensions(visType)
  // getCell(path.concat(dimsInVis))
  const measuresInView = useMemo<string[]>(() => {
    return viewMeasures.map(m => m.id);
  }, [viewMeasures])
  const measuresInFacet = useMemo<string[]>(() => {
    return facetMeasures.map(m => m.id);
  }, [facetMeasures])
  const [leftNestTree, setLeftNestTree] = useState<NestTree>({ id: 'root' });
  const [topNestTree, setTopNestTree] = useState<NestTree>({ id: 'root' });
  useEffect(() => {
    asyncCubeRef.current.getCuboidNestTree(nestRows).then(tree => {
      console.log('nest callback tree', tree)
      setLeftNestTree(tree);
    })
  }, [nestRows]);
  useEffect(() => {
    asyncCubeRef.current.getCuboidNestTree(nestColumns).then(tree => {
      setTopNestTree(tree);
    })
  }, [nestColumns]);
  console.log('nestTree', leftNestTree, topNestTree)
  // const topNestTree = useMemo<NestTree>(() => {
  //   // return getPureNestTree(dataSource, nestColumns);
  // }, [nestColumns]);

  // const crossMatrix = useMemo(() => {
  //   return getCossMatrix(visType, cubeRef.current, rowLPList, columnLPList, rows, columns, measureList, dimensionsInView);
  // }, [dataSource, rows, columns, measures, rowLPList, columnLPList, visType])
  const [crossMatrix, setCrossMatrix] = useState<Record[][] | Record[][][]>([]);
  useEffect(() => {
    asyncCubeRef.current.requestCossMatrix(visType, rowLPList, columnLPList, rows, columns, measureList, dimensionsInView).then(matrix => {
      setCrossMatrix(matrix);
    })
  }, [rows, columns, measures, rowLPList, columnLPList, visType])
  console.log(asyncCubeRef.current)
  return (
    <div
      style={{ border: `1px solid ${TABLE_BORDER_COLOR}`, overflowX: "auto" }}
    >
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <div>
          <div
            style={{ height: emptyGridHeight, backgroundColor: TABLE_BG_COLOR }}
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
            measures={measures}
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
            measures={measuresInFacet}
            dimensionsInView={dimensionsInView}
            measuresInView={measuresInView}
          />
        </StyledTable>
      </div>
    </div>
  );
}

export default AsyncPivotChart;
