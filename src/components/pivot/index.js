import React, {Component} from 'react';
import { Table } from 'antd';
import { DataSet } from './utils/dataset.js'
import { transTree } from './utils/antTree.js'


// rowSelection objects indicates the need for row selection
const rowSelection = {
    fixed: true,
};

class PivotTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            antTree: [],
            columns: [],
            dimWidth: 200
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
        console.log('build finish')
        this.dataset.aggTree()
        console.log('agg fisish')
        let tree = transTree(this.dataset.tree)
        console.log('trans finish')
        this.setState({
            // antTree: [...tree[0]._children],
            antTree: tree
        })

    }
    dfsRender = (record) => {
        const { Measures, Dimensions } = this.props
        if (record._children && record._children.length > 0) {
            let dimCode = Dimensions[record._children[0]._level - 1]
            let fixedWidth = (record._children[0]._level) * 67
            let cols = [{
                title: dimCode,
                dataIndex: 'dimension',
                key: 'dimension',
                width: 200 + Dimensions.length * 67 - fixedWidth
            }]
            // 200 - (record._children[0]._level) * 82
            console.log('dimCode', dimCode)
            cols = cols.concat(Measures.map((mea) => {
                return {
                    title: mea,
                    dataIndex: mea,
                    key: mea,
                    width: 200
                  }
            }))
            cols[cols.length - 1].width = 200 + Dimensions.length * 17 - 17 * (record._children[0]._level)
            return (
                <Table
                  columns={cols}
                  dataSource={record._children}
                  indentSize={0}
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
    }
    // expandHandler = (expandedRows) => {
    //     console.log(expandedRows)
    //     this.records
    //     console.log(this.refs.test.expandedRowKeys)
    // }
    render () {
        const { Measures, Dimensions } = this.props
        let columns = [{
            title: 'Dimension',
            dataIndex: 'dimension',
            key: 'dimension',
            width: Dimensions.length * 67 + 200
          }];
        let newColumns = columns.concat(Measures.map((mea) => {
            return {
                title: mea,
                dataIndex: mea,
                key: mea,
                width: 200
              }
        }))
        newColumns[newColumns.length - 1].width = 200 + Dimensions.length * 17
        console.log(this.state.antTree)
        return (<Table 
            pagination={{
                defaultPageSize: 50,
                hideOnSinglePage: true
            }}
            indentSize={0}
            expandedRowRender={this.dfsRender}
            columns={newColumns}
            scroll={{x: (Measures.length + 1) * 200 + 50}}
            dataSource={this.state.antTree} />)
    }
}

export default PivotTable;
// <DimensionTree ref="test" antTree={this.state.antTree} Measures={Measures} Dimensions={Dimensions} expandHandler={this.expandHandler} />

//                     <MeasureTable measureData={measureData} Measures={Measures} Dimensions={Dimensions}/>