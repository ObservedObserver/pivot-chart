function transpose (matrix = []) {
    let i, j, xLen = 0, yLen = 0, newMatrix, ans;
    if (matrix && !(matrix[0] instanceof Array) ) {
        newMatrix = [matrix]
    } else {
        newMatrix = matrix
    }
    if (newMatrix[0].length === 0) {
        return [[]]
    }
    xLen = newMatrix[0].length || 0
    yLen = newMatrix.length || 0
    ans = []
    for (i = 0; i < xLen; i++) {
        ans.push([])
        for (j = 0; j < yLen; j++) {
            ans[i][j] = newMatrix[j][i]

        }
    }
    return ans
}

// function test () {
//     console.log(transpose([]))
//     console.log(transpose(undefined))
//     console.log(transpose([[1]]))
//     console.log(transpose([1, 2, 3]))
//     console.log(transpose([[1, 2, 3]]))
//     console.log(transpose([[1], [2], [3]]))
//     console.log(transpose([[1, 2, 3], [4, 5, 6]]))
// }

// test()

export { transpose }