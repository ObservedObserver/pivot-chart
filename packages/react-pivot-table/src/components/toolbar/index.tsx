import React, { useState, useCallback } from 'react';
import { VisType, DimensionArea, AggNodeConfig } from '../../common';
import styled from 'styled-components';

const visTypeList: VisType[] = ['number', 'bar', 'line', 'scatter'];

interface ToolBarProps {
  visType: VisType;
  onVisTypeChange: (visType: VisType) => void;
  showAggregatedNode: AggNodeConfig
  onShowAggNodeChange: (values: AggNodeConfig) => void;
}

const ToolBarContainer = styled.div`
  display: flex;
  margin: 0.5em;
  padding: 0.5em;
  div.item{
    margin: 0.2em 1em;
  }
`;

const ToolBar: React.FC<ToolBarProps> = props => {
  const { visType, onVisTypeChange, showAggregatedNode, onShowAggNodeChange } = props;

  const checkboxHandler = useCallback((e) => {
    let value = {
      ...showAggregatedNode,
      [e.target.name as string]: e.target.checked
    };
    onShowAggNodeChange(value);
  }, [onShowAggNodeChange, showAggregatedNode])

  return <ToolBarContainer>
    <div className="item">
      <span>graphic type:</span> &nbsp;
      <select value={visType} name="visType" onChange={e => {
        onVisTypeChange(e.target.value as VisType);
      }}>
        {
          visTypeList.map(type => <option key={type} value={type}>{type}</option>)
        }
      </select>
    </div>
    <div className="item">
      <span>has aggregated node:</span>&nbsp;
      <span>row</span>
      <input type="checkbox" name={DimensionArea.row} checked={showAggregatedNode.row} onChange={checkboxHandler} />
      &nbsp;
      <span>column</span>
      <input type="checkbox" name={DimensionArea.column} checked={showAggregatedNode.column} onChange={checkboxHandler} />
    </div>
  </ToolBarContainer>
}

export default ToolBar