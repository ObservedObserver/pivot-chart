import React, { useRef, useEffect } from 'react';
import embed from 'vega-embed';
import { DataSource } from '../common';

interface VegaProps {
  dataSource: DataSource;
  x: string;
  y: string;
  // onHeightChange?: (height: number) => void;
}
function mockData() {
  let size = 8 + Math.round(Math.random() * 6);
  let ans: any[] = [];
  for (let i = 0; i < size; i ++) {
    ans.push({
      x: i,
      y: Math.round(Math.random() * 10)
    })
  }
  return ans;
}
const VegaChart: React.FC<VegaProps> = props => {
  const { x = 'x', y = 'y', dataSource = [{x: 1, y: 2},{x: 2, y: 3},{x: 3, y: 4}] } = props;
  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    if (container.current) {
      embed(container.current, {
        data: {
          values: dataSource
        },
        mark: 'bar',
        height: 200,
        encoding: {
          x: {
            type: 'nominal',
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