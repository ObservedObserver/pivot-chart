import React, {Component} from 'react'
import {Steps} from 'antd'
const Step = Steps.Step

class Progress extends Component {
    constructor () {
        super()
        // this.state = {
        //     step: 0
        // }
    }
    currentStatus = (i) => {
        let step = this.props.step
        if (i < step) {
            return 'finish'
        } else if (i === step) {
            return 'process'
        } else {
            return 'wait'
        }
    }
    render () {
        return (
            <Steps size = "small" current = { this.props.step } >
                <Step status={this.currentStatus(0)} title="Download" />
                <Step status={this.currentStatus(1)} title="Build Tree" />
                <Step status={this.currentStatus(2)} title="Aggregate" />
                <Step status={this.currentStatus(3)} title="Render" />
            </Steps>)
    }
}
export default Progress;