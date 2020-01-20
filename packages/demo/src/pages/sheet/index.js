import React, { Component } from 'react'
import { Layout, Menu, Icon, List, Tag, Select } from 'antd';
import PivotTable from '../../components/pivot/index.js'
import store from '../../store/index.js'
import './style/index.css'
import statFunc from './stat.js'
import PivotTableP from '../../components/pivot/table2d.js'
const { Header, Content, Sider } = Layout;
const { Option } = Select
const labelColor = {
    'Dimensions': '#fa541c',
    'Measures': '#13c2c2'
}

const viewTypes = [
    {
        title: 'table',
        icon: 'table'
    },
    {
        title: 'table2d',
        icon: 'layout'
    }
]
class Sheet extends Component {
    constructor (props) {
        super(props)
        this.currentLabel = {}
        this.state = {
            Dimensions: [],
            Measures: [],
            Rows: [],
            Columns: [],
            Color: [],
            content: 'table',
            chartType: 'bar',
            dataSource: [],
            dataConfig: {},
            aggFunc: Object.keys(statFunc)[0]
        }
        let self = this
        store.subscribe(() => {
            let state = store.getState()
            if (state.sheet !== self.state) {
                self.setState({
                    ...state.sheet,
                    dataSource: state.dataSource,
                    dataConfig: state.dataConfig
                })
            }
        })

    }
    dragStart (name, type, field) {
        this.currentLabel = {
            name: name,
            type: type,
            field: field
        }
        console.log(this.currentLabel)
    }
    allowDrag = (ev) => {
        ev.preventDefault()
    }

    dragDrop (field, ev)  {
        console.log('drop', field)
        ev.stopPropagation()
        if (typeof this.currentLabel.field !== 'undefined') {
            store.dispatch({
                type: 'removeLabel',
                params: this.currentLabel
            })
        } 
        if (field) {
            const { Dimensions } = this.state.dataConfig
            if (!(field === 'Measures' && Dimensions.indexOf(this.currentLabel.name) > -1)) {
                this.currentLabel.field = field
                store.dispatch({
                    type: 'addLabel',
                    params: this.currentLabel
                })
            }
        }
        this.currentLabel = {}
    }
    changeAggFunc = (value) => {
        this.setState({
            aggFunc: value
        })
    }
    changeViewType (item) {
        store.dispatch({
            type: 'setContent',
            params: {
                content: item
            }
        })
        // console.log(item, store.getState())
    }
    renderView () {
        let {Measures, content, dataSource, Rows, Columns} = this.state
        let aggFunc = statFunc[this.state.aggFunc]
        let Dimensions = Rows.concat(Columns)
        if (content === 'table') {
            return (<PivotTable
                height={720}
                size={'middle'}
                aggFunc={aggFunc}
                dataSource={dataSource}
                Dimensions={Dimensions.map(item => item.name)}
                Measures={Measures.map(item => item.name)} />)
        } else {
            return (<PivotTableP height={720}
                        size={'middle'}
                        aggFunc={aggFunc}
                        dataSource={dataSource}
                        Rows={Rows.map(item => item.name)}
                        Columns={Columns.map(item => item.name)}
                        Measures={Measures.map(item => item.name)} />)
        }
    }

    render () {
        const { dataConfig } = this.state
        const { Dimensions, Measures } = dataConfig
        let selectedLabel = {}
        const fields = ['Dimensions', 'Color', 'Measures', 'Columns', 'Rows']
        fields.forEach((field) => {
            selectedLabel[field] = this.state[field].map((item) => {
                return (<Tag draggable="true" color={labelColor[item.type]} key={item.name} onDragStart={this.dragStart.bind(this, item.name, item.type, field)}>{item.name}</Tag>)
            })
        })
        
        console.log('render')
        return (
            <Layout className="sheet" onDrop={this.dragDrop.bind(this, undefined)} onDragOver={this.allowDrag}>
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
                        <h3 style={{ marginBottom: 16 }}>Dimensions</h3>
                        <List className="sheet-list-container"
                            size="small"
                            dataSource={Dimensions}
                            renderItem={item => (<List.Item onDragStart={this.dragStart.bind(this, item, 'Dimensions', undefined)} draggable="true">{item}</List.Item>)}
                        />
                        <h3 style={{ margin: '16px 0' }}>Measures</h3>
                        <List className="sheet-list-container"
                            size="small"
                            dataSource={Measures}
                            renderItem={item => (<List.Item onDragStart={this.dragStart.bind(this, item, 'Measures', undefined)} draggable="true">{item}</List.Item>)}
                        />
                    </Sider>
                    <Sider width={220} className="sheet-sider">
                        <h3 style={{ marginBottom: 16 }}>View</h3>
                        <Select defaultValue={this.state.aggFunc} style={{ width: 120 }} onChange={this.changeAggFunc}>
                            {
                                Object.keys(statFunc).map((key) => {
                                    return <Option value={key} key={key}>{key}</Option>
                                })
                            }
                        </Select>
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 2 }}
                            dataSource={viewTypes}
                            renderItem={item => (
                                <List.Item onClick={this.changeViewType.bind(this, item.title)}>
                                    <Icon type={item.icon} style={{ fontSize: 36, color: '#91d5ff' }} />
                                </List.Item>
                            )}
                        />
                    </Sider>

                    <Layout style={{ padding: '0 24px 24px' }}>
                        <List className="sheet-selector"
                            size="large"
                            bordered
                            dataSource={['Rows', 'Columns', 'Measures']}
                            renderItem={item => (<List.Item key={item} onDrop={this.dragDrop.bind(this, item)} onDragOver={this.allowDrag}>{item}: {selectedLabel[item]}</List.Item>)}
                        />
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, overflow: 'auto' }}>
                                    
                            {this.renderView()}

                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default Sheet;