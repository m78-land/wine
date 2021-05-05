import { useEffect } from 'react';
import { defer } from '@lxjx/utils';
import { useDrag } from 'react-use-gesture';
import { WineContext, WineDragPositionEnum } from './types';
import { _Methods } from './useMethods';
import { useDragResize } from './useDragResize';
import { DEFAULT_PROPS, OPEN_FALSE_ANIMATION, OPEN_TRUE_ANIMATION } from './consts';
import { updateZIndexEvent } from './event';
import { getTipNode } from './common';

export function useLifeCycle(ctx: WineContext, methods: _Methods) {
  const { update, state, setState, headerElRef, self, setInsideState } = ctx;
  const { refreshDeps, resize, setXY, full } = methods;

  // 标记销毁
  useEffect(
    () => () => {
      self.unmounted = true;
    },
    [],
  );

  // 初始化
  useEffect(() => {
    self.tipNode = getTipNode();

    // none状态下会影响尺寸计算
    update({
      immediate: true,
      display: 'block',
    }).then(() => {
      refreshDeps();

      // 防止窗口未设置偏移时抖动
      update({
        visibility: 'visible',
        immediate: true,
      });

      state.initFull ? full() : resize();

      defer(() => {
        setInsideState({
          headerHeight: self.headerSize[1],
        });
      });
    });
  }, []);

  // 窗口尺寸变更时刷新尺寸相关信息
  useEffect(() => {
    window.addEventListener('resize', refreshDeps);

    return () => window.removeEventListener('resize', refreshDeps);
  }, []);

  // 控制开关显示
  useEffect(() => {
    let ignore = false;

    if (state.open) {
      update({
        immediate: true,
        display: 'block',
      });
      update(OPEN_TRUE_ANIMATION);

      // 置顶
      methods.top();
    } else {
      update(OPEN_FALSE_ANIMATION).then(() => {
        if (ignore) return;
        update({
          immediate: true,
          display: 'none',
        });
      });
    }

    return () => {
      ignore = true;
    };
  }, [state.open]);

  // 监听置顶还原
  updateZIndexEvent.useEvent(() => {
    if (state.zIndex > DEFAULT_PROPS.zIndex) {
      setState({
        zIndex: DEFAULT_PROPS.zIndex,
      });
    }
  });

  useDrag(
    ({ memo = [], xy, down, delta: [dX, dY], event }) => {
      event.preventDefault();

      /*
       * cursorOffset记录事件开始时相对wrap左上角的位置
       * distance记录移动的总距离
       * */
      const [cursorOffset, distance] = memo;
      const _cursorOffset = cursorOffset || methods.getCursorWrapOffset(xy);

      setXY(xy[0] - _cursorOffset[0], xy[1] - _cursorOffset[1]);

      if (distance && distance > 60) {
        methods.refreshTipNode(xy, down);
      }

      return [_cursorOffset, (distance || 0) + Math.abs(dX) + Math.abs(dY)];
    },
    {
      domTarget: headerElRef,
      filterTaps: true,
      eventOptions: {
        passive: false,
      },
    },
  );

  ctx.dragLineRRef = useDragResize(WineDragPositionEnum.R, ctx, methods);
  ctx.dragLineLRef = useDragResize(WineDragPositionEnum.L, ctx, methods);
  ctx.dragLineBRef = useDragResize(WineDragPositionEnum.B, ctx, methods);
  ctx.dragLineTRef = useDragResize(WineDragPositionEnum.T, ctx, methods);
  ctx.dragLineLTRef = useDragResize(WineDragPositionEnum.LT, ctx, methods);
  ctx.dragLineRTRef = useDragResize(WineDragPositionEnum.RT, ctx, methods);
  ctx.dragLineRBRef = useDragResize(WineDragPositionEnum.RB, ctx, methods);
  ctx.dragLineLBRef = useDragResize(WineDragPositionEnum.LB, ctx, methods);
}
