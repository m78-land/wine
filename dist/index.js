import create from '@m78/render-api';
import { __assign } from 'tslib';
import React, { useRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { createEvent, useFn, useSetState, useSelf } from '@lxjx/hooks';
import { animated, useSpring, config } from 'react-spring';
import { isNumber, defer, createRandString } from '@lxjx/utils';
import _clamp from 'lodash/clamp';
import _throttle from 'lodash/throttle';
import { useDrag } from 'react-use-gesture';
import clsx from 'clsx';

/** 描述可拖动范围 */
var WineBound;
(function (WineBound) {
    /** 窗口范围内 */
    WineBound["window"] = "window";
    /** 安全区域内, 确保不会因为误操作导致无法拖动 */
    WineBound["safeArea"] = "safeArea";
    /** 不限制 */
    WineBound["noLimit"] = "noLimit";
})(WineBound || (WineBound = {}));
/** 描述可拖动方向 */
var WineDragPosition;
(function (WineDragPosition) {
    WineDragPosition[WineDragPosition["L"] = 0] = "L";
    WineDragPosition[WineDragPosition["T"] = 1] = "T";
    WineDragPosition[WineDragPosition["R"] = 2] = "R";
    WineDragPosition[WineDragPosition["B"] = 3] = "B";
    WineDragPosition[WineDragPosition["LT"] = 4] = "LT";
    WineDragPosition[WineDragPosition["RT"] = 5] = "RT";
    WineDragPosition[WineDragPosition["RB"] = 6] = "RB";
    WineDragPosition[WineDragPosition["LB"] = 7] = "LB";
})(WineDragPosition || (WineDragPosition = {}));

/** 无bound限制 */
var NO_LIMIT_AREA = { left: -Infinity, right: Infinity, top: -Infinity, bottom: Infinity };
var DEFAULT_FULL_LIMIT_BOUND = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};
/** 窗口最小尺寸 */
var MIN_SIZE = 300;
/** 默认props */
var DEFAULT_PROPS = {
    alignment: [0.5, 0.5],
    sizeRatio: 0.84,
    bound: WineBound.safeArea,
    initFull: false,
    zIndex: 1000,
};
var OPEN_FALSE_ANIMATION = {
    opacity: 0,
};
var OPEN_TRUE_ANIMATION = {
    opacity: 1,
};
var TIP_NODE_KEY = 'J__M78__TIP__NODE';
var NAME_SPACE = 'M78__WINE';

