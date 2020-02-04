import styled from 'styled-components';
export const TABLE_BG_COLOR = '#E9EDF2';
export const TABLE_BORDER_COLOR = '#DFE3E8';
export const StyledTable = styled.table`
  border-collapse: collapse;
  td {
    border: 1px solid #333;
    padding: 8px;
    text-align: left;
    vertical-align:middle;
    font-weight: 300;
    font-size: 12px;
    color: #333333;
    border: solid 1px ${TABLE_BORDER_COLOR};
    text-align: right;
  }
  thead {
    background-color: ${TABLE_BG_COLOR};
    th {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
      font-weight: 400;
      font-size: 12px;
      color: #5A6C84;
      white-space: nowrap;
      border: solid 1px ${TABLE_BORDER_COLOR};
    }
  }
`