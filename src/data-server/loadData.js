const fs = require('fs')

function loadCSVData (filepath) {
    const str = fs.readFileSync(filepath).toString();
    const data = str.split('\n').map(row => {
        return row.replace(/"/g, '').split(',');
    }).slice(0, -1);
    const keys = data[0];
    let dataSource = []
    for (let i = 1; i < data.length; i++) {
        let item = {};
        for (let j = 0; j < keys.length; j++) {
            item[keys[j]] = data[i][j];
            if (isNaN(data[i][j])) {
                item[keys[j]] = data[i][j];
            } else {
                item[keys[j]] = Number(data[i][j]);
            }
        }
        dataSource.push(item)
    }
    return {
        config: {
            Dimensions: keys.slice(0, -3),
            Measures: keys.slice(-3),
        },
        dataSource
    }
}

module.exports = loadCSVData;
// console.log(loadCSVData('./StudentsPerformance.csv'))
