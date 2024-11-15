import { styled } from "@styils/vue";
export const ClipBox = styled("div", {
    img: {
        display: "block",
    },
    ".add-box": {
        minWidth: "150px",
        width: "fit-content",
        height: "100px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        input: {
            display: "none",
        },
        ".add": {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "38px",
            transition: "all 0.3s",
            "&:hover": {
                background: "rgba(0,0,0,0.1)",
            },
        },
    },
    ".clip-container": {
        display: "flex",
        columnGap: "10px",
        ".clip-box": {
            position: "relative",
            minWidth: "$minWidth",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            ".image": {
                width: "100%",
                height: "100%",
            },
            ".bgClip": {
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: 2,
                left: "0",
                top: "0",
                background: "rgba(0,0,0,0.5)",
                clipPath: "$clipPath",
            },
            ".clip": {
                position: "absolute",
                cursor: "move",
                left: 0,
                top: 0,
                zIndex: 3,
                userSelect: "none",
                ".lt": {
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    background: "#fff",
                    border: "1px solid #000",
                    left: "-5px",
                    top: "-5px",
                    cursor: "nw-resize",
                },
                ".rt": {
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    background: "#fff",
                    border: "1px solid #000",
                    right: "-5px",
                    top: "-5px",
                    cursor: "ne-resize",
                },
                ".lb": {
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    background: "#fff",
                    border: "1px solid #000",
                    left: "-5px",
                    bottom: "-5px",
                    cursor: "sw-resize",
                },
                ".rb": {
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    background: "#fff",
                    border: "1px solid #000",
                    right: "-5px",
                    bottom: "-5px",
                    cursor: "se-resize",
                },
            },
            "&::after": {
                content: "''",
                position: "absolute",
                left: "0",
                top: "0",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                zIndex: 1,
            },
        },
        ".preview": {
            width: "100%",
            height: "fit-content",
            display: "flex",
        },
    },
});
//# sourceMappingURL=style.cssr.js.map