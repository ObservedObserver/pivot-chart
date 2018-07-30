function transTree (dataTree) {
    let antTree = {
        key: 0,
        dimension: 'All',
        _children: [],
        _level: 0
    }
    let cnt = 1
    function dfs(node, antNode, level) {
        let aggData = node.aggData()
        for (let child in node.children) {
            let antChild = {
                key: cnt++,
                dimension: child || 'null',
                _children: [],
                _level: level
            }
            antNode._children.push(antChild)
            dfs(node.children[child], antChild, level + 1)
        }
        for (let measure in aggData) {
            antNode[measure] = aggData[measure]
        }
        if (antNode._children.length === 0) {
            antNode._children = undefined
        }
    }
    dfs(dataTree, antTree, 1)
    console.log(antTree)
    return [antTree]
}

export { transTree }