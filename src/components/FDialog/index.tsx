import { styled } from "@styils/vue";
import {
  Transition,
  createApp,
  withModifiers,
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  toRefs,
} from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import Loading from "@/components/Loading/index.vue";
import type {
  IProps,
  NonRefKeys,
  ReturnTypeCallBack,
  setData,
  ModalFuncReturn,
  DialogInstance,
  IDialog,
  IIconMap,
  IRefsProps,
  RequiredObj,
} from "./type";
import { _isClickPosition } from "./utils";
import { _defaultValue } from "@/utils";
export const MRSIZE = 8;
export type { DialogProps, Render } from "./type";
/**
 * 弹出框组件
 */
const MyShowModel = defineComponent(
  (props: IRefsProps<NonRefKeys, IProps>) => {
    const {
      content,
      clickPositon,
      removeModal,
      loading,
      negativeText,
      positiveText,
      onNegativeClick,
      onPositiveClick,
      title,
      type,
      action,
      maskClosable,
      transformOrigin,
      closeOnEsc,
    } = props;
    const ModalContainer = styled("div", {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1001,
    });
    const ModalMask = styled("div", {
      position: "absolute",
      backgroundColor: "rgba(0,0,0,0.5)",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1001,
    });
    const ModalWrapper = styled("div", {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: "auto",
      display: "flex",
      textAlign: "center",
    });
    const ModalDiv = styled("div", {
      position: "relative",
      width: "446px",
      textAlign: "left",
      zIndex: 1002,
      margin: "auto",
      backgroundColor: "var(--bg-modal)",
      padding: "16px 28px 20px 28px",
      borderRadius: "5px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      ".icon": {
        display: "flex",
        alignItems: "center",
        columnGap: "5px",
      },
      ".content": {
        margin: "8px 0 16px 10px",
      },
      ".action": {
        display: "flex",
        alignItems: "center",
        columnGap: "10px",
        justifyContent: "end",
      },
    });
    const ActionButton = styled(
      "button",
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 10px",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "$cursor", //pointer not-allowed
        color: "var(--item-color-reversal)",
        transition: "all 0.3s",
        backgroundColor: "var(--primary-color)",
        opacity: "$opacity",
      },
      // variants 为 styled 的第三个参数
      {
        type: {
          cancel: {
            cursor: "pointer",
            backgroundColor: "var(--bg-modal)",
            color: "var(--text-color)",
            border: "1px solid var(--border-color)",
            "&:hover": {
              border: "1px solid var(--primary-color)",
              color: "var(--primary-color)",
            },
          },
        },
        theme: {
          primary: {
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--primary-hover)",
            },
          },
          info: {
            backgroundColor: "var(--info-color)",
            "&:hover": {
              backgroundColor: "var(--info-hover)",
            },
          },
          success: {
            backgroundColor: "var(--success-color)",
            "&:hover": {
              backgroundColor: "var(--success-hover)",
            },
          },
          warning: {
            backgroundColor: "var(--warning-color)",
            "&:hover": {
              backgroundColor: "var(--warning-hover)",
            },
          },
          error: {
            backgroundColor: "var(--error-color)",
            "&:hover": {
              backgroundColor: "var(--error-hover)",
            },
          },
        },
      }
    );
    const isShowModal = ref(true);
    const elPosition = reactive({
      x: 0,
      y: 0,
    });
    const scrollY = ref(0);
    /**
     * 鼠标点击位置减去元素位置，得到变形的位置。transform-origin 默认是center 根据自身中心点作为变形原点
     * @returns {Object} 鼠标在元素上的位置
     * @example
     * // 假设元素位置为 { x: 100, y: 200 }
     * // 鼠标点击位置为 { x: 300, y: 400 }
     * const mousePosition = getMousePosition(300, 400, 100, 200);
     * console.log(mousePosition); // { x: 200, y: 200 } 弹出框的最终位置
     *
     * // 假设元素位置为 { x: 500, y: 600 }
     * // 鼠标点击位置为 { x: 700, y: 800 }
     * const mousePosition = getMousePosition(700, 800, 500, 600);
     * console.log(mousePosition); // { x: 200, y: 200 } 弹出框的最终位置
     */
    const mousePosition = computed(() => {
      if (_isClickPosition(clickPositon?.value?.x, clickPositon?.value?.y)) {
        return;
      }
      const x = clickPositon.value.x - elPosition.x;
      const y = clickPositon.value.y - elPosition.y + scrollY.value;
      return { x, y };
    });
    async function handleEnter(e: Element) {
      const el = e as HTMLElement;
      elPosition.x = el.offsetLeft;
      elPosition.y = el.offsetTop;
    }
    const modalScrollHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      scrollY.value = target.scrollTop;
    };
    const isTransformOrigin = computed(() => {
      return transformOrigin.value === "mouse"
        ? `${mousePosition.value?.x}px ${mousePosition.value?.y}px`
        : "center";
    });
    function handleKeyDown(e: KeyboardEvent) {
      if (closeOnEsc && closeOnEsc.value && e.key === "Escape") {
        hide();
      }
    }
    function closeModal(fun: () => void) {
      return () => {
        fun();
      };
    }
    const hide = () => {
      isShowModal.value = false;
    };
    const handlerPropsClick = (fun: ReturnTypeCallBack) => {
      return (args: MouseEvent) => {
        if (!fun) {
          hide();
          return;
        }
        void Promise.resolve(fun(args)).then((result) => {
          if (result === false) return;
          hide();
        });
      };
    };
    /**
     * 渲染元素？
     */
    const renderJsx = (el: JSX.Element) => (isShowModal.value ? el : null);

    onMounted(() => {
      document.addEventListener("keydown", handleKeyDown);
    });
    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
    function handleLoadingEnter(e: Element) {
      const el = e as HTMLElement;
      const memorizedWidth = el.offsetWidth;
      el.style.maxWidth = "0";
      el.style.marginRight = "0";
      /**
       * 当你连续对一个元素进行多次样式修改时，浏览器会将这些修改合并起来，然后在下一个重绘周期一次性应用这些修改，以提高性能。这意味着如果没有强制浏览器重新计算元素的布局，两次修改可能会被合并在一起，导致它们在同一次重绘中生效，而不是按照你期望的顺序逐个生效，通过在两次样式修改之间插入el.offsetWidth;，你实际上在中间强制了一次重绘，使得第一次修改生效后立即重新计算元素的布局，然后再应用第二次修改。这样就能够确保两次修改能够分别生效，而不会被合并在一起延迟到同一次重绘中。因此，为了确保连续的样式修改能够按照你的期望顺序逐个生效，需要在每次修改之间加入强制重绘的操作，以避免浏览器的优化机制将它们合并在一起。这样可以实现更精确的样式控制和过渡效果。
       */
      el.offsetWidth; // 触发重绘
      el.style.maxWidth = `${memorizedWidth}px`;
      el.style.marginRight = `${MRSIZE}px`;
    }
    function handleLoadingLeave(e: Element) {
      const el = e as HTMLElement;
      el.style.maxWidth = "0";
      el.style.marginRight = "0";
    }
    function handleLoadingBeforeLeave(e: Element) {
      const el = e as HTMLElement;
      el.style.maxWidth = `${el.offsetWidth}px`;
      el.style.marginRight = `${el.style.marginRight}px`;
    }

    const isTheme = () => (type.value ? type.value : "primary");

    const iconMap: IIconMap = {
      error: {
        icon: "error",
        size: 27,
      },
      success: {
        icon: "success",
        size: 27,
      },
      warning: {
        icon: "warning",
        size: 27,
      },
      info: {
        icon: "info",
        size: 27,
      },
    };
    return () => (
      <ModalContainer>
        <Transition appear name="fade" mode="out-in">
          {renderJsx(
            <ModalMask
              onClick={withModifiers(
                closeModal(() => {
                  maskClosable.value ? hide() : null;
                }),
                ["self"]
              )}
            ></ModalMask>
          )}
        </Transition>
        <ModalWrapper onScroll={modalScrollHandler}>
          <Transition
            onAfterLeave={removeModal}
            onEnter={handleEnter}
            appear
            name="zoom-out"
            mode="out-in"
          >
            {renderJsx(
              <ModalDiv
                style={{
                  transformOrigin: isTransformOrigin.value,
                }}
              >
                <>
                  <div class="icon">
                    {type.value ? (
                      <SvgIcon
                        name={iconMap[type.value].icon}
                        size={iconMap[type.value].size}
                      ></SvgIcon>
                    ) : null}
                    <div>{title.value}</div>
                  </div>
                  <div class="content">
                    {typeof content.value === "function"
                      ? content.value()
                      : content.value}
                  </div>
                </>
                <div class="action">
                  {action ? (
                    action.value()
                  ) : (
                    <>
                      <ActionButton
                        variants={{
                          type: "cancel",
                        }}
                        onClick={handlerPropsClick(
                          onNegativeClick && onNegativeClick.value
                        )}
                      >
                        {negativeText.value}
                      </ActionButton>
                      <ActionButton
                        vars={{
                          opacity: `${loading.value ? 0.5 : 1}`,
                          cursor: `${
                            loading.value ? "not-allowed" : "pointer"
                          }`,
                        }}
                        variants={{ theme: isTheme() }}
                        disabled={loading.value}
                        onClick={handlerPropsClick(
                          onPositiveClick && onPositiveClick.value
                        )}
                      >
                        <Transition
                          onEnter={handleLoadingEnter}
                          onLeave={handleLoadingLeave}
                          onBeforeLeave={handleLoadingBeforeLeave}
                          name="loading"
                          appear
                        >
                          {loading.value ? <Loading></Loading> : null}
                        </Transition>
                        <div>{positiveText.value}</div>
                      </ActionButton>
                    </>
                  )}
                </div>
              </ModalDiv>
            )}
          </Transition>
        </ModalWrapper>
      </ModalContainer>
    );
  },
  {
    props: [
      "content",
      "removeModal",
      "clickPositon",
      "loading",
      "negativeText",
      "positiveText",
      "title",
      "type",
      "action",
      "maskClosable",
      "closeOnEsc",
      "onNegativeClick",
      "onPositiveClick",
      "transformOrigin",
    ],
  }
);

