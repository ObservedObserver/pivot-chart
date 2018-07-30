class Node {
    constructor (aggFunc) {
        this.children = {}
        this.rawData = []
        this.aggFunc = aggFunc
    }
    push () {
        this.rawData.push(...arguments)
    }
    concat (arr) {
        return this.rawData.concat(arr)
    }
    get aggData () {
        if (typeof this._aggData === 'undefined') {
        this._aggData = this.aggFunc(this.rawData)
        }
        return this._aggData
    }
}

class DataSet {
    constructor (props) {
        this.aggFunc = props.aggFunc
        this.FACT_TABLE = props.FACT_TABLE
        this.DIMENSIONS = props.DIMENSIONS
        this.MEASURES = props.MEASURES
    }

    buildTree () {
        let tree = new Node(this.aggFunc)
        this.FACT_TABLE.forEach(record => {
            this.insertNode(record, tree, 0)
        })
        return tree
    }
    
    insertNode (record, node, level) {
    // node instanceof Node === true
        if (level === this.DIMENSIONS.length) {
            node.push(record)
        } else {
            let member = record[this.DIMENSIONS[level]]
            if (typeof node.children[member] === 'undefined') {
            node.children[member] = new Node(this.aggFunc)
            }
            this.insertNode(record, node.children[member], level + 1)
        }
    }
    
    aggTree (node) {
        // leaf has no child
        for (let child in node.children) {
            node.rawData = node.rawData.concat(this.aggTree(node.children[child]).rawData)
        }
        return node
    }
}

export { DataSet }