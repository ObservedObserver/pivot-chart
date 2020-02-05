import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Field } from '../common';
import Select, { Option } from './select';
import produce from 'immer';

const RootContainer = styled.div`
  font-size: 12px;
`;

const FieldsContainer = styled.div`
  display: flex;
  padding: 0.2em;
  overflow: auto;
  min-height: 2.4em;
`;

const FieldListSegment = styled.div`
  display: flex;
  border: 1px solid #DFE3E8;
  margin: 0.2em;
  div.fl-header {
    flex-basis: 100px;
    border-right: 1px solid #DFE3E8;
    background-color: #DFE3E8;
    h4 {
      margin: 0.6em;
    }
  }
  div.fl-container {
    flex-grow: 10
  }
`;

const aggregatorList: Option[] = [
  {
    id: 'sum',
    name: 'Sum'
  },
  {
    id: 'mean',
    name: 'Mean'
  },
  {
    id: 'count',
    name: 'Count'
  }
]

const FieldListContainer: React.FC<{name: string}> = props => {
  return <FieldListSegment>
    <div className="fl-header">
      <h4>{props.name}</h4>
    </div>
    <div className="fl-container">
      { props.children }
    </div>
  </FieldListSegment>;
}

const FieldLabel = styled.div`
  padding: 0.2em 0.4em;
  margin: 0.2em;
  border-radius: 0.2em;
  background-color: #DFE3E8;
  color: #262626;
`;

interface DraggableFieldsProps {
  fields: Field[];
  onStateChange?: (state: DraggableFieldState) => void
}

export interface DraggableFieldState {
  fields: Field[];
  rows: Field[];
  columns: Field[];
  measures: Field[];
}

const initDraggableState: DraggableFieldState = {
  fields: [],
  rows: [],
  columns: [],
  measures: []
};

const draggableStateKeys = Object.keys(initDraggableState) as Array<keyof DraggableFieldState>;

function reorder (list: any[], originalIndex: number, targetIndex: number): any[] {
  const nextList = [...list];
  nextList.splice(originalIndex, 1);
  nextList.splice(targetIndex, 0, list[originalIndex]);
  return nextList;
}
interface movedLists {
  originList: any[];
  targetList: any[];
}
function move (originalList: any[], originIndex: number, targetList: any[], targetIndex: number): movedLists {
  let newOriginalList = [...originalList];
  let [removed] = newOriginalList.splice(originIndex, 1);
  let newTargetList = [...targetList];
  newTargetList.splice(targetIndex, 0, removed);
  return {
    originList: newOriginalList,
    targetList: newTargetList
  }
}
const DraggableFields: React.FC<DraggableFieldsProps> = props => {
  const { fields = [], onStateChange } = props;
  const [state, setState] = useState<DraggableFieldState>({
    fields: [],
    rows: [],
    columns: [],
    measures: []
  });
  useEffect(() => {
    setState({
      fields,
      rows: [],
      columns: [],
      measures: []
    });
  }, [fields])
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state])
  const onDragEnd = useCallback((result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.droppableId === result.source.droppableId) {
      if (result.destination.index === result.source.index) return;
      setState(state => {
        let listKey = (result.destination.droppableId as keyof DraggableFieldState);
        let newList = reorder(state[listKey], result.source.index, result.destination.index);
        return {
          ...state,
          [listKey]: newList
        }
      })
    } else {
      setState(state => {
        let sourceKey = result.source.droppableId as keyof DraggableFieldState;
        let targetKey = result.destination.droppableId as keyof DraggableFieldState;
        let { originList, targetList } = move(state[sourceKey], result.source.index, state[targetKey], result.destination.index);
        return {
          ...state,
          [sourceKey]: originList,
          [targetKey]: targetList
        }
      })
    }
  }, [setState]);
  return <RootContainer>
    <DragDropContext onDragEnd={onDragEnd}>
      {
        draggableStateKeys.map(dkey => <FieldListContainer name={dkey} key={dkey}>
          <Droppable droppableId={dkey} direction="horizontal">
            {
              (provided, snapshot) => <FieldsContainer
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                {
                  state[dkey].map((f, index) => <Draggable key={f.id} draggableId={f.id} index={index}>
                  {(provided, snapshot) => (
                    <FieldLabel
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {f.name}&nbsp;
                      {
                        dkey === 'measures' && <Select
                          options={aggregatorList}
                          value={f.aggName}
                          onChange={(value) => {
                            setState(state => {
                              const nextState = produce(state, draft => {
                                draft[dkey][index].aggName = value
                              });
                              return nextState;
                            })
                          }}
                          />
                      }
                    </FieldLabel>
                  )}
                </Draggable>)
                }
              </FieldsContainer>
            }
          </Droppable>
        </FieldListContainer>)
        }
    </DragDropContext>
  </RootContainer>
}

export default DraggableFields;
