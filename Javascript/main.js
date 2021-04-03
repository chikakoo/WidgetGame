let Main = {
    clientWidget: WidgetHelpers.createClient(LiquidPourWidget),
    serverWidget: WidgetHelpers.createServer(LiquidPourWidget),

    initialize: function() {
        document.body.appendChild(this.clientWidget.div);
        document.body.appendChild(this.serverWidget.div);
    },

    testButtonClick: function() {
        let h1Text = this.clientWidget.compare(this.serverWidget) ? "Good!" : "Nope.";
        document.getElementById("header").innerText = h1Text;
    }
};