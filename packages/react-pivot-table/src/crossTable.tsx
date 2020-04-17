import React, { ReactNode, useMemo } from 'react';
import VegaChart from './charts/vegaChart';

import { Record, VisType, Measure, Field } from './common';
import { getVisualScale, VisualScaleSpace } from './lib/scale/inedx';
interface CrossTableProps {
  matrix: Record[][];
  measures: Measure[];
  dimensionsInView: Field[];
  measuresInView: Measure[];
  visType: VisType;
}
function getCellContent(visType: VisType, cell: Record | Record[], facetMeasure: Measure, dimensionsInView: Field[], measuresInView: Measure[], visualScale: VisualScaleSpace | null): ReactNode {
  const viewDimCode = dimensionsInView.length > 0 ? dimensionsInView[0].id : 'total';
  const safeVisType: VisType = visualScale === null ? 'number' : visType;
  switch (safeVisType) {
    case 'bar':
    case 'line':
      return (<div className="vis-container">
        {cell && <VegaChart
          xScale={visualScale.dimensions.find(dim => dim.id === viewDimCode) || { type: 'discrete', domain: null, id: 'total' }}
          yScale={visualScale.measures.find(mea => mea.id === facetMeasure.id)}
          markType={visType}
          dataSource={cell as Record[]}
          x={viewDimCode}
          y={facetMeasure.id} />}
      </div>)
    case 'scatter':
      return (
        <div className="vis-container">
          {cell && (
            <VegaChart
              xScale={visualScale.measures.find(mea => mea.id === measuresInView[0].id)}
              yScale={visualScale.measures.find(mea => mea.id === facetMeasure.id)}
              markType={visType}
              dataSource={cell as Record[]}
              x={measuresInView[0].id}
              y={facetMeasure.id}
            />
          )}
        </div>
      );
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
  const visualScale = useMemo<null | VisualScaleSpace>(() => {
    if (visType === 'number') {
      // todo: scale for number case. used for heatmap in future
      return null
    } else {
      return getVisualScale(matrix as Record[][][], dimensionsInView, measures.concat(measuresInView));
    }
  }, [matrix])
  return (
    <tbody className="vis">
      {matrix.map((row, rIndex) => {
        return (
          <tr key={rIndex}>
            {row.flatMap((cell, cIndex) => {
              return measures.map(mea => (
                <td key={`${rIndex}-${cIndex}-${mea.id}`}>
                  {
                    getCellContent(visType, cell, mea, dimensionsInView, measuresInView, visualScale)
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
