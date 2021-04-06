let ColorPicker = {
    /**
     * The Id to use for this color picker
     * Used for the datalist
     */
    id: 0,

    /**
     * The element (which will be an input element and maybe a datalist inside of a div)
     */
    element: null,

    /**
     * The input element
     */
    input: null,

    /**
     * Creates the color picker
     * @param colorChoices: The array of color choices - if it has only one value, doesn't create a datalist
     */
    create: function(colorChoices) {
        let colorPicker = Object.create(ColorPicker);

        let mainElement = dce("div");
        colorPicker.element = mainElement;

        colorPicker.input = dce("input");
        colorPicker.input.type = "color";
        colorPicker.input.onclick = function(event) {
            event.stopPropagation();
        };
        colorPicker.element.appendChild(colorPicker.input);

        if (colorChoices && colorChoices.length === 1) {
            colorPicker.value = colorChoices[0];
        }
        else if (colorChoices) {
            let dataList = dce("datalist");
            dataList.id = `colorpicker-${Globals.colorPickers++}`;

            colorChoices.forEach(function(color) {
                let option = dce("option");
                option.innerText = color;
                dataList.appendChild(option);
            });

            colorPicker.input.setAttribute("list", dataList.id);
            colorPicker.element.appendChild(dataList);
        }

        return colorPicker;
    },

    /**
     * Compares two colors with a given tolerance, which will be applied to all rgb values
     * This will check if color1 is the same as color2, within the given tolerance for all RGB values
     * @param color1 - the first hex color string (#AABBCC)
     * @param color2 - the second hex color string (#AABBCC)
     * @param tolerance - the tolerance
     */
    compareColors: function(color1, color2, tolerance) {
        if (color1.length !== 7 || color2.length !== 7) {
            return false;
        }

        if (!tolerance) {
            tolerance = 0;
        }

        color1RGB = this._parseRGB(color1);
        color2RGB = this._parseRGB(color2);

        return this._compareColorPart(color1RGB.r, color2RGB.r, tolerance) &&
            this._compareColorPart(color1RGB.g, color2RGB.g, tolerance) &&
            this._compareColorPart(color1RGB.b, color2RGB.b, tolerance);
    },

    /**
     * Parses a given string into its RGB component
     * @param colorString - the color string to parse
     * @returns The RGB values in an object with properties r, g, and b
     */
    _parseRGB: function(colorString) {
        colorStringR = colorString.substring(1, 3);
        colorStringG = colorString.substring(3, 5);
        colorStringB = colorString.substring(5, 7);
        return { r: colorStringR, g: colorStringG, b: colorStringB }
    },

    /**
     * Compares two colors
     * @color1 - the first color
     * @color2 - the second color
     * @param tolerance - the tolerance
     */
    _compareColorPart: function(color1, color2, tolerance) {
        let color1Int = parseInt(color1, 16);
        let color2Int = parseInt(color2, 16);

        let lower = color1Int - tolerance;
        let upper = color1Int + tolerance;

        return color2Int >= lower && color2Int <= upper;
    }
}