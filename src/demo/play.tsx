import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import Wine from '../index';
import '../style.css';

function Test() {
  useEffect(() => {
    console.log('render');

    return () => console.log('unrender');
  }, []);

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      <h2>My Window!</h2>
      <div>🤞🤞🤞🤞 {Math.random()}</div>
    </div>
  );
}

const Play = () => {
  useEffect(() => {
    Wine.events.change.on(() => {
      console.log(111);
    });
  }, []);

  function renderHandle() {
    const task = Wine.render({
      content: <Test />
    });

    console.log(task);
  }

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          left: 200,
          top: 200,
          right: 100,
          bottom: 100,
          border: '1px solid red',
        }}
      />
      {/* <Wine.RenderBoxTarget /> */}
      <button onClick={renderHandle}>render window</button>
    </div>
  );
};

ReactDOM.render(<Play />, document.getElementById('root'));
