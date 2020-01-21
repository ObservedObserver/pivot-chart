import React, { useMemo, useRef, useState, useEffect } from 'react';
import { DataSource, NestTree, Record } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import CrossTable from './crossTable';
import { mockTreeData } from '../example/mock';
import immer, { setAutoFreeze } from 'immer';
import styled from 'styled-components';
import { getPureNestTree } from './utils';
import { Node } from 'cube-core/built/core/momentCube';

setAutoFreeze(false);

interface MagicCubeProps {
  dataSource: DataSource;
  rows: string[];
  columns: string[];
  measures: string[];
}

function getCossMatrix(cubeRC: momentCube, cubeCR: momentCube, rowLPList: string[][] = [], columnLPList: string[][] = []): Record[][] {
  const rowLen = rowLPList.length;
  const columnLen = columnLPList.length;
  let crossMatrix: Array<Array<Record>> = [];
  function getCell (node: Node, path: string[], depth: number): Record {
    if (typeof node === 'undefined') return null;
    if (depth === path.length) {
      return node._aggData;
    }
    return getCell(node.children.get(path[depth]), path, depth + 1);
  }
  for (let i = 0; i < rowLen; i++) {
    crossMatrix.push([])
    for (let j = 0; j < columnLen; j++) {
      let result = getCell(cubeRC.tree, [...rowLPList[i], ...columnLPList[j]], 0);
      if (!result) {
        result = getCell(cubeCR.tree, [...columnLPList[j], ...rowLPList[i]], 0)
      }
      crossMatrix[i].push(result);
    }
  }
  return crossMatrix;
}

const Table = styled.table`
  border: 1px solid #333;
  td{
    border: 1px solid #333;
  }
`

const MagicCube: React.FC<MagicCubeProps> = props => {
  const { rows, columns, measures, dataSource } = props;
  const cubeRCRef = useRef<momentCube>();
  const cubeCRRef = useRef<momentCube>();
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
    cubeRCRef.current = createCube({
      type: 'moment',
      factTable: dataSource,
      dimensions: [...rows, ...columns],
      measures,
      aggFunc: sum
    }) as momentCube;
    cubeCRRef.current = createCube({
      type: 'moment',
      factTable: dataSource,
      dimensions: [...columns, ...rows],
      measures,
      aggFunc: sum
    }) as momentCube;
  }, [dataSource, rows, columns, measures])

  const crossMatrix = useMemo(() => {
    return getCossMatrix(cubeRCRef.current, cubeCRRef.current, rowLPList, columnLPList);
  }, [dataSource, rows, columns, measures, rowLPList, columnLPList])
  
  return (
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      <div>
        <div style={{ height: emptyGridHeight }}></div>
        <LeftNestGrid
          depth={rows.length}
          data={leftNestTree}
          onExpandChange={lpList => {
            setRowLPList(lpList);
          }}
        />
      </div>
      <Table>
        <TopNestGrid
          depth={columns.length}
          measures={measures}
          data={topNestTree}
          onSizeChange={(w, h) => {
            setEmptyGridHeight(h);
          }}
          onExpandChange={lpList => {
            setColumnLPList(lpList);
          }}
        />
        <CrossTable matrix={crossMatrix} measures={measures} />
      </Table>
    </div>
  );
}

export default MagicCube;
