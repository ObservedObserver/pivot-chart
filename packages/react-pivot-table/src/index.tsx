import React, { useMemo, useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Record } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import { setAutoFreeze } from 'immer';
import { getPureNestTree, getCossMatrix } from './utils';
import { Node } from 'cube-core/built/core/momentCube';
import { StyledTable, TABLE_BG_COLOR, TABLE_BORDER_COLOR } from './components/styledTable';
import { AggFC } from 'cube-core/built/types';

setAutoFreeze(false);

interface MagicCubeProps {
  dataSource: DataSource;
  rows: string[];
  columns: string[];
  measures: string[];
}

const MagicCube: React.FC<MagicCubeProps> = props => {
  const { rows = [], columns = [], measures = [], dataSource = [] } = props;
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
    return getCossMatrix(cubeRef.current, rowLPList, columnLPList, rows, columns, measures);
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
