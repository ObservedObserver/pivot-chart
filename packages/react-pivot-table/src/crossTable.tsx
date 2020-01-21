import React from 'react';
import { Record } from './common';
interface CrossTableProps {
  matrix: Record[][];
  measures: string[];
}
const CrossTable: React.FC<CrossTableProps> = props => {
  const { matrix, measures } = props;
  return <tbody>
    {
      matrix.map((row, rIndex) => {
        return <tr key={rIndex}>
          { row.flatMap((cell, cIndex) => {
            return measures.map(mea => <td key={`${rIndex}-${cIndex}-${mea}`}>{cell && cell[mea]}</td>)
          }) }
        </tr>
      })
    }
  </tbody>
}

export default CrossTable;
