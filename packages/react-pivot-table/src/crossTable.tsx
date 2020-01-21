import React from 'react';
interface CrossTableProps {
  matrix: any[][];
}
const CrossTable: React.FC<CrossTableProps> = props => {
  const { matrix } = props;
  return <tbody>
    {
      matrix.map((row, rIndex) => {
        return <tr key={rIndex}>
          { row.map((cell, cIndex) => <td key={`${rIndex}-${cIndex}`}>{cell}</td>) }
        </tr>
      })
    }
  </tbody>
}

export default CrossTable;
