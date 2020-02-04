import React, { useMemo, useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Field, Measure } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import { setAutoFreeze } from 'immer';
import { getPureNestTree, getCossMatrix } from './utils';
import { StyledTable, TABLE_BG_COLOR, TABLE_BORDER_COLOR } from './components/styledTable';

setAutoFreeze(false);

interface MagicCubeProps {
  dataSource: DataSource;
  rows: Field[];
  columns: Field[];
  measures: Measure[];
}
function useMetaTransform(rowList: Field[], columnList: Field[], measureList: Field[]) {
  const rows = useMemo<string[]>(() => rowList.map(f => f.id), [rowList])
  const columns = useMemo<string[]>(() => columnList.map(f => f.id), [columnList])
  const measures = useMemo<string[]>(() => measureList.map(f => f.id), [measureList])
  return { rows, columns, measures }
}
const MagicCube: React.FC<MagicCubeProps> = props => {
  const {
    rows: rowList = [],
    columns: columnList = [],
    measures: measureList = [],
    dataSource = []
  } = props;
  const { rows, columns, measures } = useMetaTransform(rowList, columnList, measureList);
  const cubeRef = useRef<momentCube>();
  const [emptyGridHeight, setEmptyGridHeight] = useState<number>(0);
  const [rowLPList, setRowLPList] = useState<string[][]>([]);
  const [columnLPList, setColumnLPList] = useState<string[][]>([]);
  const leftNestTree = useMemo<NestTree>(() => {
    return getPureNestTree(dataSource, rows);
  }, [dataSource, rows]);
  const topNestTree = useMemo(() => {
    return getPureNestTree(dataSource, columns);
  }, [dataSource, columns]);

  useEffect(() => {
    cubeRef.current = createCube({
      type: 'moment',
      factTable: dataSource,
      dimensions: [...rows, ...columns],
      measures,
      aggFunc: sum
    }) as momentCube;
  }, [dataSource, rows, columns, measures])

  const crossMatrix = useMemo(() => {
    return getCossMatrix(cubeRef.current, rowLPList, columnLPList, rows, columns, measureList);
  }, [dataSource, rows, columns, measures, rowLPList, columnLPList])
  
  return (
    <div style={{ border: `1px solid ${TABLE_BORDER_COLOR}`, overflowX: 'auto' }}>
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <div>
          <div style={{ height: emptyGridHeight, backgroundColor: TABLE_BG_COLOR }}></div>
          <LeftNestGrid
            depth={rows.length}
            data={leftNestTree}
            onExpandChange={lpList => {
              setRowLPList(lpList);
            }}
          />
        </div>
        <StyledTable>
          <TopNestGrid
            depth={columns.length}
            measures={measures}
            data={topNestTree}
            onSizeChange={(w, h) => {
              setEmptyGridHeight(h + 2);
            }}
            onExpandChange={lpList => {
              setColumnLPList(lpList);
            }}
          />
          <CrossTable matrix={crossMatrix} measures={measures} />
        </StyledTable>
      </div>
    </div>
  );
}

export default MagicCube;
