Vizify.init({library: "google", type: "timeline"});

parse({selector: "table", nameIndex: [0,1], startIndex: 2, endIndex: 3}, function (options) {
    Vizify.load(options)
});

function parse(options, callback) {
    document.addEventListener("DOMContentLoaded", function () { // ensure page loads so selectors have something
        var selector = options.selector;
        var nameIndex = options.nameIndex;
        var startIndex = options.startIndex;
        var endIndex = options.endIndex;
        var tables = document.querySelectorAll(selector);
        var minStartDate = null;
        var vizifyMinStartDate = document.querySelector(".vizifyMinStartDate");

        var colors = ["#fff", "#F19141", "#85E052", "#009999", "#BF41F1", "#CCFF33", "#CAD55D", "#E34FAE", "#5DCFD5", "#78BA7E", "#BF8B73"];
        for (var t = 0; t < tables.length; t++) {
            var rows = [];
            var table = tables[t];
            
            if (table.querySelector(".testTable")) {
                var elt = document.createElement("div");
                elt.style.width = "60%";
                elt.style.height = "300px";
                elt.style.float = "right";
                elt.style.paddingTop = parseInt(tables[t-1].style.height) + parseInt(tables[t-1].style.top) + 5;
                elt.id = "vizDiv" + t;
                insertAfter(table, elt);
                var trs = table.querySelectorAll("tr");
                for (var i = 1; i < trs.length; i++) {
                    var tds = trs[i].querySelectorAll("td div div span");
                    var title = "";
                    for (var j = 0; j < nameIndex.length; j++) {
                        title += tds[j].textContent;
                        if(j < nameIndex.length - 1)
                         title+= "-";
                 }
                 title.substr(0,title.length -1);
                 var startDateString = tds[startIndex].textContent.split('\/');
                 var endDateString = tds[endIndex].textContent.split('\/');

                 var startDate = new Date(startDateString[2], startDateString[0], startDateString[1]);
                 var endDate = new Date(endDateString[2], endDateString[0], endDateString[1]);
                 if(startDate.getDate() === endDate.getDate()){
                    endDate.setDate(endDate.getDate() + 1);
                }

                var row = [
                title,
                startDate,
                endDate
                ];
                rows.push(row);
            }
            if(vizifyMinStartDate){
                var startDate = vizifyMinStartDate.textContent.split('\/');
                minStartDate = new Date(startDate[2], startDate[0], startDate[1]);
                
                var row = [
                trs[0].children[0].textContent,
                minStartDate, 
                new Date()
                ];
                
                rows.unshift(row);
            }
            var data = {
                columnName: trs[0].children[0].textContent,
                rows: rows
            };
            var charOptions = {
                data: data,
                hook: "#vizDiv" + t,
                colors: colors
            }
            callback(charOptions);
        }
    }
});
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
