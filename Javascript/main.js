let Main = {
    /**
     * Debug properties
     */
    clientWidget: WidgetHelpers.createClient(WidgetShape),
    serverWidget: WidgetHelpers.createServer(WidgetShape),

    initialize: function() {
        if (Settings.debugMode) {
            this._initializeForDebug();
        }
    },

    /**
     * 
     */
    _initializeForDebug: function() {
        let header = dce("h1");
        header.innerText = "Figure out the answer";

        let testButton = dce("button");
        testButton.innerText = "Check"
        testButton.onclick = this.testButtonClick.bind(this);

        document.body.appendChild(header);
        document.body.appendChild(testButton);

        document.body.appendChild(this.clientWidget.div);
        //document.body.appendChild(this.serverWidget.div);
    },

    testButtonClick: function() {
        let h1Text = this.clientWidget.compare(this.serverWidget) ? "Good!" : "Nope.";
        document.getElementById("header").innerText = h1Text;
    }
};