import React, { Component } from 'react'
import { Tree, Table, Layout, Row, Col } from 'antd';
import { DataSet } from './utils/dataset.1.js'
import { expand } from '../../../node_modules/rxjs/operator/expand';

import './ui/hema.css'
const { Header, Footer, Sider, Content } = Layout;
const TreeNode = Tree.TreeNode;
// function transTree(node, name) {
//     if (node.children.size === 0) {
//         return (<TreeNode title={name} key={name}></TreeNode>)
//     }
//     else if (node.children.size > 0) {
//         let children = node.children.keys()
//         let subset = []
//         for (let child of children) {
//             subset.push(transTree(node.children.get(child), child))
//         }
//         return (<TreeNode title={name} key={name}>{subset}</TreeNode>)
//     }

// }

function transTree (dataTree) {
    let antTree = {
        key: 0,
        dimension: '汇总',
        children: [],
        _level: 0
    }
    let cnt = 1
    function dfs(node, antNode, level) {
        // let aggData = node.aggData()
        let children = node.children.keys()
        for (let child of children) {
            let antChild = {
                key: cnt++,
                dimension: child || 'null',
                children: [],
                _level: level
            }
            antNode.children.push(antChild)
            dfs(node.children.get(child), antChild, level + 1)
        }
        antNode.aggData = node.aggData()
        for (let measure in antNode.aggData) {
            antNode[measure] = antNode.aggData[measure]
        }
        // antNode._rawData = node.rawData
        // antNode.aggData = node.aggData()
        if (antNode.children.length === 0) {
            antNode.children = undefined
        }
    }
    dfs(dataTree, antTree, 1)
    return [antTree]
}

function foldExpandedTree(tree, expandedKeys) {
    let arr = []
    function fold(node) {
        if (expandedKeys.indexOf(node.key) > -1) {
            arr.push(node.aggData) 
            if (typeof node.children !== 'undefined') {
                node.children.forEach((child) => {
                    fold(child)
                })
            }
        } else {
            arr.push(node.aggData)
        }
    }
    fold(tree[0])
    return arr
}
class PivotTableHema extends Component {
    constructor () {
        super()
        this.state = {
            expandedKeys: []
        }
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        console.log(this.refs.root.props)
    }
    onExpand = (expandedKeys, others) => {
        console.log('onexpaned', expandedKeys, others)
        this.setState({
            expandedKeys: expandedKeys
        })
        console.log(foldExpandedTree(this.dataset.tree, expandedKeys))
    }
    onExpandedRowsChange = (expandedKeys) => {
        console.log(expandedKeys)
        this.setState({
            expandedKeys: expandedKeys
        })
    }
    componentWillReceiveProps(nextProps) {
        this.generateCube(nextProps)
    }
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }
    generateCube(nextProps) {
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
        // t = (new Date()).getTime()
        // let tree = transTree(this.dataset.tree)
        // t1 = (new Date()).getTime()
        // console.log('[transfer tree into Ant]: Done!', t1 - t)
        // this.setState({
        //     antTree: tree
        // })
    }
    componentWillMount() {
        this.generateCube()
    }
    render() {
        const dimLen = this.props.Dimensions.length
        const dimTree = transTree(this.dataset.tree)
        // const measureData = foldExpandedTree(dimTree, this.state.expandedKeys) || []
        const columns = this.props.Measures.map((item) => {
            return {
                title: item,
                dataIndex: item,
                key: item,
                width: 160,
                align: 'right',
                className: 'measure-column'
            }
        })
        const dimColumn = [{
            title: '维度数据',
            dataIndex: 'dimension',
            key: 'dimension',
            width: dimLen * 40 + 200,
            fixed: 'left',
            className: 'dimension-column'
        }]
        console.log(dimTree)
        console.log('columns', columns)
        return (
            <div className="pivot-hema">
                <Row>
                    <Col span={24} style={{overflowX: 'auto'}}>
                    <Table 
                    pagination={{
                        pageSize: 20,
                        hideOnSinglePage: true
                    }}
                    scroll={{ x: this.props.Measures.length * 160 +  dimLen * 40 + 200}}
                    onExpandedRowsChange = {this.onExpandedRowsChange}
                    dataSource={dimTree} columns={dimColumn.concat(columns)}  size={'middle'} pagination={false}></Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PivotTableHema;

// <Tree ref="root"
//                             // defaultExpandedKeys={['0-0-0', '0-0-1']}
//                             // defaultSelectedKeys={['0-0-0', '0-0-1']}
//                             // defaultCheckedKeys={['0-0-0', '0-0-1']}
//                             onSelect={this.onSelect}
//                             onCheck={this.onCheck}
//                             onExpand={this.onExpand}
//                         >
//                             {transTree(this.dataset.tree, 'root')}
//                         </Tree>