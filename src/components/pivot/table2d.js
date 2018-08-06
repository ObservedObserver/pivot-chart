import React, {Component} from 'react';
import { Row, Col, Button, Icon } from 'antd';
import { DataSet } from './utils/dataset.1.js'
import { transpose } from './utils/transpose.js'
import SimpleTable from './ui/simpleTable.js'
import './table2d.css'

const ButtonGroup = Button.Group;

function tree2Matrix (tree) {
    let arr = []
    function dfs (node, item) {
        if (node.children.size === 0) {
            arr.push([...item])
        } else {
            let children = node.children.keys()
            for (let child of children) {
                dfs(node.children.get(child), [...item, child])   
            }
        }
    }
    dfs(tree, [])
    return arr
}
const PAGE_SIZE = {
    row: 20,
    col: 8
}
class PivotTableP extends Component {
    constructor (props) {
        super(props)
        this.state = {
            rowView: [[]],
            colView: [[]],
            rowPos: 0,
            colPos: 0
        }
    }
    
    generateCube (nextProps) {
        const { dataSource, aggFunc, Rows = ['Sex'], Columns = [], Measures } = nextProps || this.props
        this.dataset = new DataSet({
            FACT_TABLE: dataSource,
            MEASURES: Measures,
            aggFunc: aggFunc
        })
        let t0, t1;
        t0 = (new Date()).getTime()
        this.dataset.DIMENSIONS = Rows
        let rowTree = this.dataset.buildTree()
        this.dataset.DIMENSIONS = Columns
        let colTree = this.dataset.buildTree()
        this.dataset.DIMENSIONS = Rows.concat(Columns)
        this.dimTree = this.dataset.buildTree()
        t1 = (new Date()).getTime()
        console.log('2d pivot: buildTree', t1 - t0)
        t0 = (new Date()).getTime()
        this.rowMatrix = tree2Matrix(rowTree)
        this.colMatrix = tree2Matrix(colTree)
        t1 = (new Date()).getTime()
        console.log('2d pivot: get Matrix', t1 - t0)
        this.totalRows = this.rowMatrix.length
        this.totalCols = this.colMatrix.length
    }
    searchTree (node, dims, level) {
        if (typeof node === 'undefined') {
            return 'null'
        }
        if (level === dims.length) {
            // console.log('node', node)
            // console.log(node.aggData(this.props.Measures))
            // debugger;
            return node.aggData(this.props.Measures)
        } else {
            return this.searchTree(node.children.get(dims[level]), dims, level + 1)
        }
    }
    getCell (rowIndex, colIndex) {
        let query = this.rowMatrix[rowIndex].concat(this.colMatrix[colIndex])
        let result = this.searchTree(this.dimTree, query, 0)
        if (result === "null") {
            return result
        } else {
            let keys = Object.keys(result)
            return keys.map(key => {
                        return result[key]
                    }).toString()
        }
    }
    getResultMatrix () {
        let Measures = this.props.Measures
        let matrix = [], rowPos = this.state.rowPos, colPos = this.state.colPos;
        for (let i = 0; i < PAGE_SIZE.row; i++) {
            if (rowPos * PAGE_SIZE.row + i >= this.totalRows) {
                break
            }
            matrix.push([])
            for (let j = 0; j < PAGE_SIZE.col; j++) {
                if (colPos * PAGE_SIZE.col + j >= this.totalCols) {
                    break
                }
                if (Measures && Measures.length > 0) {
                    matrix[i].push(this.getCell(rowPos * PAGE_SIZE.row + i, colPos * PAGE_SIZE.col + j))
                } else {
                    matrix[i].push('abc')
                }
            }
        }
        return matrix

    }
    setPos (axis, value) {
        if (axis === 'rows') {
            let maxPage = parseInt((this.totalRows - 0.5) / PAGE_SIZE.row, 10)
            let pos = Math.max(Math.min(maxPage, this.state.rowPos + value), 0)
            this.setState({
                rowPos: pos
            })

        } else {
            let maxPage = parseInt((this.totalCols - 0.5) / PAGE_SIZE.col, 10)
            let pos = Math.max(Math.min(maxPage, this.state.colPos + value), 0)
            this.setState({
                colPos: pos
            })
        }
    }
    componentWillReceiveProps (nextProps) {
        this.generateCube(nextProps)
    }
    componentWillMount () {
        this.generateCube()
    }
    render () {
        let colView = transpose(this.colMatrix.slice(this.state.colPos * PAGE_SIZE.col, (this.state.colPos + 1) * PAGE_SIZE.col))
        let rowView = this.rowMatrix.slice(this.state.rowPos * PAGE_SIZE.row, (this.state.rowPos + 1) * PAGE_SIZE.row)
        let resultView = this.getResultMatrix()
        // console.log(this.rowMatrix)
        return (<div>
            <Row style={{padding: '0.4rem'}}>
                <Col span={12}>
                    <ButtonGroup>
                        <Button type="normal" onClick={this.setPos.bind(this, 'rows', -1)}>
                            <Icon type="up" />Up
                        </Button>
                        <Button type="normal" onClick={this.setPos.bind(this, 'rows', 1)}>
                            Down<Icon type="down" />
                        </Button>
                    </ButtonGroup>
                </Col>
                <Col span={12}>
                    <ButtonGroup>
                        <Button type="normal" onClick={this.setPos.bind(this, 'cols', -1)}>
                            <Icon type="left" />left
                    </Button>
                        <Button type="normal" onClick={this.setPos.bind(this, 'cols', 1)}>
                            right<Icon type="right" />
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row className="table2d-row">
                <Col className="table2d-col" span={6}>
                </Col>
                <Col className="table2d-col" span={18}>
                    <SimpleTable matrix={colView} head={true} />
                </Col>
            </Row>
            <Row className="table2d-row">
                <Col className="table2d-col" span={6}>
                    <SimpleTable matrix={rowView} head={true} />
                </Col>
                <Col className="table2d-col" span={18}>
                    <SimpleTable matrix={resultView} />
                </Col>
            </Row>
        </div>)
    }
}

export default PivotTableP;