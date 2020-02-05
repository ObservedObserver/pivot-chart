import React, { useRef, useEffect } from 'react';
import embed from 'vega-embed';
import { DataSource } from '../common';
import { AnyMark } from 'vega-lite/build/src/mark';
import { VisType } from '../common';

interface VegaProps {
  markType: string;
  dataSource: DataSource;
  x: string;
  y: string;
  // onHeightChange?: (height: number) => void;
}
const visMapper: {[key: string]: AnyMark} = {
  bar: 'bar',
  line: 'line',
  scatter: 'point'
}
function visType2MarkType (visType: string): AnyMark {
  return visMapper[visType] || 'tick';
}
const VegaChart: React.FC<VegaProps> = props => {
  const { x = 'null', y = 'null', dataSource = [], markType } = props;
  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    if (container.current) {
      embed(container.current, {
        data: {
          values: dataSource
        },
        mark: visType2MarkType(markType),
        height: 200,
        encoding: {
          x: {
            type: markType === 'scatter' ? 'quantitative' : 'nominal',
            field: x
          },
          y: {
            type: 'quantitative',
            field: y
          }
        }
      }, {
        actions: false,
        mode: 'vega-lite',
        renderer: 'svg'
      }).then(res => {
        // if (onHeightChange) {
        //   onHeightChange(container.current.clientHeight);
        // }
      })
    }
  }, [x, y, dataSource])
  return <div ref={container}></div>
}

export default VegaChart;