const modalHandler: DialogInstance = (
  options: RequiredObj<IProps, "content">
) => {
  _defaultValue("transformOrigin", "mouse", options);
  _defaultValue("negativeText", "取消", options);
  _defaultValue("positiveText", "确定", options);
  _defaultValue("maskClosable", true, options);
  _defaultValue("closeOnEsc", true, options);
  _defaultValue("title", "提示", options);
  _defaultValue("type", null, options);
  const reactiveValue = reactive<
    RequiredObj<Omit<IProps, "removeModal">, "content" | "clickPositon"> &
      setData
  >({
    loading: false,
    clickPositon: {
      x: 0,
      y: 0,
    },
    setPositiveText(text: string) {
      reactiveValue.positiveText = text;
    },
    setNegativeText(text: string) {
      reactiveValue.negativeText = text;
    },
    setLoading(loading: boolean) {
      reactiveValue.loading = loading;
    },
    ...options,
  });
  createModalApp(reactiveValue);
  return reactiveValue as ModalFuncReturn;
};

const dialog: IDialog = (data) => modalHandler(data);
dialog.info = (data) => {
  data.type = "info";
  return modalHandler(data);
};
dialog.success = (data) => {
  data.type = "success";
  return modalHandler(data);
};
dialog.warning = (data) => {
  data.type = "warning";
  return modalHandler(data);
};
dialog.error = (data) => {
  data.type = "error";
  return modalHandler(data);
};
export function useFDialog() {
  const api = dialog;
  if (api === null) {
    console.warn("useMessage must be used within a MessageProvider");
  }
  return api;
}
function createModalApp(data: RequiredObj<IProps, "content">) {
  const stateAsRefs = toRefs(data);
  const div = document.createElement("div");
  document.body.appendChild(div);

  /**
   * 点击的位置信息
   * @property {number} x 点击位置的横坐标
   * @property {number} y 点击位置的纵坐标
   */
  /**
   * 处理点击事件，只触发一次
   * @param {MouseEvent} event 鼠标点击事件
   */
  const handleClickOnce = (event: MouseEvent) => {
    if (
      _isClickPosition(
        stateAsRefs.clickPositon?.value?.x,
        stateAsRefs.clickPositon?.value?.y
      )
    ) {
      return;
    }
    stateAsRefs.clickPositon!.value!.x = event.clientX;
    stateAsRefs.clickPositon!.value!.y = event.clientY;
    // 在这里添加您希望执行的逻辑
    document.removeEventListener("click", handleClickOnce); // 移除事件监听器
  };
  document.addEventListener("click", handleClickOnce, { once: true });
  /**
   * 创建并挂载Vue组件
   */
  const modal = createApp(MyShowModel, {
    // 执行关闭操作
    removeModal() {
      modal.unmount();
      div.remove();
      if (
        _isClickPosition(
          stateAsRefs.clickPositon?.value?.x,
          stateAsRefs.clickPositon?.value?.y
        )
      ) {
        return;
      }
      stateAsRefs.clickPositon!.value!.x = 0;
      stateAsRefs.clickPositon!.value!.y = 0;
    },
    ...stateAsRefs,
  });
  modal.mount(div);
}
