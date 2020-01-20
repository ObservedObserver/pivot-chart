import React from 'react';
import {List} from 'antd'
const Config = props => {
    console.log('props of config', props)
    const {Dimensions, Measures, dragStart} = props
    return (
        <div>
            <h3 style={{ marginBottom: 16 }}>Dimensions</h3>
            <List className="sheet-list-container"
                size="small"
                dataSource={Dimensions}
                renderItem={item => (<List.Item onDragStart={() => dragStart(item, 'Dimensions', undefined)} draggable="true">{item}</List.Item>)}
            />
            <h3 style={{ margin: '16px 0' }}>Measures</h3>
            <List className="sheet-list-container"
                size="small"
                dataSource={Measures}
                renderItem={item => (<List.Item onDragStart={() => dragStart(item, 'Measures', undefined)} draggable="true">{item}</List.Item>)}
            />
        </div>
    )
}

export default Config;