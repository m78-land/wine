import { useMemo, useRef } from 'react';
import { useSelf, useSetState } from '@lxjx/hooks';
import { config, useSpring } from 'react-spring';
import {
  _WineSelf,
  WineAnimateProps,
  WineContext,
  WineInsideState,
  WineInstance,
  WineProps,
} from './types';

import { DEFAULT_PROPS, NO_LIMIT_AREA } from './consts';
import { useMethods } from './useMethods';
import { useLifeCycle } from './useLifeCycle';
import { render } from './render';
import { getSizeByState } from './common';

import './style.css';

type trimDefaultState = WineProps['state'] & typeof DEFAULT_PROPS;

const WineImpl = (props: WineProps) => {
  const { state, instance } = props;

  const [insideState, setInsideState] = useSetState<WineInsideState>(() => ({
    isFull: false,
    headerHeight: undefined,
  }));

  const wrapElRef = useRef<HTMLDivElement>(null!);
  const headerElRef = useRef<HTMLDivElement>(null!);

  const [spProps, update] = useSpring<WineAnimateProps>(() => {
    const [width, height] = getSizeByState(state as trimDefaultState);
    return {
      opacity: 0,
      x: 0,
      y: 0,
      config: config.stiff,
      width,
      height,
      display: 'none',
      visibility: 'hidden',
    };
  });

  const self = useSelf<_WineSelf>({
    x: 0,
    y: 0,
    winSize: [0, 0],
    availableSize: [0, 0],
    wrapSize: [0, 0],
    headerSize: [0, 0],
    fullSize: [0, 0],
    bound: NO_LIMIT_AREA,
    windowBound: NO_LIMIT_AREA,
  });

  const ctx: WineContext = {
    wrapElRef,
    headerElRef,
    state: state as trimDefaultState,
    setState: instance.setState,
    setInsideState,
    insideState,
    self,
    spProps,
    update: update as any,
    dragLineRRef: null as any,
    dragLineLRef: null as any,
    dragLineBRef: null as any,
    dragLineTRef: null as any,
    dragLineLTRef: null as any,
    dragLineRTRef: null as any,
    dragLineRBRef: null as any,
    dragLineLBRef: null as any,
  };

  const methods = useMethods(ctx);

  useLifeCycle(ctx, methods);

  const ins = useMemo(() => {
    (instance.current as any) = {
      el: wrapElRef,
      top: methods.top,
      full: methods.full,
      resize: methods.resize,
      refresh: () => {},
    };
    return instance as WineInstance;
  }, []);

  return render(ctx, methods, ins);
};

export default WineImpl;