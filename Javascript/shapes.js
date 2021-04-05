/**
 * An API for getting a shape div
 */
let Shapes = {
    /**
     * The list of possible shape values
     */
    values: {
        SQUARE: "square",
        RECTANGLE: "rectangle",
        CIRCLE: "circle",
        OVAL: "oval",
        PILL: "pill",
        TRIANGLE_UP: "triangle-up",
        TRIANGLE_DOWN: "triangle-down",
        TRIANGLE_LEFT: "triangle-left",
        TRIANGLE_RIGHT: "triangle-right",
        TRIANGLE_TOP_LEFT: "triangle-top-left",
        TRIANGLE_TOP_RIGHT: "triangle-top-right",
        TRIANGLE_BOTTOM_LEFT: "triangle-bottom-left",
        TRIANGLE_BOTTOM_RIGHT: "triangle-bottom-right",
        CHEVRON_UP: "chevron-up",
        CHEVRON_DOWN: "chevron-down",
        CHEVRON_FAT: "chevron-fat",
        CURVED_TAIL_ARROW: "curved-tail-arrow",
        TRAPEZOID: "trapezoid",
        PARALLELOGRAM: "parallelogram",
        STAR_6: "star-6",
        STAR_5: "star-5",
        PENTAGON: "pentagon",
        HEXAGON: "hexagon",
        HEART: "heart",
        INFINITY: "infinity",
        DIAMOND_SQUARE: "diamond-square",
        DIAMOND_SHIELD: "diamond-shield",
        DIAMOND_NARROW: "diamond-narrow",
        DIAMOND_CUT: "diamond-cut",
        EGG: "egg",
        CROSS: "cross",
        BASE: "base",
        LOCK: "lock",
        CONE: "cone",
        MOON: "moon",
        FACEBOOK: "facebook",
        MAGNIFYING_GLASS: "magnifying-glass",
        PAC_MAN: "pac-man",
        TALK_BUBBLE: "talk-bubble",
        RSS: "rss",
        BURST_12: "burst-12",
        BURST_8: "burst-8",
        YIN_YANG: "yin-yang",
        RIBBON: "ribbon",
        SPACE_INVADER: "space-invader",
        TV_SCREEN: "tv-screen"
    },

    /**
     * Creates the div
     * @param value - the shape to create - see the object above
     * @param color - the color to make the shape
     */
    createDiv: function(value, color) {
        let containerDiv = dce("div");

        let div = dce("div", "widget-shape");
        addCssClass(div, `widget-shape`);
        addCssClass(div, `widget-shape-${value}`);

        this._adjustInlineStyleForShape(value, color, div);

        containerDiv.appendChild(div);
        return containerDiv;
    },

    /**
     * Adjusts the inline style based on the current shape
     * @param shapeValue - the value of the shape
     * @param div - the div to update
     */
    _adjustInlineStyleForShape: function(shapeValue, color, div) {
        switch(shapeValue) {
            case "triangle-up":
            case "triangle-bottom-left":
            case "triangle-bottom-right":
                div.style.borderBottom = `100px solid ${color}`;
                break;
            case "triangle-down":
            case "triangle-top-left":
            case "triangle-top-right":
                div.style.borderTop = `100px solid ${color}`;
                break;
            case "triangle-left":
                div.style.borderLeft = `100px solid ${color}`;
                break;
            case "triangle-right":
                div.style.borderRight = `100px solid ${color}`;
                break;
            case "trapezoid":
                div.style.borderBottom = `50px solid ${color}`;
                break;
            case "chevron-up":
            case "chevron-down":
                div.style.border = `10px solid ${color}`;
                div.style.borderTop = "0";
                div.style.borderLeft = "0";
                break;
            case "chevron-fat":
                div.pseudoStyle("before", "background", color);
                div.pseudoStyle("after", "background", color);
                break;
            case "curved-tail-arrow":
                div.style.borderRight = `45px solid ${color}`;
                div.pseudoStyle("after", "border-top", `15px solid ${color}`);
                break;
            case "star-6":
                div.style.borderBottom = `75px solid ${color}`;
                div.pseudoStyle("after", "border-top", `75px solid ${color}`);
                break;
            case "star-5":
                div.style.color = color;
                div.style.borderBottom = `35px solid ${color}`;
                div.pseudoStyle("before", "border-bottom", `40px solid ${color}`);
                div.pseudoStyle("after", "color", color);
                div.pseudoStyle("after", "border-bottom", `35px solid ${color}`);
                break;
            case "pentagon":
                div.style.borderColor = `${color} transparent`;
                div.pseudoStyle("before", "border-color", `transparent transparent ${color}`);
                break;
            case "hexagon":
                div.style.background = color;
                div.pseudoStyle("before", "border-bottom", `21.65px solid ${color}`);
                div.pseudoStyle("after", "border-top", `21.65px solid ${color}`);
                break;
            case "heart":
                div.pseudoStyle("before", "background", color);
                div.pseudoStyle("after", "background", color);
                break;
            case "infinity":
                div.pseudoStyle("before", "border", `20px solid ${color}`);
                div.pseudoStyle("after", "border", `20px solid ${color}`);
                break;
            case "diamond-square":
                div.style.borderBottomColor = color;
                div.pseudoStyle("after", "border-top", `50px solid ${color}`);
                break;
            case "diamond-shield":
                div.style.borderBottom = `20px solid ${color}`;
                div.pseudoStyle("after", "border-top", `70px solid ${color}`);
                break;
            case "diamond-narrow":
                div.style.borderBottom = `70px solid ${color}`;
                div.pseudoStyle("after", "border-top", `70px solid ${color}`);
                break;
            case "diamond-cut":
                div.style.borderColor = `transparent transparent ${color} transparent`;
                div.pseudoStyle("after", "border-color", `${color} transparent transparent transparent`);
                break;
            case "cross":
                div.style.background = color;
                div.pseudoStyle("after", "background", color);
                break;
            case "base":
                div.style.background = color;
                div.pseudoStyle("before", "border-bottom", `35px solid ${color}`);
                break;
            case "lock":
                div.style.border = `3.5em solid ${color}`;
                div.style.borderRightWidth = "7.5em";
                div.style.borderLeftWidth = "7.5em";
                div.pseudoStyle("before", "border", `2.5em solid ${color}`);
                div.pseudoStyle("after", "border", `1em solid ${color}`);
                break;
            case "cone":
                div.style.borderTop = `100px solid ${color}`;
                break;
            case "moon":
                div.style.boxShadow = `15px 15px 0 0 ${color}`;
                break;
            case "facebook":
                div.style.background = color;
                div.style.border = `15px solid ${color}`;
                div.style.borderBottom = 0;
                div.pseudoStyle("before", "background", color);
                break;
            case "magnifying-glass":
                div.style.border = `0.1em solid ${color}`;
                div.pseudoStyle("before", "background", color);
                break;
            case "pac-man":
                div.style.borderTop = `60px solid ${color}`;
                div.style.borderBottom = `60px solid ${color}`;
                div.style.borderLeft = `60px solid ${color}`;
                break;
            case "talk-bubble":
                div.style.background = color;
                div.pseudoStyle("before", "border-right", `26px solid ${color}`);
                break;
            case "rss":
                div.style.backgroundColor = color;
                div.pseudoStyle("after", "background", color);
                div.pseudoStyle("after", "box-shadow", `-2em 2em 0 0 #fff inset, -4em 4em 0 0 ${color} inset, -6em 6em 0 0 #fff inset`);
                break;
            case "burst-12":
                div.style.background = color;
                div.pseudoStyle("before", "background", color);
                div.pseudoStyle("after", "background", color);
                break;
            case "burst-8":
                div.style.background = color;
                div.pseudoStyle("before", "background", color);
                break;
            case "yin-yang":
                div.style.borderColor = color;
                div.pseudoStyle("before", "border", `18px solid ${color}`);
                div.pseudoStyle("after", "background", color);
                break;
            case "ribbon":
                div.style.background = color;
                div.pseudoStyle("before", "border-bottom", `70px solid ${color}`);
                div.pseudoStyle("after", "border-bottom", `70px solid ${color}`);
                break;
            case "space-invader":
                div.style.background = color;
                div.style.boxShadow = 
                    `0 0 0 1em ${color},
                    0 1em 0 1em ${color},
                    -2.5em 1.5em 0 .5em ${color},
                    2.5em 1.5em 0 .5em ${color},
                    -3em -3em 0 0 ${color},
                    3em -3em 0 0 ${color},
                    -2em -2em 0 0 ${color},
                    2em -2em 0 0 ${color},
                    -3em -1em 0 0 ${color},
                    -2em -1em 0 0 ${color},
                    2em -1em 0 0 ${color},
                    3em -1em 0 0 ${color},
                    -4em 0 0 0 ${color},
                    -3em 0 0 0 ${color},
                    3em 0 0 0 ${color},
                    4em 0 0 0 ${color},
                    -5em 1em 0 0 ${color},
                    -4em 1em 0 0 ${color},
                    4em 1em 0 0 ${color},
                    5em 1em 0 0 ${color},
                    -5em 2em 0 0 ${color},
                    5em 2em 0 0 ${color},
                    -5em 3em 0 0 ${color},
                    -3em 3em 0 0 ${color},
                    3em 3em 0 0 ${color},
                    5em 3em 0 0 ${color},
                    -2em 4em 0 0 ${color},
                    -1em 4em 0 0 ${color},
                    1em 4em 0 0 ${color},
                    2em 4em 0 0 ${color}`;
                break;
            default:
                div.style.backgroundColor = color;
                break;
        }
    }
};