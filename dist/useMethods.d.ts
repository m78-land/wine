import { TupleNumber, WineContext } from './types';
export declare function useMethods(context: WineContext): {
    refreshDeps: () => void;
    setXY: (x: number, y: number, extra?: any) => Promise<void>;
    resize: () => void;
    memoWinState: () => void;
    full: () => void;
    getCursorWrapOffset: (xy: TupleNumber) => number[];
    top: () => void;
    refreshTipNode: (xy: TupleNumber, down: boolean) => void;
};
export declare type _Methods = ReturnType<typeof useMethods>;
//# sourceMappingURL=useMethods.d.ts.map