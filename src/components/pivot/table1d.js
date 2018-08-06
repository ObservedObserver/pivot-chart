import React, {Component} from 'react';
import { Table } from 'antd';
import { DataSet } from './utils/dataset.1.js'
import { transTree } from './utils/antTree.1.js'
import { adjustTable, BASE_WIDTH } from './ui/adjustTable.js'
import './index.css'
class PivotTable1D extends Component {
    constructor (props) {
        super(props)
        this.state = {
            antTree: [],
            columns: [],
            dimWidth: BASE_WIDTH
        }
    }
    componentWillReceiveProps (nextProps) {
        this.generateCube(nextProps)
    }
    dfsRender = (record) => {
        const { Measures, Dimensions, size } = this.props
        if (record._children && record._children.length > 0) {
            let level = record._children[0]._level
            let dimCode = Dimensions[level - 1]
            let { left, right } = adjustTable(size)
            let cols = [{
                title: dimCode,
                dataIndex: 'dimension',
                key: 'dimension',
                width: BASE_WIDTH + Dimensions.length * left - left * level,
                sorter: true
            }]
            cols = cols.concat(Measures.map((mea) => {
                return {
                    title: mea,
                    dataIndex: mea,
                    key: mea,
                    width: BASE_WIDTH,
                    sorter: (a, b) => Number(a[mea]) - Number(b[mea])
                  }
            }))
            cols[cols.length - 1].width = BASE_WIDTH + Dimensions.length * right - right * level
            // issue: record._children[0]._children ? this.dfsRender : undefined
            return (
                <Table
                  columns={cols}
                  dataSource={record._children}
                  indentSize={0}
                  size={size}
                  showHeader={false}
                  scroll={{x: 20}}
                  expandedRowRender={this.dfsRender}
                  pagination={{
                    defaultPageSize: 20,
                    hideOnSinglePage: true
                }}
                />
              )
        } else if (record && record._rawData.length > 0) {
            let keys = Object.keys(record._rawData[0])
            let cols = keys.map((key) => {
                return {
                    title: key,
                    dataIndex: key,
                    key: key
                    // sorter: true
                  }
            })
            return (
                <Table className="hiden-table"
                  columns={cols}
                  rowKey={(record, index) => index}
                  dataSource={record._rawData}
                  indentSize={0}
                  size={size}
                  showHeader={true}
                  pagination={{
                    defaultPageSize: 10,
                    hideOnSinglePage: true
                }}
                />
              )
        }
    }
    generateCube (nextProps) {
        const { dataSource, aggFunc, Dimensions, Measures } = nextProps || this.props
        this.dataset = new DataSet({
            FACT_TABLE: dataSource,
            DIMENSIONS: Dimensions,
            MEASURES: Measures,
            aggFunc: aggFunc
        })
        let t = (new Date()).getTime(), t1;
        this.dataset.buildTree()
        t1 = (new Date()).getTime()
        console.log('[build tree]: Done!', t1 - t)
        t = (new Date()).getTime()
        this.dataset.aggTree()
        t1 = (new Date()).getTime()
        console.log('[aggregate tree]: Done!', t1 - t)
        t = (new Date()).getTime()
        let tree = transTree(this.dataset.tree)
        t1 = (new Date()).getTime()
        console.log('[transfer tree into Ant]: Done!', t1 - t)
        this.setState({
            antTree: tree
        })
    }
    componentWillMount () {
        this.generateCube()
    }
    render () {
        const { Measures, Dimensions, size, height } = this.props
        let { left, right } = adjustTable(size)
        let xLength = 0
        let yLength = !!height ? Math.max(60, height - 60) : undefined
        let columns = [{
            title: 'Dimension',
            dataIndex: 'dimension',
            key: 'dimension',
            width: Dimensions.length * left + BASE_WIDTH,
            sorter: true
        }];
        let newColumns = columns.concat(Measures.map((mea) => {
            return {
                title: mea,
                dataIndex: mea,
                key: mea,
                width: BASE_WIDTH,
                // sorter: (a, b) => Number(a[mea]) - Number(b[mea])
              }
        }))
        newColumns[newColumns.length - 1].width = BASE_WIDTH + Dimensions.length * right
        newColumns.forEach(item => {
            xLength += item.width
        })
        return (<Table 
            pagination={{
                defaultPageSize: 50,
                hideOnSinglePage: true
            }}
            indentSize={0}
            size={size}
            expandedRowRender={this.dfsRender}
            columns={newColumns}
            scroll={{x: xLength, y: yLength}}
            dataSource={this.state.antTree} />)
    }
}

export default PivotTable1D;