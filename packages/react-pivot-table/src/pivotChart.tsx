import React, { useMemo, useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Field, Measure, VisType } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import { getPureNestTree, getCossMatrix, getNestFields } from './utils';
import { StyledTable, TABLE_BG_COLOR, TABLE_BORDER_COLOR } from './components/styledTable';


interface PivotChartProps {
  dataSource: DataSource;
  rows: Field[];
  columns: Field[];
  measures: Measure[];
  visType?: VisType;
  defaultExpandedDepth?: {
    rowDepth: number;
    columnDepth: number;
  }
}
function useMetaTransform(rowList: Field[], columnList: Field[], measureList: Field[]) {
  const rows = useMemo<string[]>(() => rowList.map(f => f.id), [rowList])
  const columns = useMemo<string[]>(() => columnList.map(f => f.id), [columnList])
  const measures = useMemo<string[]>(() => measureList.map(f => f.id), [measureList])
  return { rows, columns, measures }
}
const PivotChart: React.FC<PivotChartProps> = props => {
  const {
    rows: rowList = [],
    columns: columnList = [],
    measures: measureList = [],
    dataSource = [],
    visType = 'number',
    defaultExpandedDepth = {
      rowDepth: 0,
      columnDepth: 1
    }
  } = props;
  const {
    rowDepth: defaultRowDepth = 1,
    columnDepth: defaultColumnDepth = 1
  } = defaultExpandedDepth;
  const cubeRef = useRef<momentCube>();
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
    cubeRef.current = createCube({
      type: 'moment',
      factTable: dataSource,
      dimensions: [...rows, ...columns],
      measures,
      aggFunc: sum
    }) as momentCube;
  }, [dataSource, rows, columns, measures])

  // {rows, columns, dimsInVis} = getNestDimensions(visType)
  // getCell(path.concat(dimsInVis))
  const measuresInView = useMemo<string[]>(() => {
    return viewMeasures.map(m => m.id);
  }, [viewMeasures])
  const measuresInFacet = useMemo<string[]>(() => {
    return facetMeasures.map(m => m.id);
  }, [facetMeasures])
  const leftNestTree = useMemo<NestTree>(() => {
    return getPureNestTree(dataSource, nestRows);
  }, [dataSource, nestRows]);
  const topNestTree = useMemo<NestTree>(() => {
    return getPureNestTree(dataSource, nestColumns);
  }, [dataSource, nestColumns]);

  const crossMatrix = useMemo(() => {
    return getCossMatrix(visType, cubeRef.current, rowLPList, columnLPList, rows, columns, measureList, dimensionsInView);
  }, [dataSource, rows, columns, measures, rowLPList, columnLPList, visType])
  
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

export default PivotChart;
