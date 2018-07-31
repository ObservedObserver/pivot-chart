import React, {Component} from 'react';
import { Table } from 'antd';
import { DataSet } from './utils/dataset.js'
import { transTree } from './utils/antTree.js'
import { adjustTable, BASE_WIDTH } from './ui/adjustTable.js'

class PivotTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            antTree: [],
            columns: [],
            dimWidth: BASE_WIDTH
        }
    }
    componentWillReceiveProps (nextProps) {
        const { dataSource, aggFunc, Dimensions, Measures } = nextProps
        this.dataset = new DataSet({
            FACT_TABLE: dataSource,
            DIMENSIONS: Dimensions,
            MEASURES: Measures,
            aggFunc: aggFunc
        })

        this.dataset.buildTree()
        console.log('[build tree]: Done!')
        this.dataset.aggTree()
        console.log('[aggregate tree]: Done!')
        let tree = transTree(this.dataset.tree)
        console.log('[transfer tree into Ant]: Done!')
        this.setState({
            antTree: tree
        })

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
                width: BASE_WIDTH + Dimensions.length * left - left * level
            }]
            cols = cols.concat(Measures.map((mea) => {
                return {
                    title: mea,
                    dataIndex: mea,
                    key: mea,
                    width: BASE_WIDTH
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
        }
        return null
    }
    // expandHandler = (expandedRows) => {
    //     console.log(expandedRows)
    //     this.records
    //     console.log(this.refs.test.expandedRowKeys)
    // }
    render () {
        const { Measures, Dimensions, size, height } = this.props
        let { left, right } = adjustTable(size)
        let xLength = 0
        let yLength = !!height ? Math.max(60, height - 60) : undefined
        let columns = [{
            title: 'Dimension',
            dataIndex: 'dimension',
            key: 'dimension',
            width: Dimensions.length * left + BASE_WIDTH
        }];
        let newColumns = columns.concat(Measures.map((mea) => {
            return {
                title: mea,
                dataIndex: mea,
                key: mea,
                width: BASE_WIDTH
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

export default PivotTable;