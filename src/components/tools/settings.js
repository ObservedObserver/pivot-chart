import React from 'react';
import { Select, List, Icon } from 'antd'
import statFunc from './stat.js'
const { Option } = Select
const viewTypes = [
    {
        title: '1d',
        icon: 'table'
    },
    {
        title: '2d',
        icon: 'layout'
    }
]
const Settings = props => {
    const {changeAggFunc, aggFunc, changeViewType} = props
    console.log('aggFunc', aggFunc)
    return (<div>
        <h3 style={{ marginBottom: 16 }}>View</h3>
            <Select defaultValue={aggFunc} style={{ width: 120 }} onChange={(value) => changeAggFunc(value)}>
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
                    <List.Item onClick={() => changeViewType(item.title)}>
                        <Icon type={item.icon} style={{ fontSize: 36, color: '#91d5ff' }} />
                    </List.Item>
                )}
            />
        </div>)
}

export default Settings;