import create from '@m78/render-api';
import { WineInstance, WineState } from './types';
import { keypressAndClick } from './common';

import { DEFAULT_PROPS, NAME_SPACE } from './consts';
import WineImpl from './wine-impl';

const Wine = create<WineState, WineInstance>({
  component: WineImpl,
  defaultState: DEFAULT_PROPS,
  namespace: NAME_SPACE,
});

export { keypressAndClick };
export * from './types';
export default Wine;
