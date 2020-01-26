import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Field } from '../common';

const RootContainer = styled.div`
  font-size: 12px;
`;

const FieldsContainer = styled.div`
  display: flex;
  padding: 0.2em;
  overflow: auto;
  min-height: 2.4em;
`;

const FieldListContainer: React.FC<{name: string}> = props => {
  return <div style={{ display: 'flex', border: '1px solid #8c8c8c', margin: '0.2em' }}>
    <div style={{ flexBasis: 100, flexGrow: 1, borderRight: '1px solid #8c8c8c', backgroundColor: '#f5f5f5' }}>{props.name}</div>
    <div style={{ flexGrow: 10 }}>
      { props.children }
    </div>
  </div>
}

const FieldLabel = styled.div`
  padding: 0.2em 0.4em;
  margin: 0.2em;
  border-radius: 0.2em;
  background-color: #d9d9d9;
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
                      {f.name}
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
