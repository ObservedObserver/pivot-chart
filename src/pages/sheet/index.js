import React, { Component } from 'react'
import { Layout, Menu, Icon, List, Tag } from 'antd';
import PivotTable from '../../components/pivot/index.js'
import DemoChart from '../../components/charts/demochart.js'
import store from '../../store/index.js'
import './style/index.css'
const { Header, Content, Sider } = Layout;
function avg (subset, MEASURES) {
    let sums = {}
    MEASURES.forEach((mea) => {
      sums[mea] = 0
    })
    subset.forEach((record) => {
      MEASURES.forEach((mea) => {
        sums[mea] += (Number(record[mea]) || 0)
      })
    })
    MEASURES.forEach((mea) => {
      sums[mea] = (sums[mea] / subset.length).toFixed(2)
    })
    return sums
  }
const viewTypes = [
    {
        title: 'table',
        icon: 'table'
    },
    {
        title: 'bar',
        icon: 'bar-chart'
    },
    {
        title: 'line',
        icon: 'line-chart'
    }
]
class Sheet extends Component {
    constructor (props) {
        super(props)
        this.currentLabel = {}
        this.state = {
            Dimensions: [],
            Measures: [],
            Color: [],
            content: 'table',
            chartType: 'bar'
        }
        let self = this
        store.subscribe(() => {
            let state = store.getState()
            self.setState(state.sheet)
        })

    }
    dragStart (field, item, ev) {
        this.currentLabel = {
            name: item,
            type: field
        }
    }
    allowDrag = (ev) => {
        ev.preventDefault()
    }

    dragDrop (field, ev)  {
        console.log('drop', field)
        ev.stopPropagation()
        if (field === 'Dimensions' || field === 'Measures' || field === 'Color') {
            const { Dimensions } = this.props.dataConfig
            if (field === 'Color') {
                store.dispatch({
                    type: 'addLabel',
                    params: {
                        name: this.currentLabel.name,
                        type: 'Color'
                    }
                })
            } else if (!(field === 'Measures' && Dimensions.indexOf(this.currentLabel.name) > -1)) {
                store.dispatch({
                    type: 'addLabel',
                    params: this.currentLabel
                })
            }
        } else {
            store.dispatch({
                type: 'removeLabel',
                params: this.currentLabel
            })
        }
        this.currentLabel = {}
    }

    changeViewType (item) {
        if (item === 'table') {
            store.dispatch({
                type: 'setContent',
                params: {
                    content: 'table'
                }
            })
        } else {
            store.dispatch({
                type: 'setContent',
                params: {
                    content: 'chart'
                }
            })
            store.dispatch({
                type: 'setChartType',
                params: {
                    chartType: item
                }
            })
        }
        // console.log(item, store.getState())
    }
    renderView () {
        let {Dimensions, Measures, content, chartType, Color} = this.state
        let {dataSource} = this.props
        console.log('currnet state', this.state)
        if (content === 'table') {
            return (<PivotTable
                height={720}
                size={'middle'}
                aggFunc={avg}
                dataSource={dataSource}
                Dimensions={Dimensions}
                Measures={Measures} />)
        } else {
            return (<DemoChart
                height={700}
                dataSource={dataSource}
                chartType={chartType}
                dimCodes={Dimensions}
                indCodes={Measures}
                color={Color}
                 />)
        }
    }
    render () {
        const { dataConfig } = this.props
        const { Dimensions, Measures } = dataConfig
        let selectedDim = this.state.Dimensions.map(dim => {
            return (<Tag draggable="true" color="#f50" key={dim} onDragStart={this.dragStart.bind(this, 'Dimensions', dim)}>{dim}</Tag>)
        })
        let selectedMea = this.state.Measures.map(mea => {
            return (<Tag draggable="true" color="#87d068" key={mea} onDragStart={this.dragStart.bind(this, 'Measures', mea)}>{mea}</Tag>)
        })
        let selectedColor = this.state.Color.map(mea => {
            return (<Tag draggable="true" color="#87d" key={mea} onDragStart={this.dragStart.bind(this, 'Color', mea)}>{mea}</Tag>)
        })
        let selectedLabel = {
            Dimensions: selectedDim,
            Measures: selectedMea,
            Color: selectedColor
        }
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
                            renderItem={item => (<List.Item onDragStart={this.dragStart.bind(this, 'Dimensions', item)} draggable="true">{item}</List.Item>)}
                        />
                        <h3 style={{ margin: '16px 0' }}>Measures</h3>
                        <List className="sheet-list-container"
                            size="small"
                            dataSource={Measures}
                            renderItem={item => (<List.Item onDragStart={this.dragStart.bind(this, 'Measures', item)} draggable="true">{item}</List.Item>)}
                        />
                    </Sider>
                    <Sider width={220} className="sheet-sider">
                        <h3 style={{ marginBottom: 16 }}>View</h3>
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 2 }}
                            dataSource={viewTypes}
                            renderItem={item => (
                                <List.Item onClick={this.changeViewType.bind(this, item.title)}>
                                    <Icon type={item.icon} style={{ fontSize: 36, color: '#91d5ff' }} />
                                </List.Item>
                            )}
                        />
                        <List className="sheet-selector"
                            size="large"
                            bordered
                            dataSource={['Color']}
                            renderItem={item => (<List.Item key={item} onDrop={this.dragDrop.bind(this, item)} onDragOver={this.allowDrag}>{item}: {selectedLabel[item]}</List.Item>)}
                        />
                    </Sider>

                    <Layout style={{ padding: '0 24px 24px' }}>
                        <List className="sheet-selector"
                            size="large"
                            bordered
                            dataSource={['Dimensions', 'Measures']}
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


// <PivotTable 
//                     height={720}
//                     size={'middle'}
//                     aggFunc={avg}
//                     dataSource={this.props.dataSource}
//                     Dimensions={this.state.Dimensions} 
//                     Measures={this.state.Measures} />


// <DemoChart
//                     height={700}
//                     dataSource={dataSource}
//                     dimCodes={this.state.Dimensions}
//                     indCodes={this.state.Measures}
//                      />
export default Sheet;