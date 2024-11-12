import { styled } from "@styils/vue";
export const MessageContainer = styled("div", {
    position: "fixed",
    zIndex: 6000,
    height: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "visible",
    alignItems: "center",
    top: "12px",
    left: 0,
    right: 0,
}, {
    placement: {
        top: {
            top: "12px",
            left: 0,
            right: 0,
        },
        "top-left": {
            top: "12px",
            left: "12px",
            right: 0,
            alignItems: "flex-start",
        },
        "top-right": {
            top: "12px",
            left: 0,
            right: "12px",
            alignItems: "flex-end",
        },
        bottom: {
            bottom: "4px",
            top: "auto",
            left: 0,
            right: 0,
            justifyContent: "flex-end",
        },
        "bottom-left": {
            bottom: "4px",
            top: "auto",
            left: " 12px",
            right: 0,
            justifyContent: "flex-end",
            alignItems: "flex-start",
        },
        "bottom-right": {
            bottom: "4px",
            top: "auto",
            left: 0,
            right: "12px",
            justifyContent: "flex-end",
            alignItems: "flex-end",
        },
    },
});
export const MessageWrapper = styled("div", {
    margin: "0 0 8px 0",
    transformOrigin: "top center",
    display: "flex",
    alignItems: "flex-start",
});
const stylesComp = {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "$grid-cols",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "4px",
    overflow: "hidden",
    maxWidth: "720px",
    columnGap: "10px",
    backgroundColor: "var(--bg-message)",
    color: "var(--text-color)",
    boxShadow: "var(--box-shadow)",
    ".closable": {
        borderRadius: "var(--radius)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px",
        cursor: "pointer",
        transition: "all .3s",
        "&:hover": {
            backgroundColor: "rgb(229 231 235 / 70%)",
        },
    },
};
export const MessageComp = styled("div", stylesComp);
//# sourceMappingURL=style.cssr.js.map