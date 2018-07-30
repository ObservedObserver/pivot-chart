function transTree (dataTree) {
    let antTree = {
        key: 0,
        dimension: 'All',
        children: []
    }
    definedChildren(antTree)
    let cnt = 1
    function dfs(node, antNode) {
        let aggData = node.aggData()
        Object.defineProperty(antNode, '_hide', {
            writable: true,
            value: false
        })
        for (let child in node.children) {
            let antChild = {
                key: cnt++,
                dimension: child
            }
            definedChildren(antChild)
            antNode._children.push(antChild)
            dfs(node.children[child], antChild)
        }
        // console.log(aggData)
        for (let measure in aggData) {
            antNode[measure] = aggData[measure]
        }
        // if (antNode.children.length === 0) {
        //     antNode.children = undefined
        // }
    }
    dfs(dataTree, antTree)
    console.log(antTree)
    return [antTree]
}

function definedChildren (parent) {
    Object.defineProperty(parent, '_children', {
        writable: true,
        value: []
    })
    Object.defineProperty(parent, 'children', {
        get () {
            if (this._hide) {
                return []
            } else {
                if (this._children.length > 0) {
                    return this._children.slice(0, 100)
                } else {
                    return undefined
                }
            }
        },
        set (val) {
            this._children = val
        }
    })
}
export { transTree }