import { useElementBounding } from "@vueuse/core";
type PositionType = "top" | "bottom";
type originPositionType = "top center" | "bottom center" | "top right" | "top left" | "bottom right" | "bottom left";
type triangleType = "left" | "center" | "right";
export interface ITootipProps {
    transformPosition: string;
    setTransformPosition: (t: string) => void;
    showRef: boolean;
    setShowRef: (s: boolean) => void;
    position: PositionType;
    setPosition: (p: PositionType) => void;
    isTransition: boolean;
    setTransition: (t: boolean) => void;
    tootipHeight: number;
    setTootipHeight: (h: number) => void;
    tootipWidth: number;
    setTootipWidth: (w: number) => void;
    triangle: triangleType;
    setTriangle: (t: triangleType) => void;
    originPosition: originPositionType;
    setOriginPosition: (o: originPositionType) => void;
    isTootipInst: boolean;
    setTootipInst: (t: boolean) => void;
    hoverActive: boolean;
    setHoverActive: (h: boolean) => void;
    resetReactive: () => void;
    isTransitionRef: boolean;
    setTransitionRef: (t: boolean) => void;
    flag: boolean;
    setTransformPositionFn: () => void;
}
export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>;
export interface IEllipsisProps {
    defultValue?: string;
}
export {};
