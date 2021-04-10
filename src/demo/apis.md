---
title: Apis
order: 3
---

## RenderApi

`wine`使用`render-api`来进行外部渲染，具体用法可参考其文档<https://m78-core.github.io/render-api/>

## WineState

```ts
interface WineState {
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
```

## 扩展的实例方法

```ts
interface WineInstanceExtend {
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
```
