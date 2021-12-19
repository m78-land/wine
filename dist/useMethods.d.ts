import { TupleNumber } from '@lxjx/utils';
import { _WineContext } from './types';
export declare function useMethods(context: _WineContext): {
    refreshDeps: () => void;
    setXY: (x: number, y: number, extra?: any) => Promise<import("react-spring").AnimationResult<import("react-spring").Controller<import("./types")._WineAnimateProps>>[]>;
    resize: () => void;
    full: () => void;
    getCursorWrapOffset: (xy: TupleNumber) => number[];
    top: () => void;
    refreshTipNode: (xy: TupleNumber, down: boolean) => void;
};
export declare type _Methods = ReturnType<typeof useMethods>;
//# sourceMappingURL=useMethods.d.ts.map