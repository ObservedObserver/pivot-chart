import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, List, Tag } from 'antd';
import PivotTable from '../../components/pivot/index.js'
import DemoChart from '../../components/charts/demochart.js'
import './style/index.css'
const { SubMenu } = Menu;
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
class Sheet extends Component {
    constructor (props) {
        super(props)
        const { dataSource, dataConfig } = props
        const { Dimensions, Measures } = dataConfig
        this.currentLabel = {}
        this.state = {
            Dimensions: [],
            Measures: []
        }
    }
    dragStart (field, item, ev) {
        // console.log(ev.target, ev.target.textContent)
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
        if (field && (field === 'Dimensions' || field === 'Measures')) {
            const { Dimensions } = this.props.dataConfig
            let arr = this.state[field].concat(this.currentLabel.name)
            if (!(field === 'Measures' && Dimensions.indexOf(this.currentLabel.name) > -1)) {
                this.setState({
                    [field]: arr
                })
            }
        } else {
            let pos = this.state[this.currentLabel.type].indexOf(this.currentLabel.name)
            let arr = this.state[this.currentLabel.type].slice(0, pos).concat(this.state[this.currentLabel.type].slice(pos + 1))
            if (pos >= 0) {
                this.setState({
                    [this.currentLabel.type]: arr
                })
            }
        }
        this.currentLabel = {}
    }
    render () {
        const { dataSource, dataConfig } = this.props
        const { Dimensions, Measures } = dataConfig
        let selectedDim = this.state.Dimensions.map(dim => {
            return (<Tag draggable="true" color="#f50" key={dim} onDragStart={this.dragStart.bind(this, 'Dimensions', dim)}>{dim}</Tag>)
        })
        let selectedMea = this.state.Measures.map(mea => {
            return (<Tag draggable="true" color="#87d068" key={mea} onDragStart={this.dragStart.bind(this, 'Measures', mea)}>{mea}</Tag>)
        })
        let selectedLabel = {
            Dimensions: selectedDim,
            Measures: selectedMea
        }
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
              <Sider width={260} className="sheet-sider">
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
              <Layout style={{ padding: '0 24px 24px' }}>
                <List className="sheet-selector"
                size="large"
                bordered
                dataSource={['Dimensions', 'Measures']}
                renderItem={item => (<List.Item key={item} onDrop={this.dragDrop.bind(this, item)} onDragOver={this.allowDrag}>{item}: {selectedLabel[item]}</List.Item>)}
                />
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, overflow: 'auto' }}>
                    <DemoChart
                    height={700}
                    dataSource={dataSource}
                    dimCodes={this.state.Dimensions}
                    indCodes={this.state.Measures}
                     />
                  
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
export default Sheet;