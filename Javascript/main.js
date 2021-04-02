let Main = {
    clientWidget: WidgetHelpers.create(TextboxWidget),
    serverWidget: WidgetHelpers.create(TextboxWidget),

    initialize: function() {
        document.body.appendChild(this.clientWidget.div);
        document.body.appendChild(this.serverWidget.div);
    },

    testButtonClick: function() {
        let h1Text = this.clientWidget.compare(this.serverWidget) ? "Good!" : "Nope.";
        document.getElementById("header").innerText = h1Text;
    }
};