/** 根据alignment值获取x, y值 */
function calcAlignment(alignment, limit, self) {
    var _a = self.availableSize, aW = _a[0], aH = _a[1];
    var w = aW - limit.left - limit.right;
    var h = aH - limit.top - limit.bottom;
    var aX = alignment[0], aY = alignment[1];
    var x = w * aX;
    var y = h * aY;
    return [x + limit.left, y + limit.top];
}
/** 根据[number, height]格式的元组取{ w, h }格式的对象 */
function sizeTuple2Obj(sizeT) {
    return {
        w: sizeT[0],
        h: sizeT[1],
    };
}
/** sizeTuple2Obj的偏移版本` */
function offsetTuple2Obj(offsetT) {
    return {
        x: offsetT[0],
        y: offsetT[1],
    };
}
/** 根据state状态获取当前尺寸 */
function getSizeByState(state) {
    var w;
    var h;
    var _a = getFullSize(state), fW = _a[0], fH = _a[1];
    if (state.width)
        w = state.width;
    if (state.height)
        h = state.height;
    // 横纵屏与不同的方式作用sizeRatio, 横屏以高度为基准，竖屏一宽度为基准
    if (fW > fH) {
        if (!h)
            h = state.sizeRatio * fH;
        if (!w)
            w = h * 1.3;
    }
    else {
        if (!w)
            w = state.sizeRatio * fW;
        if (!h)
            h = w / 1.3;
    }
    return [Math.min(Math.floor(w), fW), Math.min(Math.floor(h), fH)];
}
/** 创建一个空的dom节点 */
function getTipNode() {
    if (typeof window === 'undefined')
        return;
    if (typeof window.document === 'undefined')
        return;
    var el = document.getElementById(TIP_NODE_KEY);
    if (el)
        return el;
    var div = document.createElement('div');
    div.id = TIP_NODE_KEY;
    div.className = 'm78-wine_tip-node';
    document.body.appendChild(div);
    return div;
}
//
// /** 检测指定的xy点是否在 */
// export function checkPointerInBound([x, y]: TupleNumber, bound: BoundSize) {
//   return (
//     x >= bound.left &&
//     x <= bound.left + bound.width &&
//     y >= bound.top &&
//     y <= bound.top + bound.height
//   );
// }
/** 便捷获取尺寸对象 */
function sizeBoundHelper(left, top, width, height) {
    return {
        top: top,
        left: left,
        width: width,
        height: height,
    };
}
/** 传入光标位置、屏幕相关信息，获取触发tip节点的方向信息 */
function getTipNodeStatus(_a, xy, limitBound) {
    var fW = _a[0], fH = _a[1];
    var flb = __assign(__assign({}, DEFAULT_FULL_LIMIT_BOUND), limitBound);
    /* 全屏高度的一半 */
    var fHHalf = fH / 2;
    /* 全屏宽度的一半 */
    var fWHalf = fW / 2;
    var x = xy[0], y = xy[1];
    /* 以下4变量偏移1px是为了防止全屏时光标无法移动到边缘外，所以主动减少区域 */
    // 可用区域右侧
    var avaRight = flb.left + fW - 1;
    // 可用区域底部
    var avaBottom = flb.top + fH - 1;
    /** 光标是否在水平方向的中部 */
    var cursorInHorizontalCenter = x > flb.left + 1 && x < avaRight;
    /** 光标是否在垂直方向的中部 */
    var cursorInVerticalCenter = y > flb.top + 1 && y < avaBottom;
    var inTop = y <= flb.top && cursorInHorizontalCenter;
    if (inTop)
        return sizeBoundHelper(flb.left, flb.top, fW, fHHalf);
    var inRight = x >= avaRight && cursorInVerticalCenter;
    if (inRight)
        return sizeBoundHelper(fWHalf + flb.left, flb.top, fWHalf, fH);
    var inBottom = y >= avaBottom && cursorInHorizontalCenter;
    if (inBottom)
        return sizeBoundHelper(flb.left, fHHalf + flb.top, fW, fHHalf);
    var inLeft = x <= flb.left && cursorInVerticalCenter;
    if (inLeft)
        return sizeBoundHelper(flb.left, flb.top, fWHalf, fH);
    var inLT = x <= flb.left && y <= flb.top;
    if (inLT)
        return sizeBoundHelper(flb.left, flb.top, fWHalf, fHHalf);
    var inLB = x <= flb.left && y >= avaBottom;
    if (inLB)
        return sizeBoundHelper(flb.left, fHHalf + flb.top, fWHalf, fHHalf);
    var inRT = x >= avaRight && y <= flb.top;
    if (inRT)
        return sizeBoundHelper(fWHalf + flb.left, flb.top, fWHalf, fHHalf);
    var inRB = x >= avaRight && y >= avaBottom;
    if (inRB)
        return sizeBoundHelper(fWHalf + flb.left, fHHalf + flb.top, fWHalf, fHHalf);
}
/**
 * 便捷的按键和点击事件绑定  TODO: 提到utils
 * @param handle - 时间处理函数
 * @param spaceTrigger - 按下空格时是否触发
 * */
function keypressAndClick(handle, spaceTrigger) {
    if (spaceTrigger === void 0) { spaceTrigger = true; }
    return {
        onClick: handle,
        onKeyPress: function (e) {
            var code = e.code;
            if (code === 'Enter' || (spaceTrigger && code === 'Space')) {
                handle === null || handle === void 0 ? void 0 : handle();
            }
        },
    };
}
/** 根据state获取fullSize */
function getFullSize(_state) {
    var fullSize = [window.innerWidth, window.innerHeight];
    if (_state.limitBound) {
        var flb = __assign(__assign({}, DEFAULT_FULL_LIMIT_BOUND), _state.limitBound);
        var fW = fullSize[0] - flb.left - flb.right;
        var fH = fullSize[1] - flb.top - flb.bottom;
        fullSize = [fW, fH];
    }
    return fullSize;
}

