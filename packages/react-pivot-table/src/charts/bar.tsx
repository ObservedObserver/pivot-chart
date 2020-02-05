import React, { useRef, useEffect } from 'react';
import echarts, { EChartOption } from 'echarts';
import { DataSource } from '../common';

interface BarProps {
  dataSource: DataSource;
  x: string;
  y: string;
}

const BarChart: React.FC<BarProps> = props => {
  const { x = 'x', y = 'y', dataSource = [{x: 1, y: 2},{x: 2, y: 3},{x: 3, y: 4}] } = props;
  const container = useRef<HTMLDivElement>();
  const chart = useRef<echarts.ECharts>();
  useEffect(() => {
    if (container.current) {
      chart.current = echarts.init(container.current, null, {renderer: 'svg'});
      const option: EChartOption = {
        dataset: {
          source: []
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          {
            type: 'bar'
          }
        ]
      }
      chart.current.setOption(option);
    }
  }, [])
  useEffect(() => {
    if (container.current && chart.current) {
      const option: EChartOption = {
        dataset: {
          source: dataSource
        },
        series: [
          {
            type: 'bar',
            encode: {
              x,
              y
            }
          }
        ]
      }
      chart.current.setOption(option);
    }
  }, [x, y, dataSource])
  return <div style={{ width: 400, height: 300 }} ref={container}></div>
}

export default BarChart;
