import { connect } from 'react-redux'
import Config from '../../components/tools/config'

const mapStateToProps = (state) => {
    console.log('get state of config', state)
    return {
        Dimensions: state.config.Dimensions,
        Measures: state.config.Measures
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dragStart (name, type, field) {
            window.currentLabel = {
                name: name,
                type: type,
                field: field
            }
            dispatch({
                type: 'editSelector',
                params: window.currentLabel
            })
        }
    }
}

const ConfigContainer = connect(mapStateToProps, mapDispatchToProps)(Config)
export default ConfigContainer