/** 某个窗口点击时通知其他窗口更新zIndex */
var updateZIndexEvent = createEvent();

function useMethods(context) {
    var state = context.state, self = context.self, wrapElRef = context.wrapElRef, headerElRef = context.headerElRef, insideState = context.insideState, setInsideState = context.setInsideState, spApi = context.spApi;
    /** 更新窗口、bound、warp等信息 (不触发render), 在窗口位置、尺寸等变更完毕后应该调用此方法 */
    function refreshDeps() {
        if (self.unmounted)
            return;
        var w = wrapElRef.current.offsetWidth;
        var h = wrapElRef.current.offsetHeight;
        var headerW = headerElRef.current.offsetWidth;
        var headerH = headerElRef.current.offsetHeight;
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        self.wrapSize = [w, h];
        self.headerSize = [headerW, headerH];
        self.availableSize = [winW - w, winH - h];
        self.winSize = [winW, winH];
        self.fullSize = getFullSize(state);
        setBound();
    }
    /** 计算并设置bound */
    function setBound() {
        var _a = self.availableSize, availableW = _a[0], availableH = _a[1];
        var _b = self.wrapSize, wrapW = _b[0], wrapH = _b[1];
        self.windowBound = {
            left: 0,
            top: 0,
            right: availableW,
            bottom: availableH,
        };
        if (state.bound === WineBound.window) {
            self.bound = self.windowBound;
            return;
        }
        if (state.bound === WineBound.safeArea) {
            var minOffset = sizeTuple2Obj(self.headerSize).h;
            self.bound = {
                left: -wrapW + minOffset,
                top: 0,
                right: availableW + wrapW - minOffset,
                bottom: availableH + wrapH - minOffset,
            };
            return;
        }
        self.bound = NO_LIMIT_AREA;
    }
    /** 设置XY并更新到self中的快捷方式，同时也支持传入其他配置 */
    function setXY(x, y, extra) {
        self.x = Math.floor(_clamp(x, self.bound.left, self.bound.right));
        self.y = Math.floor(_clamp(y, self.bound.top, self.bound.bottom));
        if (insideState.isFull) {
            setInsideState({
                isFull: false,
            });
        }
        var res = spApi.start(__assign({ x: self.x, y: self.y, immediate: true, default: true }, extra));
        // TODO: 是否有效
        return Promise.all(res);
    }
    /** 根据当前窗口信息和alignment设置窗口位置, 如果包含缓存的窗口信息则使用缓存信息 */
    function resize() {
        var _a = self.memoXY || [], x = _a[0], y = _a[1];
        var _b = self.memoWrapSize || [], width = _b[0], height = _b[1];
        var flb = __assign(__assign({}, DEFAULT_FULL_LIMIT_BOUND), state.limitBound);
        // 没有历史尺寸
        if (!isNumber(width) || !isNumber(height)) {
            var _c = getSizeByState(state), w = _c[0], h = _c[1];
            width = w;
            height = h;
        }
        // 没有历史位置
        if (!isNumber(x) || !isNumber(y)) {
            var pos = calcAlignment(state.alignment, flb, self);
            x = pos[0];
            y = pos[1];
        }
        /** 防止当前限制影响定位 */
        self.bound = NO_LIMIT_AREA;
        setXY(x, y, {
            width: width,
            height: height,
        }).then(function () {
            refreshDeps();
        });
    }
    /** 最大化窗口 */
    function full() {
        var _a, _b;
        if (insideState.isFull)
            return;
        memoWinState();
        /** 防止当前限制影响定位 */
        self.bound = NO_LIMIT_AREA;
        setXY(((_a = state.limitBound) === null || _a === void 0 ? void 0 : _a.left) || DEFAULT_FULL_LIMIT_BOUND.left, ((_b = state.limitBound) === null || _b === void 0 ? void 0 : _b.top) || DEFAULT_FULL_LIMIT_BOUND.top, {
            width: self.fullSize[0],
            height: self.fullSize[1],
        }).then(function () {
            refreshDeps();
            setInsideState({
                isFull: true,
            });
        });
    }
    function top() {
        var _a;
        updateZIndexEvent.emit();
        if (!insideState.isTop) {
            setInsideState({
                isTop: true,
            });
            (_a = state.onActive) === null || _a === void 0 ? void 0 : _a.call(state);
        }
    }
    /** 记录创建基础状态，尺寸、位置等，用于还原 */
    function memoWinState() {
        var flb = __assign(__assign({}, DEFAULT_FULL_LIMIT_BOUND), state.limitBound);
        self.memoWrapSize = self.wrapSize;
        /** 根据fullLimitBound进行修正，防止默认最大化切换为最小化时窗口跳到最左上角 */
        self.memoXY = [Math.max(self.x, flb.left), Math.max(self.y, flb.top)];
    }
    /** 根据光标位置和warp位置来计算光标在wrap上所处位置 */
    function getCursorWrapOffset(xy) {
        var wrapBound = wrapElRef.current.getBoundingClientRect();
        var cursorXY = offsetTuple2Obj(xy);
        return [cursorXY.x - wrapBound.left, cursorXY.y - wrapBound.top];
    }
    /** 根据当前状态和光标时间状态重新设置提示节点 */
    var refreshTipNode = useFn(function (xy, down) {
        if (!self.tipNode)
            return;
        var tipNodeStatus = getTipNodeStatus(self.fullSize, xy, state.limitBound);
        if (!down) {
            hideTipNode();
            if (tipNodeStatus) {
                var size = tipNodeStatus;
                setXY(size.left, size.top, {
                    width: size.width,
                    height: size.height,
                }).then(refreshDeps);
            }
            return;
        }
        if (tipNodeStatus) {
            showTipNode();
            Object.entries(tipNodeStatus).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                if (self.tipNode) {
                    var oldVal = self.tipNode.style[key];
                    var valStr = val + "px";
                    if (valStr !== oldVal) {
                        self.tipNode.style[key] = valStr;
                    }
                }
            });
        }
        else {
            hideTipNode();
        }
    }, function (fn) { return _throttle(fn, 10); });
    /** 隐藏提示节点 */
    function hideTipNode() {
        if (!self.tipNode)
            return;
        if (self.tipNode.style.visibility !== 'hidden') {
            self.tipNode.style.visibility = 'hidden';
            self.tipNode.style.opacity = '0';
        }
    }
    /** 显示提示节点 */
    function showTipNode() {
        if (!self.tipNode)
            return;
        if (self.tipNode.style.visibility !== 'visible') {
            self.tipNode.style.visibility = 'visible';
            self.tipNode.style.opacity = '1';
        }
    }
    return {
        refreshDeps: refreshDeps,
        setXY: setXY,
        resize: resize,
        full: full,
        getCursorWrapOffset: getCursorWrapOffset,
        top: top,
        refreshTipNode: refreshTipNode,
    };
}

