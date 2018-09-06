import React from 'react';
import { List, Tag } from 'antd'
const labelColor = {
    'Dimensions': '#fa541c',
    'Measures': '#13c2c2'
}
const Selector = props => {
    const {labels, dragDrop, dragStart} = props
    let fields = Object.keys(labels)
    let uiLabels = {}
    fields.forEach((field) => {
        uiLabels[field] = labels[field].map((label) => {
            return (<Tag 
                draggable="true" 
                color={labelColor[label.type]} 
                key={label.name} 
                onDragStart={() => {
                    dragStart(label.name, label.type, field)
                }}>
                    {label.name}
                </Tag>)
        })
    })
    return (<List className="sheet-selector"
        size="large"
        bordered
        dataSource={fields}
        renderItem={field => (<List.Item 
            key={field} 
            onDrop={(ev) => {
                ev.stopPropagation()
                dragDrop(field)
            }} 
            onDragOver={(ev) => {ev.preventDefault()}}>
            {field}: {uiLabels[field]}
            </List.Item>)}
    />)
}

export default Selector;