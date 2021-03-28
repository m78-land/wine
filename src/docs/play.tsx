import React from 'react';
import Wine from '@m78/wine';

const Play = () => {
  function renderHandle() {
    Wine.render({
      alignment: [0.45, 0.45],
      content: (
        <div>
          <h2>window 1</h2>
          <div>🤞</div>
          <div>🤞</div>
          <div>🤞</div>
          <div>🤞</div>
        </div>
      ),
      sizeRatio: 0.5,
    });

    Wine.render({
      alignment: [0.5, 0.5],
      content: (
        <div>
          <h2>window 2</h2>
          <div>🤞</div>
          <div>🤞</div>
          <div>🤞</div>
          <div>🤞</div>
        </div>
      ),
      sizeRatio: 0.5,
    });

    Wine.render({
      alignment: [0.55, 0.55],
      content: (
        <div>
          <h2>window 3</h2>
          <div>🤞</div>
          <div>🤞</div>
          <div>🤞</div>
          <div>🤞</div>
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

export default Play;
