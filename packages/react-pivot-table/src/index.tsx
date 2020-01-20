import React, { useMemo, useRef, useEffect } from 'react';
import { DataSource } from './common';
import { createCube, sum } from 'cube-core';
import { momentCube } from 'cube-core/built/core';
import LeftNestGrid from './leftNestGrid';
import TopNestGrid from './topNestGrid';
import { mockTreeData } from '../example/mock';
import immer, { setAutoFreeze } from 'immer';
import styled from 'styled-components';

setAutoFreeze(false);

interface MagicCubeProps {
  dataSource: DataSource;
  dimensions: string[];
  measures: string[];
}

function hashTree2orderTree(tree: momentCube) {

}
const Table = styled.table`
 td{
  border: 1px solid #333;
 }
`

const MagicCube: React.FC<MagicCubeProps> = props => {
  const { dimensions, measures, dataSource } = props;
  const cubeRef = useRef<momentCube>();
  const leftNestTree = mockTreeData(4);
  return <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
    <div>
      <div style={{height: 160}}></div>
      <LeftNestGrid depth={4} data={leftNestTree} />
    </div>
    <div>
      <TopNestGrid depth={4} data={leftNestTree} />
    </div>
  </div>
}

export default MagicCube;
