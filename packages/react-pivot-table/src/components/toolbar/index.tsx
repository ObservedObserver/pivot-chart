import React, { useState } from 'react';
import { VisType } from '../../common';

const visTypeList: VisType[] = ['number', 'bar', 'line', 'scatter'];

interface ToolBarProps {
  visType: VisType;
  onVisTypeChange: (visType: VisType) => void
}

const ToolBar: React.FC<ToolBarProps> = props => {
  const { visType, onVisTypeChange } = props;

  return <div style={{ margin: '0.5em', padding: '0.5em' }}>
    <span>graphic type:</span> &nbsp;
    <select value={visType} name="visType" onChange={e => {
      onVisTypeChange(e.target.value as VisType);
    }}>
      {
        visTypeList.map(type => <option key={type} value={type}>{type}</option>)
      }
    </select>
  </div>
}

export default ToolBar