function useDragResize(type, ctx, methods) {
    var ref = useRef(null);
    var wrapElRef = ctx.wrapElRef, self = ctx.self, spApi = ctx.spApi, insideState = ctx.insideState, setInsideState = ctx.setInsideState;
    useDrag(function (_a) {
        var _b = _a.xy, x = _b[0], y = _b[1];
        var wrapBound = wrapElRef.current.getBoundingClientRect();
        // 最终的动画对象
        var aniObj = {
            immediate: true,
        };
        if (type === WineDragPosition.R) {
            aniObj.width = getRightMeta(wrapBound, [x, y]);
        }
        if (type === WineDragPosition.B) {
            aniObj.height = getBottomMeta(wrapBound, [x, y]);
        }
        if (type === WineDragPosition.L) {
            Object.assign(aniObj, getLeftMeta(wrapBound, [x, y]));
        }
        if (type === WineDragPosition.T) {
            Object.assign(aniObj, getTopMeta(wrapBound, [x, y]));
        }
        if (type === WineDragPosition.RB) {
            aniObj.width = getRightMeta(wrapBound, [x, y]);
            aniObj.height = getBottomMeta(wrapBound, [x, y]);
        }
        if (type === WineDragPosition.LB) {
            Object.assign(aniObj, getLeftMeta(wrapBound, [x, y]));
            aniObj.height = getBottomMeta(wrapBound, [x, y]);
        }
        if (type === WineDragPosition.LT) {
            Object.assign(aniObj, getLeftMeta(wrapBound, [x, y]));
            Object.assign(aniObj, getTopMeta(wrapBound, [x, y]));
        }
        if (type === WineDragPosition.RT) {
            Object.assign(aniObj, getTopMeta(wrapBound, [x, y]));
            aniObj.width = getRightMeta(wrapBound, [x, y]);
        }
        if (isNumber(aniObj.x))
            self.x = aniObj.x;
        if (isNumber(aniObj.y))
            self.y = aniObj.y;
        Promise.all(spApi(aniObj)).then(function () {
            methods.refreshDeps();
            if (insideState.isFull)
                setInsideState({ isFull: false });
        });
    }, {
        domTarget: ref,
    });
    function getRightMeta(wrapBound, _a) {
        var x = _a[0];
        /** 最终宽度 = 当前宽度 + 鼠标x位置 - 右侧位置 */
        var w = wrapBound.width + x - wrapBound.right;
        /** wLimit = bound位置 + wrap尺寸 - wrap相反方向偏移 */
        var wLimit = self.windowBound.right + wrapBound.width - wrapBound.left;
        return _clamp(w, 300, wLimit);
    }
    function getBottomMeta(wrapBound, _a) {
        var y = _a[1];
        var h = wrapBound.height + y - wrapBound.bottom;
        var hLimit = self.windowBound.bottom + wrapBound.height - wrapBound.top;
        return _clamp(h, sizeTuple2Obj(self.headerSize).h, hLimit);
    }
    function getLeftMeta(wrapBound, _a) {
        var x = _a[0];
        /** 最终宽度 = 右侧位置 - 鼠标x位置 */
        var w = wrapBound.right - x;
        /** wLimit = 右侧位置 */
        var wLimit = wrapBound.right;
        return {
            x: _clamp(x, self.windowBound.left, wrapBound.right - MIN_SIZE),
            width: _clamp(w, MIN_SIZE, wLimit),
        };
    }
    function getTopMeta(wrapBound, _a) {
        var y = _a[1];
        var h = wrapBound.bottom - y;
        var hLimit = wrapBound.bottom;
        return {
            y: _clamp(y, self.windowBound.top, wrapBound.bottom - MIN_SIZE),
            height: _clamp(h, MIN_SIZE, hLimit),
        };
    }
    return ref;
}

