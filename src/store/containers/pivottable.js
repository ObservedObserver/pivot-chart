import { connect } from 'react-redux'
import PivotTable from '../../components/pivot/index.js'
import statFunc from '../../components/tools/stat'
const getPivotTable = (state, tableType) => {
    switch (tableType) {
        case '1d':
            return {
                tableType,
                height: 720,
                size: 'middle',
                aggFunc: statFunc[state.settings.aggFunc],
                dataSource: state.config.dataSource,
                Dimensions: state.selector.Rows.concat(state.selector.Columns).map(item => item.name),
                Measures: state.selector.Measures.map(item => item.name)
            }
        case '2d':
            return {
                tableType,
                height: 720,
                size: 'middle',
                aggFunc: statFunc[state.settings.aggFunc],
                dataSource: state.config.dataSource,
                Rows: state.selector.Rows.map(item => item.name),
                Columns: state.selector.Columns.map(item => item.name),
                Measures: state.selector.Measures.map(item => item.name)
            }
    }
}

const mapStateToProps = (state) => {
    return getPivotTable(state, state.settings.tableType)
}

const VisablePivotTable = connect(mapStateToProps)(PivotTable)

export default VisablePivotTable;
