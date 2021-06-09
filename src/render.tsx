import { animated } from 'react-spring';
import React from 'react';
import clsx from 'clsx';
import { WineProps, WineContext, WineInstance } from './types';
import { _Methods } from './useMethods';
import { keypressAndClick } from './common';

/** 渲染内置顶栏 */
const renderBuiltInHeader: NonNullable<WineProps['state']['headerCustomer']> = (
  props,
  instance,
  isFull,
) => {
  return (
    <div className="m78-wine_header" {...props}>
      <div className="m78-wine_header-content">{instance.state.headerNode}</div>
      <div className="m78-wine_header-actions" onMouseDown={e => e.stopPropagation()}>
        <span tabIndex={1} className="m78-wine_btn" {...keypressAndClick(instance.hide)}>
          <span className="m78-wine_hide-btn" />
        </span>
        {isFull && (
          <span
            tabIndex={1}
            className="m78-wine_btn"
            {...keypressAndClick(instance.current!.resize)}
          >
            <span className="m78-wine_resize-btn" />
          </span>
        )}
        {!isFull && (
          <span tabIndex={1} className="m78-wine_btn" {...keypressAndClick(instance.current!.full)}>
            <span className="m78-wine_max-btn" />
          </span>
        )}
        <span
          tabIndex={1}
          className="m78-wine_btn __warning"
          {...keypressAndClick(instance.dispose)}
        >
          <span className="m78-wine_dispose-btn" />
        </span>
      </div>
    </div>
  );
};

/** 渲染主内容 */
export function render(ctx: WineContext, methods: _Methods, instance: WineInstance) {
  const { state, insideState } = ctx;
  const { resize, full, top } = methods;

  const headerCustomer = state.headerCustomer || renderBuiltInHeader;

  return (
    <animated.div
      style={{
        ...state.style,
        zIndex: insideState.isTop ? state.zIndex + 1 : state.zIndex,
        ...(ctx.spProps as any),
      }}
      className={clsx('m78-wine', state.className, {
        __full: insideState.isFull,
        __active: insideState.isTop,
      })}
      ref={ctx.wrapElRef}
      onTouchStart={top}
      onMouseDown={top}
    >
      {/* decorate这一层用来添加背景、边框，最主要的目的是达到能在根级放一些可以超出根元素的节点而不受overflow影响 */}
      <div className="m78-wine_decorate">
        {headerCustomer(
          {
            ref: ctx.headerElRef,
            onDoubleClick: () => (insideState.isFull ? resize() : full()),
          },
          instance,
          insideState.isFull!,
        )}

        <div
          className="m78-wine_content m78-wine_scrollbar"
          style={{
            top: insideState.headerHeight,
          }}
        >
          <React.Fragment key={insideState.refreshKey}>{state.content}</React.Fragment>
        </div>
      </div>
      <div className="m78-wine_drag-line-l" ref={ctx.dragLineLRef} />
      <div className="m78-wine_drag-line-t" ref={ctx.dragLineTRef} />
      <div className="m78-wine_drag-line-r" ref={ctx.dragLineRRef} />
      <div className="m78-wine_drag-line-b" ref={ctx.dragLineBRef} />
      <div className="m78-wine_drag-line-rb" ref={ctx.dragLineRBRef} />
      <div className="m78-wine_drag-line-lb" ref={ctx.dragLineLBRef} />
      <div className="m78-wine_drag-line-lt" ref={ctx.dragLineLTRef} />
      <div className="m78-wine_drag-line-rt" ref={ctx.dragLineRTRef} />
    </animated.div>
  );
}
