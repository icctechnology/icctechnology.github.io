//     ICC Vizify 0.1.0
//     http://icctechnology.github.io
//     (c) 2015 Inform atation Control Corperation
//     Vizify may be freely distributed under the MIT license.

var Vizify = {
    chartType: null,
    libType: null,
    hooks: [],
    data: [],
    chartLoader: {},
    colors: null,

    init: function (options) {
        options = options || {};
        this.libType = options.library || "";
        this.chartType = options.type || "";
        this.hook = options.hook || "";
        this.config = options.config || {};
        this.minStartDate = options.minStartDate || null;
        if (this.libType === "google") {
            this.loadExt("https://www.google.com/jsapi", this.googleLoadedEvent);
        }
        var self = this;
        document.addEventListener("googleLoaded", function () {
            self.googleLoadedSubscribe();
        });
    },

    googleLoadedEvent: function () {
        var emptyDetails = { foo: 'bar', _exposedProps_: {foo: 'r'}};
        var googleEvent;
        if(typeof Event == 'function'){
            googleEvent = new Event('googleLoaded');
        }
        else{ //IE only
            var googleEvent= document.createEvent('CustomEvent');
            googleEvent.initCustomEvent("googleLoaded", false, false, emptyDetails);
        }
        document.dispatchEvent(googleEvent);
    },

    googleLoadedSubscribe: function () {
        var self = this;
        this.loadVisualization(function () {
            self.loadData();
        });

    },

    load: function (options) {
        this.colors = options.colors;
        this.data.push(options.data);
        this.hooks.push(options.hook);
    },

  loadExt: function (url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = function () {
        callback();
    };
},

loadVisualization: function (callback) {
    var self = this;
    google.load("visualization", "1", {
        callback: function () {
            callback();
        }, packages: [self.chartType]
    });
},

loadData: function () {
    if (this.libType === "google" && this.chartType === "timeline") {
        this.renderGoogleTimeline(this.data, this.hooks);
    }
},

renderGoogleTimeline: function (d, h) {
    for (var i = 0; i < d.length; i++) {
        var data = d[i];
        var hook = h[i];
        var container = document.querySelector(hook);
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({type: 'string', id: data.columnName});
        dataTable.addColumn({type: 'date', id: 'Start'});
        dataTable.addColumn({type: 'date', id: 'End'});
        dataTable.addRows(data.rows);
        var options = {};
        if(this.colors){
            options= {
                colors: this.colors
            };
        }

        chart.draw(dataTable, options);
    }
}
};