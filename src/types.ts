import React, { MutableRefObject, RefObject } from 'react';
import { PickAnimated, SpringValues } from 'react-spring';
import { SetState } from '@lxjx/hooks';
import { RenderApiComponentBaseProps, RenderApiComponentInstance } from '@m78/render-api';
import { DEFAULT_PROPS } from './consts';

export type TupleNumber = [number, number];

/** 描述位置信息 */
export type BoundMeta = { left: number; top: number; right: number; bottom: number };

/** 描述位置和尺寸信息 */
export type BoundSizeMeta = { left: number; top: number; width: number; height: number };

/** 内部实例属性 */
export interface _WineSelf {
  /** y轴位置，从动画中同步 */
  x: number;
  /** x轴位置，从动画中同步 */
  y: number;
  /** 窗口尺寸信息 */
  winSize: TupleNumber;
  /** 窗口内可用的x/y */
  availableSize: TupleNumber;
  /** 全屏大小 */
  fullSize: TupleNumber;
  /** 容器尺寸信息 */
  wrapSize: TupleNumber;
  /** 顶栏尺寸信息 */
  headerSize: TupleNumber;
  /** 当前使用的边界限制 */
  bound: BoundMeta;
  /** 当前的窗口限制信息 (即使使用safeArea，依然会在其他地方用到windowBound, 所以单独将其抽离出来) */
  windowBound: BoundMeta;
  /** 记录窗口位置尺寸等信息，全屏时设置，窗口大小切换时移除 */
  memoWrapSize?: TupleNumber;
  memoX?: number;
  memoY?: number;
  /** 用于resize提示的节点 */
  tipNode?: HTMLDivElement;
  /** 组件是否已卸载 */
  unmounted?: boolean;
}

/** 动画属性 */
export interface WineAnimateProps {
  opacity?: number;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}

/** 在各个位置共享的上下文状态 */
export interface WineContext {
  wrapElRef: MutableRefObject<HTMLDivElement>;
  headerElRef: MutableRefObject<HTMLDivElement>;
  dragLineRRef: MutableRefObject<HTMLDivElement>;
  dragLineLRef: MutableRefObject<HTMLDivElement>;
  dragLineBRef: MutableRefObject<HTMLDivElement>;
  dragLineTRef: MutableRefObject<HTMLDivElement>;
  dragLineLTRef: MutableRefObject<HTMLDivElement>;
  dragLineRTRef: MutableRefObject<HTMLDivElement>;
  dragLineRBRef: MutableRefObject<HTMLDivElement>;
  dragLineLBRef: MutableRefObject<HTMLDivElement>;

  state: WineProps['state'] & typeof DEFAULT_PROPS;
  setState: WineProps['instance']['setState'];
  insideState: WineInsideState;
  setInsideState: SetState<WineInsideState>;
  self: _WineSelf;
  spProps: SpringValues<PickAnimated<WineAnimateProps>>;
  /**
   * 更新动画
   * TODO: react-spring包类型异常，等后续更新修复 */
  update: (props: WineAnimateProps) => Promise<void>;
}

/** 描述可拖动范围 */
export enum WineBoundEnum {
  /** 窗口范围内 */
  window = 'window',
  /** 安全区域内, 确保不会因为误操作导致无法拖动 */
  safeArea = 'safeArea',
  /** 不限制 */
  noLimit = 'noLimit',
}

/** 描述可拖动方向 */
export enum WineDragPositionEnum {
  L,
  T,
  R,
  B,
  LT,
  RT,
  RB,
  LB,
}

/** 窗口状态 */
export interface WineState {
  /** 内容 */
  content: React.ReactNode;

  /* ##### 顶栏配置 ##### */
  /** 顶栏主要区域显示的内容 */
  headerNode?: React.ReactNode;
  /** 完全自定义顶栏，需要确保将props展开到header根节点上, .eg (<div {...props} className="myHeader" />) */
  headerCustomer?: (props: any, instance: WineInstance, isFull: boolean) => React.ReactNode;

  /* ##### 位置、尺寸 ##### */
  /** [0.5, 0.5] | 弹窗在屏幕上的位置, 取值为0 ~ 1 */
  alignment?: TupleNumber;
  /** 0.84 | 窗口占屏幕高度的比例, 取值为0 ~ 1, 如果未设置width，会根据此项计算得到的高度以合适比例设置宽度 */
  sizeRatio?: number;
  /** 宽度, 覆盖sizeRatio对应方向的配置 */
  width?: number;
  /** 高度, 覆盖sizeRatio对应方向的配置 */
  height?: number;
  /** WineBoundEnum.safeArea | 控制可拖动范围 */
  bound?: WineBoundEnum;
  /** 根据此限定对象进行屏幕可用边界修正, 影响全屏窗口大小和自动调整窗口大小的各种操作 */
  limitBound?: Partial<BoundMeta>;

  /* ##### 其他 #####  */
  /** 根节点额外类名 */
  className?: string;
  /** 根节点额外样式 */
  style?: React.CSSProperties;
  /** 1000 | zIndex层级，由于内部包含多窗口层级的一些优化，不建议单独修改此项，可以通过config全局更改 */
  zIndex?: number;
  /** 初始化时最大化显示 */
  initFull?: boolean;
}

export interface WineProps extends RenderApiComponentBaseProps<WineState> {}

/** wine内部状态 */
export interface WineInsideState {
  /** 是否全屏 */
  isFull?: boolean;
  /** 顶栏高度，只在顶部与内置高度不同时设置 */
  headerHeight?: number;
}

/** 扩展的实例属性和方法 */
export interface WineInstanceExtend {
  /** 对应的html节点 */
  el: RefObject<HTMLElement>;
  /** 置顶 */
  top: () => void;
  /** 最大化 */
  full: () => void;
  /** 重置大小 */
  resize: () => void;
  /** 刷新bound、尺寸等信息 */
  refresh: () => void;
}

/** wine实例 */
export interface WineInstance
  extends RenderApiComponentInstance<WineProps['state'], WineInstanceExtend> {}

/** 表示反馈节点的位置尺寸等信息 */
export interface _TipNodeStatusItem {
  size: BoundSizeMeta;
  bound: BoundSizeMeta;
}
/*
 * 其他可能有需要的配置
 * drag? boolean
 * resize?: boolean
 * animationType?: any;
 * onOpenChange?: (open: boolean) => void;
 * onResize?: (e: any) => void;
 * onDispose?: (e: any) => void;
 * 窗口的唯一id，可用于记录窗口状态(大小位置等)到session中并在下次开启时设置
 * id?: string;
 * */
