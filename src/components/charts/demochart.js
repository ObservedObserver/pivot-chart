import React from 'react'
import G2 from '@antv/g2'

let cid = 0
function getChartId() {
  return 'hema-areachart-' + cid++
}


class DemoChart extends React.Component {
  constructor(props) {
    super()
    this.chartId = getChartId()
    this.measure = 'indecateValue'
    this.aggData = []
    this.dimensions = []
  }
  initChart() {
    const { height } = this.props
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
      groupTree[item[col]] += item['indecateValue']
    })
    newData = dataSource.map(item => {
      return {
        ...item,
        indecatePercent: (item['indecateValue'] * 100) / groupTree[item[col]],
      }
    })
    return newData
  }
  aggregater(dataSource) {
    // 在transform之前运行，否则会聚合掉transform生成的数据
    let newData = [],
      dimTree = {}
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
          indecateType: indCode,
          indecateValue: Number(item[indCode]) || 0,
        }
      })
      newData = newData.concat(transData)
    })
    return newData
  }
  dataController(dataSource = (this.nextProps || this.props).dataSource) {
    const { indCodes, dimCodes } = this.nextProps || this.props
    let data = this.transformedData(dataSource, indCodes)
    this.measure = 'indecateValue'
    this.dimensions = dimCodes.concat('indecateType')
    this.aggregater(data)
    data = this.aggData
    return data
  }
  // 绘制不同的曲线类型[平滑, 折线]
  smoothPainter(view) {
    const { dimCodes, isSmooth } = this.nextProps || this.props
    let areaGeom, lineGeom
    if (view) {
      areaGeom = this.areaGeom
      lineGeom = this.lineGeom
    } else {
      ;[areaGeom, lineGeom] = this.chart.getAllGeoms()
    }
    if (isSmooth) {
      areaGeom.shape('smooth')
      lineGeom.shape('smooth')
    } else {
      areaGeom.shape('area')
      lineGeom.shape('line')
    }
  }
  // 绘制数据标签
  labelPainter(view) {
    const { isLabel } = this.nextProps || this.props
    let lineGeom
    if (view) {
      lineGeom = this.lineGeom
    } else {
      lineGeom = this.chart.getAllGeoms()[0]
    }
    if (isLabel) {
      lineGeom.label(this.measure)
    }
  }
  // 绘制坐标系网格
  gridPainter(view) {
    const { isGrid } = this.nextProps || this.props
    let _view
    if (view) {
      _view = view
    } else {
      _view = this.chart
    }
    if (isGrid) {
      _view.axis(this.measure, { grid: null, autoRotate: true })
    } else {
      _view.axis(this.measure, {})
    }
  }
  // 初始化一个绘制行为
  createNewPainter(view) {
    const { dimCodes, isStack } = this.nextProps || this.props
    if (isStack) {
      if (view) {
        this.areaGeom = view.areaStack()
        this.lineGeom = view.lineStack()
      } else {
        this.chart.areaStack()
        this.chart.lineStack()
      }
    } else {
      if (view) {
        this.areaGeom = view.area()
        this.lineGeom = view.line()
      } else {
        this.chart.area()
        this.chart.line()
      }
    }
  }
  attrPainter(view) {
    const { dimCodes, indCodes } = this.nextProps || this.props
    let areaGeom, lineGeom
    if (view) {
      // {areaGeom, lineGeom} = this;
      areaGeom = this.areaGeom
      lineGeom = this.lineGeom
    } else {
      ;[areaGeom, lineGeom] = this.chart.getAllGeoms()
    }
    let _view = view || this.chart
    areaGeom.position(`${this.dimensions[0]}*${this.measure}`).color('indecateType')
    lineGeom.position(`${this.dimensions[0]}*${this.measure}`).color('indecateType')
  }
  renderChart(nextProps) {
    const { dimCodes } = nextProps || this.props
    let data = this.dataController()
    this.chart.changeData(data)
    this.chart.clear()

    if (dimCodes.length > 1) {
      let self = this
      let cnt = 0
      self.chart.facet('rect', {
        fields: [null].concat(dimCodes.slice(1)),
        eachView(view, facet) {
          console.log('facet', facet)
          let data = facet.data
          cnt++
          // let data = self.dataController()
          view.source(data)
          self.createNewPainter(view)
          self.attrPainter(view)
          self.smoothPainter(view)
          self.labelPainter(view)
          self.gridPainter(view)
        },
      })
      this.chart.changeHeight(cnt * 360)
    } else {
        this.chart.changeHeight(700)
      this.createNewPainter()
      this.attrPainter()
      this.smoothPainter()
      this.labelPainter()
      this.gridPainter()
    }

    this.chart.render()
  }
  componentDidMount() {
    this.initChart()
    this.renderChart()
  }
  componentWillReceiveProps(nextProps) {
    this.nextProps = nextProps
    if (this.chart) {
      this.renderChart(nextProps)
    }
  }
  render() {
    return (
      <div style={{position: 'relative', top: '0px', right:'0px', 'left': '0px', bottom: '0px', overflow: 'auto'}}>
        <div id={this.chartId} />
      </div>
    )
  }
}
export default DemoChart;
