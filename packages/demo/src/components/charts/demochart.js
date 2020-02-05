import React from 'react'
import G2 from '@antv/g2'

let cid = 0
function getChartId() {
  return 'style-areachart-' + cid++
}


class DemoChart extends React.Component {
  constructor(props) {
    super()
    this.chartId = getChartId()
    this.measure = 'MeasureValue'
    this.aggData = []
    this.dimensions = []
  }
  initChart() {
    this.chart = new G2.Chart({
      container: this.chartId,
      forceFit: false,
      padding: [100, 100, 100, 100],
      width: 1100,
      height: 700
    })
  }

  tree2Array(node, item, level) {
    if (!isNaN(node)) {
      this.aggData.push({
        ...item,
        [this.measure]: node,
      })
    } else {
      let keys = Object.keys(node)
      // console.log('keys', keys)
      keys.forEach(key => {
        this.tree2Array(
          node[key],
          {
            ...item,
            [this.dimensions[level]]: key,
          },
          level + 1,
        )
      })
    }
  }

  groupByData(dataSource, col) {
    let newData = [],
      groupTree = {}
    dataSource.forEach(item => {
      if (typeof groupTree[item[col]] === 'undefined') {
        groupTree[item[col]] = 0
      }
      groupTree[item[col]] += item['MeasureValue']
    })
    newData = dataSource.map(item => {
      return {
        ...item,
        MeasurePercent: (item['MeasureValue'] * 100) / groupTree[item[col]],
      }
    })
    return newData
  }
  aggregater(dataSource) {
    // 在transform之前运行，否则会聚合掉transform生成的数据
    let dimTree = {}
    let dimensions = this.dimensions
    // console.log('dimension', dimensions)
    // build tree
    dataSource.forEach(item => {
      let node = dimTree
      dimensions.forEach((dim, i) => {
        if (i === dimensions.length - 1) {
          if (typeof node[item[dim]] === 'undefined') {
            node[item[dim]] = 0
          }
          node[item[dim]] += item[this.measure]
        } else {
          if (typeof node[item[dim]] === 'undefined') {
            node[item[dim]] = {}
          }
          node = node[item[dim]]
        }
      })
    })
    // console.log('dimTree', dimTree)
    // tree to array
    this.aggData = []
    this.tree2Array(dimTree, {}, 0)
    // console.log(this.aggData)
    return this.aggData
  }
  // 将所有度量生成一个新的维度
  transformedData(dataSource, indCodes) {
    let newData = []
    indCodes.forEach(indCode => {
      let transData = dataSource.map((item, index) => {
        return {
          ...item,
          MeasureType: indCode,
          MeasureValue: Number(item[indCode]) || 0,
        }
      })
      newData = newData.concat(transData)
    })
    return newData
  }
  dataController(dataSource = (this.nextProps || this.props).dataSource) {
    const { indCodes, dimCodes, color } = this.nextProps || this.props
    let data = this.transformedData(dataSource, indCodes)
    this.measure = 'MeasureValue'
    this.dimensions = [...dimCodes, ...color, 'MeasureType']
    this.aggregater(data)
    data = this.aggData
    return data
  }
  geomPainter (view) {
    const {chartType} = this.props
    switch (chartType) {
      case 'bar':
        return view.interval()
      case 'line': 
        return view.line()
      default:
        return view.interval()
    }
  }
  renderChart(nextProps) {
    const { dimCodes, color } = this.props
    let data = this.dataController()
    let dimFields = dimCodes.length > 1 ? [dimCodes[1], 'MeasureType'] : [null, 'MeasureType']
    this.chart.clear()
    this.chart.changeData(data)
    let self = this
    let cols = 1, rows = 1
    self.chart.facet('rect', {
      fields: dimFields,
      eachView(view, facet) {
        cols = facet.cols
        rows = facet.rows
        view.source(facet.data)
        let geom = self.geomPainter(view).position(dimCodes[0] + '*MeasureValue')
        if (color.length > 0) {
          geom.color(color[0]).adjust([{
            type: 'stack'
          }])
        }
      },
    })
    this.chart.changeSize(Math.log(cols + 1.7) * 900, Math.log(rows + 1.7) * 600)

    this.chart.render()
  }
  componentDidMount() {
    this.initChart()
    this.renderChart()
  }

  render() {
    if (this.chart) {
      this.renderChart()
    }
    return (
      <div style={{position: 'relative', top: '0px', right:'0px', 'left': '0px', bottom: '0px', overflow: 'auto'}}>
        <div id={this.chartId} />
      </div>
    )
  }
}
export default DemoChart;
