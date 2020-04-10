import React, { useRef, useEffect } from 'react';
import embed from 'vega-embed';
import { DataSource } from '../common';
import { AnyMark } from 'vega-lite/build/src/mark';
import { VisType } from '../common';
import { Scale } from '../lib/scale/inedx';

interface VegaProps {
  markType: string;
  dataSource: DataSource;
  x: string;
  y: string;
  xScale: Scale;
  yScale: Scale;
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
  const { x = 'null', y = 'null', dataSource = [], markType, xScale, yScale} = props;
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
            field: x,
            scale: xScale && {
              domain: xScale.domain
            }
          },
          y: {
            type: 'quantitative',
            field: y,
            scale: yScale && {
              domain: yScale.domain
            }
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
  }, [x, y, dataSource, xScale, yScale])
  return <div ref={container}></div>
}

export default VegaChart;