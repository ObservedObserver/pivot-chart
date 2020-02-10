import React, { ReactNode } from 'react';
import VegaChart from './charts/vegaChart';

import { Record, VisType } from './common';
interface CrossTableProps {
  matrix: Record[][];
  measures: string[];
  dimensionsInView: string[];
  measuresInView: string[];
  visType: VisType;
}
function getCellContent(visType: VisType, cell: Record | Record[], facetMeasure: string, dimensionsInView: string[], measuresInView: string[]): ReactNode {
  switch (visType) {
    case 'bar':
    case 'line':
      return (<div className="vis-container">
        {cell && <VegaChart markType={visType} dataSource={cell as Record[]} x={dimensionsInView[0]} y={facetMeasure} />}
      </div>)
    case 'scatter':
      return (<div className="vis-container">
        {cell && <VegaChart markType={visType} dataSource={cell as Record[]} x={measuresInView[0]} y={facetMeasure} />}
      </div>)
    case 'number':
    default:
      return (cell && (cell as Record)[facetMeasure]);
  }
}
const CrossTable: React.FC<CrossTableProps> = props => {
  const { matrix, measures, dimensionsInView, measuresInView, visType } = props;
  return (
    <tbody className="vis">
      {matrix.map((row, rIndex) => {
        return (
          <tr key={rIndex}>
            {row.flatMap((cell, cIndex) => {
              return measures.map(mea => (
                <td key={`${rIndex}-${cIndex}-${mea}`}>
                  {
                    getCellContent(visType, cell, mea, dimensionsInView, measuresInView)
                  }
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
