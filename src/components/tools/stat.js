function avg (subset, MEASURES) {
    let sums = {}
    MEASURES.forEach((mea) => {
      sums[mea] = 0
    })
    // subset.forEach((record) => {
    //   MEASURES.forEach((mea) => {
    //     sums[mea] += (Number(record[mea]) || 0)
    //   })
    // })
    for (let i = 0, len = subset.length; i < len; i++) {
        MEASURES.forEach((mea) => {
            sums[mea] += (Number(subset[i][mea]) || 0)
          })
    }
    MEASURES.forEach((mea) => {
      sums[mea] = Number((sums[mea] / subset.length).toFixed(2))
    })
    return sums
}

function sum (subset, MEASURES) {
    let sums = {}
    MEASURES.forEach((mea) => {
      sums[mea] = 0
    })
    for (let i = 0, len = subset.length; i < len; i++) {
        MEASURES.forEach((mea) => {
            sums[mea] += (Number(subset[i][mea]) || 0)
          })
    }
    MEASURES.forEach((mea) => {
        sums[mea] = Number(sums[mea].toFixed(2))
    })
    return sums
}

function avg_unsafe (subset, MEASURES) {
    let sums = {}
    MEASURES.forEach((mea) => {
      sums[mea] = 0
    })
    // subset.forEach((record) => {
    //   MEASURES.forEach((mea) => {
    //     sums[mea] += (Number(record[mea]) || 0)
    //   })
    // })
    for (let i = 0, len = subset.length; i < len; i++) {
        MEASURES.forEach((mea) => {
            sums[mea] += (Number(subset[i][mea]) || 0)
          })
    }
    MEASURES.forEach((mea) => {
      sums[mea] = Number((sums[mea] / subset.length).toFixed(2))
    })
    return sums
}

function sum_unsafe (subset, MEASURES) {
    let sums = {}
    MEASURES.forEach((mea) => {
      sums[mea] = 0
    })
    for (let i = 0, len = subset.length; i < len; i++) {
        MEASURES.forEach((mea) => {
            sums[mea] += subset[i][mea]
          })
    }
    MEASURES.forEach((mea) => {
        sums[mea] = Number(sums[mea].toFixed(2))
    })
    return sums
}

function count (subset, MEASURES) {
    let sums = {}
    MEASURES.forEach((mea) => {
      sums[mea] = 0
    })

    for (let i = 0, len = subset.length; i < len; i++) {
        MEASURES.forEach((mea) => {
            sums[mea] ++
          })
    }

    return sums
}
const statFunc = {
    MEAN: avg,
    SUM: sum_unsafe, 
    COUNT: count
}
export default statFunc