import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import URL from '../../api.config.js'
import '../../pages/sheet/style/index.css'

import ConfigContainer from './config.js'
import SelectorContainer from './selector.js'
import SettingsContainer from './settings.js'
import PivotTable from './pivottable.js'
import {connect} from 'react-redux'
const { Header, Content, Sider } = Layout;

class Sheet extends Component {
    constructor (props) {
        super(props)
        console.log('props in Sheet', props)
        props.getData()
        this.currentLabel = {}

    }// console.log(item, store.getState())

    render () {
        
        console.log('render')
        return (
            <Layout className="sheet" 
            onDrop={this.props.dragDrop.bind(this, undefined)} 
            onDragOver={(ev) => {ev.preventDefault()}}>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">Sheet</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={220} className="sheet-sider">
                        <ConfigContainer />
                    </Sider>
                    <Sider width={220} className="sheet-sider">
                        <SettingsContainer />
                    </Sider>

                    <Layout style={{ padding: '0 24px 24px' }}>
                        <SelectorContainer />
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, overflow: 'auto' }}>
                                    
                            <PivotTable />

                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
const mapStateToProps = (state) => {
    return {}
}
const mapDispatchToProps = (dispatch) => {
    console.log('dispatch', dispatch)
    return {
        getData () {
            dispatch({
                type: 'editConfig',
                params: {
                    todo: 'request',
                    url: URL,
                    dispatch: dispatch
                }
            })
        },
        dragDrop (field) {
            console.log('drop field', field)
            dispatch({
                type: 'editSelector',
                params: {
                    name: window.currentLabel.name,
                    type: window.currentLabel.type,
                    field: field
                }
            })
            window.currentLabel = {}
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Sheet);