function useLifeCycle(ctx, methods) {
    var spApi = ctx.spApi, state = ctx.state, headerElRef = ctx.headerElRef, self = ctx.self, setInsideState = ctx.setInsideState, insideState = ctx.insideState;
    var refreshDeps = methods.refreshDeps, resize = methods.resize, setXY = methods.setXY, full = methods.full;
    // 标记销毁
    useEffect(function () { return function () {
        self.unmounted = true;
    }; }, []);
    // 初始化
    useEffect(function () {
        self.tipNode = getTipNode();
        // none状态下会影响尺寸计算
        Promise.all(spApi.start({
            immediate: true,
            display: 'block',
        })).then(function () {
            refreshDeps();
            // 防止窗口未设置偏移时抖动
            spApi.start({
                visibility: 'visible',
                immediate: true,
            });
            state.initFull ? full() : resize();
            defer(function () {
                setInsideState({
                    headerHeight: self.headerSize[1],
                });
            });
        });
    }, []);
    // 窗口尺寸变更时刷新尺寸相关信息
    useEffect(function () {
        window.addEventListener('resize', refreshDeps);
        return function () { return window.removeEventListener('resize', refreshDeps); };
    }, []);
    // 控制开关显示
    useEffect(function () {
        var ignore = false;
        if (state.show) {
            spApi.start({
                immediate: true,
                display: 'block',
            });
            spApi.start(OPEN_TRUE_ANIMATION);
            // 置顶
            methods.top();
        }
        else {
            Promise.all(spApi.start(OPEN_FALSE_ANIMATION)).then(function () {
                if (ignore)
                    return;
                spApi.start({
                    immediate: true,
                    display: 'none',
                });
            });
        }
        return function () {
            ignore = true;
        };
    }, [state.show]);
    // 监听置顶还原
    updateZIndexEvent.useEvent(function () {
        if (insideState.isTop) {
            setInsideState({
                isTop: false,
            });
        }
    });
    useDrag(function (_a) {
        var _b = _a.memo, memo = _b === void 0 ? [] : _b, xy = _a.xy, down = _a.down, _c = _a.delta, dX = _c[0], dY = _c[1], event = _a.event, tap = _a.tap;
        event.preventDefault();
        if (tap)
            return;
        /*
         * cursorOffset记录事件开始时相对wrap左上角的位置
         * distance记录移动的总距离
         * */
        var cursorOffset = memo[0], distance = memo[1];
        var _cursorOffset = cursorOffset || methods.getCursorWrapOffset(xy);
        setXY(xy[0] - _cursorOffset[0], xy[1] - _cursorOffset[1]);
        if (distance && distance > 60) {
            methods.refreshTipNode(xy, down);
        }
        return [_cursorOffset, (distance || 0) + Math.abs(dX) + Math.abs(dY)];
    }, {
        domTarget: headerElRef,
        filterTaps: true,
        eventOptions: {
            passive: false,
        },
    });
    ctx.dragLineRRef = useDragResize(WineDragPosition.R, ctx, methods);
    ctx.dragLineLRef = useDragResize(WineDragPosition.L, ctx, methods);
    ctx.dragLineBRef = useDragResize(WineDragPosition.B, ctx, methods);
    ctx.dragLineTRef = useDragResize(WineDragPosition.T, ctx, methods);
    ctx.dragLineLTRef = useDragResize(WineDragPosition.LT, ctx, methods);
    ctx.dragLineRTRef = useDragResize(WineDragPosition.RT, ctx, methods);
    ctx.dragLineRBRef = useDragResize(WineDragPosition.RB, ctx, methods);
    ctx.dragLineLBRef = useDragResize(WineDragPosition.LB, ctx, methods);
}

