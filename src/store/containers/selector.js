import { connect } from 'react-redux'
import Selector from '../../components/tools/selector'
const mapStateToProps = (state) => {
    return {
        labels: state.selector
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        dragStart (name, type, field) {
            console.log('darg str=art')
            window.currentLabel = {
                name: name,
                type: type,
                field: field
            }
            dispatch({
                type: 'editSelector',
                params: window.currentLabel

            })
        },
    
        dragDrop (field)  {
            console.log('darg drop')
            // if (typeof this.currentLabel.field !== 'undefined') {
            //     store.dispatch({
            //         type: 'removeLabel',
            //         params: this.currentLabel
            //     })
            // } 
            window.currentLabel.field = field
            dispatch({
                type: 'editSelector',
                params: window.currentLabel
            })
            // if (field) {
            //     const { Dimensions } = this.state.dataConfig
            //     if (!(field === 'Measures' && Dimensions.indexOf(this.currentLabel.name) > -1)) {
            //         this.currentLabel.field = field
            //         store.dispatch({
            //             type: 'addLabel',
            //             params: this.currentLabel
            //         })
            //     }
            // }
            // this.currentLabel = {}
        }
    }
}

const SelectorContainer = connect(mapStateToProps, mapDispatchToProps)(Selector)
export default SelectorContainer