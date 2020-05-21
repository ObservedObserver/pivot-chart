import styled from 'styled-components';
import { getTheme } from '../theme';
const theme = getTheme();
export const StyledTable = styled.table`
  border-collapse: collapse;
  box-sizing: content-box;
  font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
  tbody {
    td {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
      vertical-align:middle;
      font-weight: 300;
      font-size: 12px;
      color: ${porps => theme.table.color};
      border: solid 1px ${props => theme.table.borderColor};
      text-align: right;
      box-sizing: content-box;
    }
  }
  thead {
    background-color: ${props => theme.table.thead.backgroundColor};
    th {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
      font-weight: 400;
      font-size: 12px;
      color: ${props => theme.table.thead.color};
      white-space: nowrap;
      border: solid 1px ${props => theme.table.borderColor};
      box-sizing: content-box;
    }
    th.highlight {
      background-color: ${props => theme.table.highlightBGColor};
    }
  }
  thead.vis {
    th{
      height: 250px;
    }
  }
  tbody.vis{
    td{
      div.vis-container{
        height: 250px;
        overflow-y: hidden;
        text-align: left;
      }
    }
  }
`