/** 渲染内置顶栏 */
var renderBuiltInHeader = function (props, state, instance, isFull) {
    return (React.createElement("div", __assign({ className: "m78-wine_header" }, props),
        React.createElement("div", { className: "m78-wine_header-content" }, state.header),
        React.createElement("div", { className: "m78-wine_header-actions", onMouseDown: function (e) { return e.stopPropagation(); } },
            React.createElement("span", __assign({ tabIndex: 1, className: "m78-wine_btn" }, keypressAndClick(function () { var _a; return (_a = state.onChange) === null || _a === void 0 ? void 0 : _a.call(state, false); })),
                React.createElement("span", { className: "m78-wine_hide-btn" })),
            isFull && (React.createElement("span", __assign({ tabIndex: 1, className: "m78-wine_btn" }, keypressAndClick(instance.resize)),
                React.createElement("span", { className: "m78-wine_resize-btn" }))),
            !isFull && (React.createElement("span", __assign({ tabIndex: 1, className: "m78-wine_btn" }, keypressAndClick(instance.full)),
                React.createElement("span", { className: "m78-wine_max-btn" }))),
            React.createElement("span", __assign({ tabIndex: 1, className: "m78-wine_btn __warning" }, keypressAndClick(state.onDispose)),
                React.createElement("span", { className: "m78-wine_dispose-btn" })))));
};
/** 渲染主内容 */
function render(ctx, methods, instance) {
    var state = ctx.state, insideState = ctx.insideState;
    var resize = methods.resize, full = methods.full, top = methods.top;
    var headerCustomer = state.headerCustomer || renderBuiltInHeader;
    return (React.createElement(animated.div, { style: __assign(__assign(__assign({}, state.style), { zIndex: insideState.isTop ? state.zIndex + 1 : state.zIndex }), ctx.spProps), className: clsx('m78-wine', state.className, {
            __full: insideState.isFull,
            __active: insideState.isTop,
        }), ref: ctx.wrapElRef, onTouchStart: top, onMouseDown: top },
        React.createElement("div", { className: "m78-wine_decorate" },
            headerCustomer({
                ref: ctx.headerElRef,
                onDoubleClick: function () { return (insideState.isFull ? resize() : full()); },
            }, state, instance, insideState.isFull),
            React.createElement("div", { className: "m78-wine_content m78-wine_scrollbar", style: {
                    top: insideState.headerHeight,
                } },
                React.createElement(React.Fragment, { key: insideState.refreshKey }, state.content))),
        React.createElement("div", { className: "m78-wine_drag-line-l", ref: ctx.dragLineLRef }),
        React.createElement("div", { className: "m78-wine_drag-line-t", ref: ctx.dragLineTRef }),
        React.createElement("div", { className: "m78-wine_drag-line-r", ref: ctx.dragLineRRef }),
        React.createElement("div", { className: "m78-wine_drag-line-b", ref: ctx.dragLineBRef }),
        React.createElement("div", { className: "m78-wine_drag-line-rb", ref: ctx.dragLineRBRef }),
        React.createElement("div", { className: "m78-wine_drag-line-lb", ref: ctx.dragLineLBRef }),
        React.createElement("div", { className: "m78-wine_drag-line-lt", ref: ctx.dragLineLTRef }),
        React.createElement("div", { className: "m78-wine_drag-line-rt", ref: ctx.dragLineRTRef })));
}

