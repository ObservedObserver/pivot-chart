import React from 'react'
import PivotTable1D from './table1d.js'
import PivotTable2D from './table2d.js'
import PivotTableHema from './tablehema.slow.js'

const PivotTable = props => {
    console.log('pivot table get props:', props)
    const { tableType, Dimensions, Measures, dataSource, aggFunc, size, height, Rows, Columns, names } = props
    switch (tableType) {
        case '1d':
            return (<PivotTable1D
                height={height}
                size={size}
                aggFunc={aggFunc}
                dataSource={dataSource}
                Dimensions={Dimensions}
                Measures={Measures}
                 />);
        case '2d':
            return (<PivotTable2D
                height={height}
                size={size}
                aggFunc={aggFunc}
                dataSource={dataSource}
                Rows={Rows}
                Columns={Columns}
                Measures={Measures}
                 />);
        case 'hema':
                return (<PivotTableHema
                    names={names}
                    height={height}
                    size={size}
                    aggFunc={aggFunc}
                    dataSource={dataSource}
                    Dimensions={Dimensions}
                    Measures={Measures}
                    />)
        default:
            return (<PivotTable1D
                height={height}
                size={size}
                aggFunc={aggFunc}
                dataSource={dataSource}
                Dimensions={Dimensions}
                Measures={Measures}
                 />);
    }
}

export default PivotTable;