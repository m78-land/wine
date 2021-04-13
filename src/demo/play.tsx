import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import Wine from '../index';
import '../style.css';

const Play = () => {
  useEffect(() => {
    Wine.events.change.on(() => {
      console.log(111);
    });
  }, []);

  function renderHandle() {
    Wine.render({
      content: (
        <div style={{ padding: 20, fontSize: 24 }}>
          <h2>My Window!</h2>
          <div>🤞🤞🤞🤞</div>
        </div>
      ),
      sizeRatio: 0.5,
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
