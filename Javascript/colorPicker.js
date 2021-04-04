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

        if (colorChoices) {
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
    }
}