import { useDrag } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import { useRef } from 'react';
import { isNumber, TupleNumber } from '@lxjx/utils';
import { WineContext, WineDragPositionEnum } from './types';
import { _Methods } from './useMethods';
import { sizeTuple2Obj } from './common';
import { MIN_SIZE } from './consts';

export function useDragResize(type: WineDragPositionEnum, ctx: WineContext, methods: _Methods) {
  const ref = useRef<HTMLDivElement>(null!);
  const { wrapElRef, self, update, insideState, setInsideState } = ctx;

  useDrag(
    ({ xy: [x, y] }) => {
      const wrapBound = wrapElRef.current.getBoundingClientRect();

      // 最终的动画对象
      const aniObj: any = {
        immediate: true,
      };

      if (type === WineDragPositionEnum.R) {
        aniObj.width = getRightMeta(wrapBound, [x, y]);
      }

      if (type === WineDragPositionEnum.B) {
        aniObj.height = getBottomMeta(wrapBound, [x, y]);
      }

      if (type === WineDragPositionEnum.L) {
        Object.assign(aniObj, getLeftMeta(wrapBound, [x, y]));
      }

      if (type === WineDragPositionEnum.T) {
        Object.assign(aniObj, getTopMeta(wrapBound, [x, y]));
      }

      if (type === WineDragPositionEnum.RB) {
        aniObj.width = getRightMeta(wrapBound, [x, y]);
        aniObj.height = getBottomMeta(wrapBound, [x, y]);
      }

      if (type === WineDragPositionEnum.LB) {
        Object.assign(aniObj, getLeftMeta(wrapBound, [x, y]));
        aniObj.height = getBottomMeta(wrapBound, [x, y]);
      }

      if (type === WineDragPositionEnum.LT) {
        Object.assign(aniObj, getLeftMeta(wrapBound, [x, y]));
        Object.assign(aniObj, getTopMeta(wrapBound, [x, y]));
      }

      if (type === WineDragPositionEnum.RT) {
        Object.assign(aniObj, getTopMeta(wrapBound, [x, y]));
        aniObj.width = getRightMeta(wrapBound, [x, y]);
      }

      if (isNumber(aniObj.x)) self.x = aniObj.x;
      if (isNumber(aniObj.y)) self.y = aniObj.y;

      update(aniObj).then(() => {
        methods.refreshDeps();
        if (insideState.isFull) setInsideState({ isFull: false });
      });
    },
    {
      domTarget: ref,
    },
  );

  function getRightMeta(wrapBound: DOMRect, [x]: TupleNumber) {
    /** 最终宽度 = 当前宽度 + 鼠标x位置 - 右侧位置 */
    const w = wrapBound.width + x - wrapBound.right;
    /** wLimit = bound位置 + wrap尺寸 - wrap相反方向偏移 */
    const wLimit = self.windowBound.right + wrapBound.width - wrapBound.left;

    return _clamp(w, 300, wLimit);
  }

  function getBottomMeta(wrapBound: DOMRect, [, y]: TupleNumber) {
    const h = wrapBound.height + y - wrapBound.bottom;
    const hLimit = self.windowBound.bottom + wrapBound.height - wrapBound.top;

    return _clamp(h, sizeTuple2Obj(self.headerSize).h, hLimit);
  }

  function getLeftMeta(wrapBound: DOMRect, [x]: TupleNumber) {
    /** 最终宽度 = 右侧位置 - 鼠标x位置 */
    const w = wrapBound.right - x;
    /** wLimit = 右侧位置 */
    const wLimit = wrapBound.right;

    return {
      x: _clamp(x, self.windowBound.left, wrapBound.right - MIN_SIZE),
      width: _clamp(w, MIN_SIZE, wLimit),
    };
  }

  function getTopMeta(wrapBound: DOMRect, [, y]: TupleNumber) {
    const h = wrapBound.bottom - y;
    const hLimit = wrapBound.bottom;

    return {
      y: _clamp(y, self.windowBound.top, wrapBound.bottom - MIN_SIZE),
      height: _clamp(h, MIN_SIZE, hLimit),
    };
  }

  return ref;
}
