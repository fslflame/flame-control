import { ClipBox } from "./style.cssr";
import type { ICilpUpload, IClipProps, IClipInst, IPropsName } from "./types";
import { defineComponent, reactive, ref, toRefs, onBeforeUnmount } from "vue";
export default defineComponent(
  (props: IClipProps, { expose }) => {
    const { minWidth = "222px" } = props;
    /** 选择图片 */
    const inputRef = ref<HTMLInputElement | null>(null);
    const state: ICilpUpload = reactive({
      isFile: false, // 是否上传
      image: null, // 图片元素
      bgClip: null, // 阴影裁剪图片
      clip: null, // 裁剪框
      previewImage: null, // 预览图片元素
      clipScale: 0.5, // 初始裁剪比例
      imageWidth: 0, // 图片宽度
      imageHeight: 0, // 图片高度
      originalImageWidth: 0, // 原始图片宽度
      originalImageHeight: 0, // 原始图片高度
      scaleX: 0, // 宽度缩放比例
      scaleY: 0, // 高度缩放比例
      curCanvas: null, // 当前canvas元素
      clipPath: "", // 裁剪路径
      isPreview: false,
      isImage: true,
    });
    const {
      isImage,
      isPreview,
      isFile,
      image,
      bgClip,
      clip,
      previewImage,
      clipScale,
      imageWidth,
      imageHeight,
      originalImageWidth,
      originalImageHeight,
      scaleX,
      scaleY,
      curCanvas,
      clipPath,
    } = toRefs(state);
    let x = 0;
    let y = 0;
    let clipX = 0;
    let clipY = 0;
    const offset = {
      x: 0,
      y: 0,
    };
    const zoomInfo = {
      x: 0,
      y: 0,
      minWidth: 0,
      minHeight: 0,
    };
    function getClipFile(): Promise<File> {
      return new Promise((resolve) => {
        if (!isImage.value) {
          return console.warn("请选择图片文件!");
        }
        if (!curCanvas.value) {
          return console.warn("请先截图！");
        }
        curCanvas.value.toBlob((blob) => {
          const file = new File(
            [blob as BlobPart],
            `${new Date().getTime()}.png`
          );
          resolve(file);
        });
      });
    }
    function selectImage() {
      inputRef.value?.click();
    }
    function changeImgae(e: Event) {
      isFile.value = true;
      const target = e.target as HTMLInputElement;
      // 重置files
      const file = target.files?.[0];
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = async (e) => {
        if (!e.target) {
          return;
        }
        if (!image.value) {
          return;
        }
        if (!bgClip.value) {
          return;
        }
        image.value.src = e.target.result as string;
        bgClip.value.src = e.target.result as string;
        await getClipImageSize();
        init();
      };
      target.value = "";
    }
    async function getClipImageSize() {
      return new Promise((resolve) => {
        if (!image.value) {
          return;
        }
        const [, type] = image.value.src.split("data:");
        isImage.value = type.includes("image");
        if (!isImage.value) {
          return console.warn("请选择图片文件!");
        }
        image.value.onload = () => {
          imageWidth.value = image.value?.width as number;
          imageHeight.value = image.value?.height as number;
          resolve(null);
        };
      }).then(() => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = image.value?.src as string;
          img.onload = () => {
            originalImageWidth.value = img.width;
            originalImageHeight.value = img.height;
            resolve(null);
          };
        });
      });
    }
    function setClipSize(width: number, height: number) {
      if (!clip.value) {
        return;
      }
      clip.value.style.width = `${width}px`;
      clip.value.style.height = `${height}px`;
    }
    function setClipPosition(x: number, y: number) {
      if (!clip.value) {
        return;
      }
      clip.value.style.left = `${x}px`;
      clip.value.style.top = `${y}px`;
      setClipPath();
    }
    function initIsPreview() {
      if (typeof props.isPreview === "string" && props.isPreview === "") {
        isPreview.value = true;
        return;
      }
      isPreview.value = props.isPreview as boolean;
    }
    initIsPreview();
    async function setClipPath() {
      if (!clip.value) {
        return;
      }
      const lt = `${clip.value.offsetLeft}px ${clip.value.offsetTop}px`;
      const rt = `${clip.value.offsetLeft + clip.value.offsetWidth}px ${
        clip.value.offsetTop
      }px`;
      const lb = `${clip.value.offsetLeft}px ${
        clip.value.offsetTop + clip.value.offsetHeight
      }px`;
      const rb = `${clip.value.offsetLeft + clip.value.offsetWidth}px ${
        clip.value.offsetTop + clip.value.offsetHeight
      }px`;
      clipPath.value = `polygon(${lt}, ${rt}, ${rb}, ${lb})`;
      if (isPreview.value) {
        const resp = executeClipImage();
        if (!resp) {
          return console.warn("resp is null");
        }
        if (!previewImage.value) {
          return;
        }
        previewImage.value.src = resp;
        const file = await getClipFile();
        props["onGetClipDataUrl:value"]?.(resp);
        props["onGetClipFile:value"]?.(file);
      }
    }
    function executeClipImage() {
      if (!clip.value) {
        return;
      }
      const resp = clipImage(
        clip.value.offsetLeft * scaleX.value,
        clip.value.offsetTop * scaleY.value,
        clip.value.offsetWidth * scaleX.value,
        clip.value.offsetHeight * scaleY.value,
        clip.value.offsetWidth,
        clip.value.offsetHeight
      );
      return resp;
    }
    async function getClipDataUrl(fn?: (url: string) => void) {
      if (!isPreview.value) {
        const resp = executeClipImage();
        if (!resp) {
          return console.warn("resp is null");
        }
        props["onGetClipDataUrl:value"]?.(resp);
        return fn ? fn(resp) : resp;
      }
      if (!previewImage.value) {
        return console.warn("previewImage is null");
      }
      props["onGetClipDataUrl:value"]?.(previewImage.value.src);
      return fn ? fn(previewImage.value.src) : previewImage.value.src;
    }
    async function getClipFileUrl(fn?: (file: File) => void) {
      if (!isPreview.value) {
        executeClipImage();
      }
      const file = await getClipFile();
      props["onGetClipFile:value"]?.(file);
      return fn ? fn(file) : file;
    }
    function clipImage(
      x: number,
      y: number,
      width: number,
      height: number,
      canvasWidth: number,
      canvasHeight: number
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx?.drawImage(
        image.value as CanvasImageSource,
        x,
        y,
        width,
        height,
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      curCanvas.value = canvas;
      return canvas.toDataURL();
    }
    let stopZoomHandler: () => void;
    function init() {
      const clipWidth = imageWidth.value * clipScale.value;
      const clipHeight = imageHeight.value * clipScale.value;
      zoomInfo.minWidth = clipWidth;
      zoomInfo.minHeight = clipHeight;
      scaleX.value = originalImageWidth.value / imageWidth.value;
      scaleY.value = originalImageHeight.value / imageHeight.value;
      const clipX = (imageWidth.value - clipWidth) / 2;
      const clipY = (imageHeight.value - clipHeight) / 2;
      if (!clip.value) {
        return;
      }
      setClipSize(clipWidth, clipHeight);
      setClipPosition(clipX, clipY);
      stopZoomHandler = zoomHandler(clip.value.childNodes);
    }
    function zoomWindowMouseMove(e: MouseEvent, key: string) {
      let mouseX = e.clientX - zoomInfo.x;
      let mouseY = e.clientY - zoomInfo.y;
      let width = 0;
      let height = 0;
      let left = 0;
      let top = 0;
      if (!clip.value) {
        return;
      }
      switch (key) {
        case "lt":
          width = clip.value.offsetWidth - mouseX;
          height = clip.value.offsetHeight - mouseY;
          left = clip.value.offsetLeft + mouseX;
          top = clip.value.offsetTop + mouseY;
          if (left < 0) {
            left = 0;
            width = clip.value.offsetWidth + clip.value.offsetLeft;
          }
          if (top < 0) {
            top = 0;
            height = clip.value.offsetHeight + clip.value.offsetTop;
          }
          break;
        case "rt":
          width = clip.value.offsetWidth + mouseX;
          height = clip.value.offsetHeight - mouseY;
          left = clip.value.offsetLeft;
          top = clip.value.offsetTop + mouseY;
          if (top < 0) {
            top = 0;
            height = clip.value.offsetHeight + clip.value.offsetTop;
          }
          if (left + width > imageWidth.value) {
            width = imageWidth.value - left;
          }
          break;
        case "lb":
          width = clip.value.offsetWidth - mouseX;
          height = clip.value.offsetHeight + mouseY;
          left = clip.value.offsetLeft + mouseX;
          top = clip.value.offsetTop;
          if (left < 0) {
            left = 0;
            width = clip.value.offsetWidth + clip.value.offsetLeft;
          }
          if (top + height > imageHeight.value) {
            height = imageHeight.value - top;
          }
          break;
        case "rb":
          width = clip.value.offsetWidth + mouseX;
          height = clip.value.offsetHeight + mouseY;
          left = clip.value.offsetLeft;
          top = clip.value.offsetTop;
          if (left + width > imageWidth.value) {
            width = imageWidth.value - left;
          }
          if (top + height > imageHeight.value) {
            height = imageHeight.value - top;
          }
          break;
        default:
          break;
      }
      const { w, h, x, y } = restrictClipSize(width, height, left, top);
      setClipSize(w, h);
      setClipPosition(x, y);
      zoomInfo.x = e.clientX; // 更新鼠标位置
      zoomInfo.y = e.clientY;
    }
    function restrictClipSize(w: number, h: number, x: number, y: number) {
      let width = w;
      let height = h;
      let left = x;
      let top = y;
      if (w < zoomInfo.minWidth) {
        width = zoomInfo.minWidth;
        left = clip.value?.offsetLeft as number;
      }
      if (h < zoomInfo.minHeight) {
        height = zoomInfo.minHeight;
        top = clip.value?.offsetTop as number;
      }
      return {
        w: width,
        h: height,
        x: left,
        y: top,
      };
    }
    function clipRefMouseDown(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      clipX = clip.value?.offsetLeft as number;
      clipY = clip.value?.offsetTop as number;
      offset.x = x - clipX;
      offset.y = y - clipY;
      window.onmousemove = winodwMouseMove;
      window.onmouseup = windowMouseUp;
    }
    function windowMouseUp() {
      window.onmousemove = null;
      window.onmouseup = null;
    }
    function winodwMouseMove(e: MouseEvent) {
      if (!clip.value) {
        return;
      }
      let mouseX = e.clientX - offset.x;
      let mouseY = e.clientY - offset.y;
      if (mouseX < 0) {
        mouseX = 0;
      }
      if (mouseX > imageWidth.value - clip.value.offsetWidth) {
        mouseX = imageWidth.value - clip.value.offsetWidth;
      }
      if (mouseY < 0) {
        mouseY = 0;
      }
      if (mouseY > imageHeight.value - clip.value.offsetHeight) {
        mouseY = imageHeight.value - clip.value.offsetHeight;
      }
      setClipPosition(mouseX, mouseY);
    }
    function zoomHandler(childNodes: NodeListOf<ChildNode>) {
      const zoomMap: IPropsName = {
        lt: childNodes[0],
        rt: childNodes[1],
        lb: childNodes[2],
        rb: childNodes[3],
      };
      for (const key in zoomMap) {
        zoomMap[key].onmousedown = (e: MouseEvent) => {
          e.stopPropagation();
          zoomInfo.x = e.clientX;
          zoomInfo.y = e.clientY;
          window.onmousemove = (e) => zoomWindowMouseMove(e, key);
          window.onmouseup = windowMouseUp;
        };
      }
      return () => {
        for (const key in zoomMap) {
          zoomMap[key].onmousedown = null;
        }
      };
    }
    onBeforeUnmount(() => stopZoomHandler?.());
    expose({
      getClipFile: getClipFileUrl,
      getClipDataUrl,
    } as IClipInst);
    return () => (
      <ClipBox
        vars={{
          clipPath: clipPath.value,
          minWidth,
        }}
      >
        {isFile.value ? (
          <div class="clip-container">
            <div class="clip-box">
              <img ref={image} class="image" />
              <img ref={bgClip} class="bgClip" />
              <div ref={clip} class="clip" onMousedown={clipRefMouseDown}>
                <div class="lt"></div>
                <div class="rt"></div>
                <div class="lb"></div>
                <div class="rb"></div>
              </div>
            </div>
            <div class="preview">
              {isPreview.value ? <img ref={previewImage} /> : null}
            </div>
          </div>
        ) : (
          <div class="add-box" onClick={selectImage}>
            <div class="add">+</div>
            <input
              accept="image/*"
              ref={inputRef}
              type="file"
              onChange={changeImgae}
            />
          </div>
        )}
      </ClipBox>
    );
  },
  {
    props: [
      "onGetClipFile:value",
      "isPreview",
      "onGetClipDataUrl:value",
      "minWidth",
    ],
  }
);
