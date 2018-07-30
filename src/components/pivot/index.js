import React, {Component} from 'react';
import { Table } from 'antd';
import { DataSet } from './utils/dataset.js'
import { transTree } from './utils/antTree.js'

let columns = [{
  title: 'Dimension',
  dataIndex: 'dimension',
  key: 'dimension',
}];

// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

class PivotTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            antTree: [],
            columns: columns
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
        let newColumns = Measures.map((mea) => {
            return {
                title: mea,
                dataIndex: mea,
                key: mea
              }
        })
        this.setState({
            // antTree: [...tree[0]._children],
            antTree: tree,
            columns: columns.concat(newColumns)
        })

    }
    dfsRender = (record) => {
        const { Measures, Dimensions } = this.props
        if (record._children && record._children.length > 0) {
            let dimCode = Dimensions[record._children[0]._level]
            let cols = [{
                title: dimCode,
                dataIndex: 'dimension',
                key: 'dimension'
            }]
            console.log('dimCode', dimCode)
            cols = cols.concat(Measures.map((mea) => {
                return {
                    title: mea,
                    dataIndex: mea,
                    key: mea
                  }
            }))
            return (
                <Table
                  columns={cols}
                  dataSource={record._children}
                  expandedRowRender={this.dfsRender}
                  pagination={{
                    defaultPageSize: 20,
                    hideOnSinglePage: true
                }}
                />
              )
        }
    }

    render () {
        const { Measures } = this.props
        console.log(this.state.antTree)
        return (<Table 
            pagination={{
                defaultPageSize: 50,
                hideOnSinglePage: true
            }}
            expandedRowRender={this.dfsRender}
            columns={this.state.columns} 
            rowSelection={rowSelection}
            scroll={{x: Measures.length * 200}}
            dataSource={this.state.antTree} />)
    }
}

export default PivotTable;