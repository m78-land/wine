import { AnyFunction } from '@lxjx/utils';
import React from 'react';
import { BoundMeta, BoundSizeMeta, TupleNumber, WineContext, _TipNodeStatusItem } from './types';
/** 根据alignment值获取x, y值 */
export declare function calcAlignment(alignment: TupleNumber, availableSize: TupleNumber): number[];
/** 根据[number, height]格式的元组取{ w, h }格式的对象 */
export declare function sizeTuple2Obj(sizeT: TupleNumber): {
    w: number;
    h: number;
};
/** sizeTuple2Obj的偏移版本` */
export declare function offsetTuple2Obj(offsetT: TupleNumber): {
    x: number;
    y: number;
};
/** 根据状态获取当前尺寸 */
export declare function getSizeByState(state: WineContext['state']): TupleNumber;
/** 创建一个空的dom节点 */
export declare function getTipNode(): HTMLDivElement | undefined;
/** 检测指定的xy点是否在 */
export declare function checkPointerInBound([x, y]: TupleNumber, bound: BoundSizeMeta): boolean;
/** 便捷获取尺寸对象 */
export declare function sizeBoundHelper(left: number, top: number, width: number, height: number): BoundSizeMeta;
/** 传入光标位置、屏幕相关信息，获取触发tip节点的方向信息 */
export declare function getTipNodeStatus([fW, fH]: TupleNumber, xy: TupleNumber, limitBound?: Partial<BoundMeta>): _TipNodeStatusItem | undefined;
/**
 * 便捷的按键和点击时间绑定  TODO: 提到utils
 * @param handle - 时间处理函数
 * @param spaceTrigger - 按下空格时是否触发
 * */
export declare function keypressAndClick(handle: AnyFunction, spaceTrigger?: boolean): {
    onClick: AnyFunction;
    onKeyPress: (e: React.KeyboardEvent) => void;
};
//# sourceMappingURL=common.d.ts.map