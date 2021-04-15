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
    Wine.render({
      content: <Test />,
      sizeRatio: 0.5,
      alignment: [0.5, 0.5],
      // limitBound: {
      //   left: 200,
      //   top: 200,
      //   right: 100,
      //   bottom: 100,
      // }
    });
  }

  return (
    <div>
      <Wine.RenderBoxTarget />
      <button onClick={renderHandle}>render window</button>
    </div>
  );
};

ReactDOM.render(<Play />, document.getElementById('root'));
