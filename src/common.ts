import { AnyFunction } from '@lxjx/utils';
import React from 'react';
import {
  BoundMeta,
  BoundSizeMeta,
  TupleNumber,
  WineContext,
  _TipNodeStatusItem,
  _WineSelf,
} from './types';
import { DEFAULT_FULL_LIMIT_BOUND, TIP_NODE_KEY } from './consts';

/** 根据alignment值获取x, y值 */
export function calcAlignment(
  alignment: TupleNumber,
  availableSize: TupleNumber,
  limit: BoundMeta,
  self: _WineSelf,
) {
  // 实际可用的空间 * 定位位置比 + 左上的limit偏移
  const [aW, aH] = self.availableSize;
  const w = aW - limit.left - limit.right;
  const h = aH - limit.top - limit.bottom;

  const [aX, aY] = alignment;

  const x = w * aX;
  const y = h * aY;

  return [x + limit.left, y + limit.top];
}

/** 根据[number, height]格式的元组取{ w, h }格式的对象 */
export function sizeTuple2Obj(sizeT: TupleNumber) {
  return {
    w: sizeT[0],
    h: sizeT[1],
  };
}

/** sizeTuple2Obj的偏移版本` */
export function offsetTuple2Obj(offsetT: TupleNumber) {
  return {
    x: offsetT[0],
    y: offsetT[1],
  };
}

/** 根据状态获取当前尺寸 */
export function getSizeByState(state: WineContext['state']) {
  let w;
  let h;

  if (state.width) w = state.width;
  if (state.height) h = state.height;

  if (!h) h = state.sizeRatio * window.innerHeight;
  if (!w) w = h * 1.3;

  return [w, h] as TupleNumber;
}

/** 创建一个空的dom节点 */
export function getTipNode() {
  if (typeof window === 'undefined') return;
  if (typeof window.document === 'undefined') return;

  const el = document.getElementById(TIP_NODE_KEY) as HTMLDivElement;

  if (el) return el;

  const div = document.createElement('div');
  div.id = TIP_NODE_KEY;
  div.className = 'm78-wine_tip-node';

  document.body.appendChild(div);

  return div;
}

/** 检测指定的xy点是否在 */
export function checkPointerInBound([x, y]: TupleNumber, bound: BoundSizeMeta) {
  return (
    x >= bound.left &&
    x <= bound.left + bound.width &&
    y >= bound.top &&
    y <= bound.top + bound.height
  );
}

/** 便捷获取尺寸对象 */
export function sizeBoundHelper(
  left: number,
  top: number,
  width: number,
  height: number,
): BoundSizeMeta {
  return {
    top,
    left,
    width,
    height,
  };
}

/** 传入光标位置、屏幕相关信息，获取触发tip节点的方向信息 */
export function getTipNodeStatus(
  [fW, fH]: TupleNumber,
  xy: TupleNumber,
  limitBound?: Partial<BoundMeta>,
): _TipNodeStatusItem | undefined {
  const flb = { ...DEFAULT_FULL_LIMIT_BOUND, ...limitBound };

  /** 基础偏移 */
  const offset = 6;
  /* 区块厚度 */
  const size = 50;
  /* 两侧区块占用的宽度 */
  const sideWidth = fW * 0.2;
  /* 两侧区块占用的高度 */
  const sideHeight = fH * 0.2;
  /* 中间区块占用的高度 */
  const centerHeight = fH * 0.6;
  /* 中间区块的宽度 */
  const centerWidth = fW * 0.6;
  /* 全屏高度的一半 */
  const fHHalf = fH / 2;
  /* 全屏宽度的一半 */
  const fWHalf = fW / 2;

  /* TODO: 下方的一些计算可以抽取为通用变量来提升一点点性能 */

  const tBound = sizeBoundHelper(sideWidth + size + flb.left, offset + flb.top, centerWidth, size);

  if (checkPointerInBound(xy, tBound)) {
    return {
      bound: tBound,
      size: sizeBoundHelper(flb.left, flb.top, fW, fHHalf),
    };
  }

  const rBound = sizeBoundHelper(
    fW - size - offset + flb.left,
    sideHeight + offset + flb.top,
    size,
    centerHeight,
  );

  if (checkPointerInBound(xy, rBound)) {
    return {
      bound: rBound,
      size: sizeBoundHelper(fWHalf + flb.left, flb.top, fWHalf, fH),
    };
  }

  const bBound = sizeBoundHelper(
    sideWidth + offset + flb.left,
    fH - size - offset + flb.top,
    centerWidth,
    size,
  );

  if (checkPointerInBound(xy, bBound)) {
    return {
      bound: bBound,
      size: sizeBoundHelper(flb.left, fHHalf + flb.top, fW, fHHalf),
    };
  }

  const lBound = sizeBoundHelper(
    offset + flb.left,
    sideHeight + offset + flb.top,
    size,
    centerHeight,
  );

  if (checkPointerInBound(xy, lBound)) {
    return {
      bound: bBound,
      size: sizeBoundHelper(flb.left, flb.top, fWHalf, fH),
    };
  }

  const ltBound = sizeBoundHelper(offset + flb.left, offset + flb.top, size, size);

  if (checkPointerInBound(xy, ltBound)) {
    return {
      bound: ltBound,
      size: sizeBoundHelper(flb.left, flb.top, fWHalf, fHHalf),
    };
  }

  const lbBound = sizeBoundHelper(offset + flb.left, fH - offset - size + flb.top, size, size);

  if (checkPointerInBound(xy, lbBound)) {
    return {
      bound: lbBound,
      size: sizeBoundHelper(flb.left, fHHalf + flb.top, fWHalf, fHHalf),
    };
  }

  const rtBound = sizeBoundHelper(fW - offset - size + flb.left, offset + flb.top, size, size);

  if (checkPointerInBound(xy, rtBound)) {
    return {
      bound: rtBound,
      size: sizeBoundHelper(fWHalf + flb.left, flb.top, fWHalf, fHHalf),
    };
  }

  const rbBound = sizeBoundHelper(
    fW - offset - size + flb.left,
    fH - offset - size + flb.top,
    size,
    size,
  );

  if (checkPointerInBound(xy, rbBound)) {
    return {
      bound: rbBound,
      size: sizeBoundHelper(fWHalf + flb.left, fHHalf + flb.top, fWHalf, fHHalf),
    };
  }
}

/**
 * 便捷的按键和点击时间绑定  TODO: 提到utils
 * @param handle - 时间处理函数
 * @param spaceTrigger - 按下空格时是否触发
 * */
export function keypressAndClick(handle: AnyFunction, spaceTrigger = true) {
  return {
    onClick: handle,
    onKeyPress: (e: React.KeyboardEvent) => {
      const code = e.code;

      if (code === 'Enter' || (spaceTrigger && code === 'Space')) {
        handle?.();
      }
    },
  };
}
