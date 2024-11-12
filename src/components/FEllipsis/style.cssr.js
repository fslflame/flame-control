import { styled } from "@styils/vue";
import { SIZE } from "./utils";
const TriangleBoxStyle = {
    position: "absolute",
    left: 0,
    top: "auto",
    right: 0,
    bottom: "100%",
    height: `${SIZE}px`,
};
const TriangleChildStyle = {
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    backgroundColor: "var(--eilipsis-color)",
    position: "absolute",
    left: "50%",
    transform: `translateX(-50%) rotate(45deg)`,
    top: `${SIZE / 2}px`,
};
export const TriangleBox = styled("div", TriangleBoxStyle, {
    position: {
        top: {
            top: "100%",
            bottom: "auto",
        },
        bottom: {
            top: "auto",
            bottom: "100%",
        },
    },
});
export const TriangleChild = styled("div", TriangleChildStyle, {
    position: {
        top: {
            bottom: `${SIZE / 2}px`,
            top: "auto",
        },
        bottom: {
            top: `${SIZE / 2}px`,
            bottom: "auto",
        },
    },
    triangle: {
        center: {
            left: "50%",
            transform: `translateX(-50%) rotate(45deg)`,
        },
        left: {
            left: "10px",
            transform: `translateX(0) rotate(45deg)`,
        },
        right: {
            right: "10px",
            left: "auto",
            transform: `translateX(0) rotate(45deg)`,
        },
    },
});
//# sourceMappingURL=style.cssr.js.map