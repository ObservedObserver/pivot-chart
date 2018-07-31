const ANT_SIZE = {
    small: 8 + 1,
    middle: 8 + 1,
    default: 16 + 1
}
const TD_WIDTH = 50
const BASE_WIDTH = 200
function adjustTable (size = 'default') {
    return {
        left: ANT_SIZE[size] + TD_WIDTH,
        right: ANT_SIZE[size]
    }
}

export { adjustTable, TD_WIDTH, BASE_WIDTH }