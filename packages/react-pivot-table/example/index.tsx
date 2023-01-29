import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AsyncApp from './async';
import SyncApp from './sync';

function App () {
  const [pageIndex, setPageIndex] = useState(0);
  return <div>
      <div className="ui top attached tabular menu">
        <div className={`${pageIndex === 0 && 'active'} item`} onClick={() => {
          setPageIndex(0);
        }}>Sync Pivot Table</div>
        <div className={`${pageIndex === 1 && 'active'} item`} onClick={() => {
          setPageIndex(1);
        }}>Async Pivot Table (WIP)</div>
      </div>
      <div className="ui bottom attached active tab segment">
        {
          pageIndex === 1 && <AsyncApp />
        }
        {
          pageIndex === 0 && <SyncApp />
        }
    </div>
    <div className="ui teal segment">
      <h3 className="ui header">Notes</h3>
      <ul>
        <li>fields: vars/columns in original datasets.</li>
        <li>measures: values to be aggregated in pivot table</li>
      </ul>
    </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));