var WineImpl = function (props) {
    var _a = useSetState(function () { return ({
        isFull: false,
        headerHeight: undefined,
        refreshKey: createRandString(),
    }); }), insideState = _a[0], setInsideState = _a[1];
    var wrapElRef = useRef(null);
    var headerElRef = useRef(null);
    var _b = useSpring(function () {
        var _a = getSizeByState(props), width = _a[0], height = _a[1];
        return {
            opacity: 0,
            x: 0,
            y: 0,
            config: config.stiff,
            width: width,
            height: height,
            display: 'none',
            visibility: 'hidden',
        };
    }), spProps = _b[0], spApi = _b[1];
    var self = useSelf({
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
    var ctx = {
        wrapElRef: wrapElRef,
        headerElRef: headerElRef,
        state: props,
        setInsideState: setInsideState,
        insideState: insideState,
        self: self,
        spProps: spProps,
        spApi: spApi,
        dragLineRRef: null,
        dragLineLRef: null,
        dragLineBRef: null,
        dragLineTRef: null,
        dragLineLTRef: null,
        dragLineRTRef: null,
        dragLineRBRef: null,
        dragLineLBRef: null,
    };
    var methods = useMethods(ctx);
    useLifeCycle(ctx, methods);
    var ins = useMemo(function () {
        var instance = {
            el: wrapElRef,
            top: methods.top,
            full: methods.full,
            resize: methods.resize,
            refresh: function () {
                setInsideState({
                    refreshKey: createRandString(),
                });
            },
            meta: self,
        };
        return instance;
    }, []);
    useImperativeHandle(props.instanceRef, function () { return ins; }, []);
    return render(ctx, methods, ins);
};

var Wine = create({
    component: WineImpl,
    defaultState: DEFAULT_PROPS,
    namespace: NAME_SPACE,
});

export default Wine;
export { WineBound, WineDragPosition, keypressAndClick };
