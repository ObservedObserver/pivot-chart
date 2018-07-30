function transTree (dataTree) {
    let antTree = {
        key: 0,
        dimension: 'All',
        children: []
    }
    let cnt = 1
    function dfs(node, antNode) {
        let aggData = node.aggData()
        for (let child in node.children) {
            let antChild = {
                key: cnt++,
                dimension: child,
                children: []
            }
            antNode.children.push(antChild)
            dfs(node.children[child], antChild)
        }
        // console.log(aggData)
        for (let measure in aggData) {
            antNode[measure] = aggData[measure]
        }
        if (antNode.children.length === 0) {
            antNode.children = undefined
        }
    }
    dfs(dataTree, antTree)
    console.log(antTree)
    return [antTree]
}
export { transTree }