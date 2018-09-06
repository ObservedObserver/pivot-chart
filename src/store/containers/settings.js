import { connect } from 'react-redux'
import Settings from '../../components/tools/settings'
const mapStateToProps = (state) => {
    return {
        aggFunc: state.settings.aggFunc
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeAggFunc (value) {
            console.log('antd should have a default params:', value)
            dispatch({
                type: 'editSettings',
                params: {
                    field: 'aggFunc',
                    value: value
                }
            })
        },
        changeViewType (value) {
            dispatch({
                type: 'editSettings',
                params: {
                    field: 'tableType',
                    value: value
                }
            })
        }
    }
}

const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(Settings)
export default SettingsContainer