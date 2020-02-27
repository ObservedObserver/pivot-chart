import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AsyncApp from './async';
import SyncApp from './sync';

function App () {
  const [pageIndex, setPageIndex] = useState(1);
  return <div>
      <div className="ui top attached tabular menu">
        <div className={`${pageIndex === 0 && 'active'} item`} onClick={() => {
          setPageIndex(0);
        }}>Sync Pivot Table</div>
        <div className={`${pageIndex === 1 && 'active'} item`} onClick={() => {
          setPageIndex(1);
        }}>Async Pivot Table</div>
      </div>
      <div className="ui bottom attached active tab segment">
        {
          pageIndex === 1 && <AsyncApp />
        }
        {
          pageIndex === 0 && <SyncApp />
        }
    </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));