import React, { useEffect, useState } from 'react';
import VegaChart from './charts/vegaChart';

import { Record } from './common';
interface CrossTableProps {
  matrix: Record[][];
  measures: string[];
  dimensionsInView: string[]
}
const CrossTable: React.FC<CrossTableProps> = props => {
  const { matrix, measures, dimensionsInView } = props;
  const [heightList, setHeightList] = useState<number[]>([]);
  useEffect(() => {
    setHeightList(matrix.map(() => 0))
  }, [matrix]);
  return (
    <tbody className="vis">
      {matrix.map((row, rIndex) => {
        return (
          <tr key={rIndex}>
            {row.flatMap((cell, cIndex) => {
              return measures.map(mea => (
                <td key={`${rIndex}-${cIndex}-${mea}`}>
                  {/* {cell && cell[mea]} */}
                  <div className="vis-container">
                    <VegaChart dataSource={cell as Record[]} x={dimensionsInView[0]} y={mea} />
                  </div>
                </td>
              ));
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default CrossTable;
