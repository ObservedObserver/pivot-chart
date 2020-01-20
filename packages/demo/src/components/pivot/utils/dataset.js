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
    aggData (MEASURES = []) {
        if (typeof this._aggData === 'undefined') {
        this._aggData = this.aggFunc(this.rawData, MEASURES)
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
        this.tree = tree
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
    
    aggTree (node = this.tree) {
        // leaf has no child
        for (let child in node.children) {
            // node.rawData = node.rawData.concat(this.aggTree(node.children[child]).rawData)
            let i, data = this.aggTree(node.children[child]).rawData;
            let len = data.length;
            for (i = 0; i < len; i++) {
                node.rawData.push(data[i])
            }
            data = null;

            // node.rawData.push(...this.aggTree(node.children[child]).rawData)
        }
        node.aggData(this.MEASURES)
        return node
    }
}

export { DataSet }