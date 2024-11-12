export interface ICilpUpload {
    isFile: boolean;
    image: HTMLImageElement | null;
    bgClip: HTMLImageElement | null;
    clip: HTMLElement | null;
    previewImage: HTMLImageElement | null;
    clipScale: number;
    imageWidth: number;
    imageHeight: number;
    originalImageWidth: number;
    originalImageHeight: number;
    scaleX: number;
    scaleY: number;
    curCanvas: HTMLCanvasElement | null;
    clipPath: string;
    isPreview: boolean;
    isImage: boolean;
}
export interface IPropsName {
    [propsName: string | number]: any;
}
export interface IClipProps {
    isPreview?: boolean;
    "onGetClipFile:value"?: (file: File) => void;
    "onGetClipDataUrl:value"?: (dataUrl: string) => void;
    minWidth?: string;
}
export interface IClipInst {
    getClipFile: (fn?: (file: File) => void) => Promise<File>;
    getClipDataUrl: (fn?: (dataUrl: string) => void) => Promise<string>;
}
