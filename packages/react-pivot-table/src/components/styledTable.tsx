import styled from 'styled-components';

export const StyledTable = styled.table`
  td {
    /* border: 1px solid #333; */
    padding: 8px;
    text-align: left;
    vertical-align:middle;
    font-weight: 300;
    font-size: 12px;
    color: #000;
    border-bottom: solid 1px rgba(0, 0, 0, 0.19);
  }
  thead {
    background-color: rgba(0, 0, 0, 0.14);
    th {
      padding: 8px;
      text-align: left;
      font-weight: 400;
      font-size: 12px;
      color: #000;
      white-space: nowrap;
      border-bottom: solid 1px rgba(0, 0, 0, 0.14);
    }
  }
`