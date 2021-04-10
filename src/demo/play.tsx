import React from 'react';
import Wine from '@m78/wine';

const Play = () => {
  function renderHandle() {
    Wine.render({
      // alignment: [0.45, 0.45],f
      content: (
        <div style={{ padding: 20, fontSize: 24 }}>
          <h2>My Window!</h2>
          <div>🤞🤞🤞🤞</div>
        </div>
      ),
      // limitBound: {
      //   left: 260,
      //   top: 200,
      // },
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

export default Play;
