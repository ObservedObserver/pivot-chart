import React, { ReactNode } from 'react';
import VegaChart from './charts/vegaChart';

import { Record, VisType, Measure, Field } from './common';
interface CrossTableProps {
  matrix: Record[][];
  measures: Measure[];
  dimensionsInView: Field[];
  measuresInView: Measure[];
  visType: VisType;
}
function getCellContent(visType: VisType, cell: Record | Record[], facetMeasure: Measure, dimensionsInView: Field[], measuresInView: Measure[]): ReactNode {
  const viewDimCode = dimensionsInView.length > 0 ? dimensionsInView[0].id : 'total';
  switch (visType) {
    case 'bar':
    case 'line':
      return (<div className="vis-container">
        {cell && <VegaChart markType={visType} dataSource={cell as Record[]} x={viewDimCode} y={facetMeasure.id} />}
      </div>)
    case 'scatter':
      return (<div className="vis-container">
        {cell && <VegaChart markType={visType} dataSource={cell as Record[]} x={measuresInView[0].id} y={facetMeasure.id} />}
      </div>)
    case 'number':
    default:
      if (cell && facetMeasure.formatter) {
        return facetMeasure.formatter((cell as Record)[facetMeasure.id]);
      }
      return (cell && (cell as Record)[facetMeasure.id]) || '--';
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
                <td key={`${rIndex}-${cIndex}-${mea.id}`}>
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
