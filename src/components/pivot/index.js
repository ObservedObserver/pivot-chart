import React, {Component} from 'react';
import { Table } from 'antd';
import { DataSet } from './utils/dataset.js'
import { transTree } from './utils/antTree.js'

const columns = [{
  title: 'Dimension',
  dataIndex: 'dimension',
  key: 'dimension',
}, {
  title: 'count',
  dataIndex: 'count',
  key: 'count',
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
            antTree: []
        }
    }
    componentWillReceiveProps (nextProps) {
        const { dataSource, aggFunc } = nextProps
        this.dataset = new DataSet({
            FACT_TABLE: dataSource,
            DIMENSIONS: ['Sex', 'Pclass', 'Embarked'],
            MEASURES: ['Age'],
            aggFunc: aggFunc
        })

        let tree = this.dataset.buildTree()
        tree = this.dataset.aggTree(tree)
        tree = transTree(tree)
        this.setState({
            antTree: tree
        })

    }
    render () {
        return (<Table columns={columns} rowSelection={rowSelection} dataSource={this.state.antTree} />)
    }
}

export default PivotTable;