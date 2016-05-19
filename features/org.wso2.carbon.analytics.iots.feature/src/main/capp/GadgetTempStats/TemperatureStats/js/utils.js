

var Utils = function(){
    var api =  this;
    var COLUMNS_TYPE_FIELD = "type";
    var COLUMNS_NAMES_FIELD = "name";
    var COLUMNS_LABEL_FIELD = "label";

    api.X = "x";
    api.Y = "y";
    api.COLUMNS_NAMES_FIELD = "name";
    api.placeholder = "#canvas";
    api.errorMessageHolder = "#noChart";
    api.makeRows = function (data, columns) {
        var rows = [];
        for (var i = 0; i < data.length; i++) {
            var record = data[i];
            var row =[];
            for(var j=0; j<2; j++){
                row.push(record[gadgetConfig.columns[j][COLUMNS_NAMES_FIELD]]);
            }
            rows.push(row);
        }
        return rows;
    }

    api.makeDataTable = function (data, columns) {
        var dataTable = new igviz.DataTable();
        if (columns.length > 0) {
            columns.forEach(function (column, i) {
                var type = "N";
                if (column[COLUMNS_TYPE_FIELD].toUpperCase() == "STRING" ) {
                    type = "C";
                } else if (column[COLUMNS_TYPE_FIELD].toUpperCase() == "TIME") {
                    type = "T";
                }
                dataTable.addColumn(column[COLUMNS_NAMES_FIELD], type);
            });
        }
        data.forEach(function (row, index) {
            for (var i = 0; i < row.length; i++) {
                if (dataTable.metadata.types[i] == "N") {
                    data[index][i] = parseInt(data[index][i]);
                }
            }
        });
        dataTable.addRows(data);
        return dataTable;
    }

    api.convertData = function (data, columns) {
        for (var i = 0; i < data.length; i++) {
            for (var x = 0; x < 1; x++) {
                var type = columns[x][COLUMNS_TYPE_FIELD].toUpperCase();
                if (type != "STRING" && type != "BOOLEAN") {
                    data[i][x] = parseFloat(data[i][x]);
                }
            }
        }
        return data;
    }

    api.getAxisDetails = function(axis, config){
        var axis_conf = [];
        var isAvailable = false;
        var axisDetails = {type:"", name:"", label:""};
        for(var i=0;i<config.length;i++){
            if(config[i].axis != undefined && config[i].axis == axis){
                isAvailable = true;
                //todo why cant do this
               /* axisDetails.label = config[i].label;
                axisDetails.name = config[i].name;
                axisDetails.type = config[i].type;*/
                axis_conf.push({type:config[i].type, name:config[i].name, label:config[i].label});
            }
        }
        if(!isAvailable) console.log("please define x and y");

        //TODO define error message
        //console.log("------>><<"+ JSON.stringify(axis_conf));
        return axis_conf;
    }

    api.getAxisIndex = function(axis, config){
        for(var i=0;i<config.length;i++){
            if(config[i].axis != undefined && config[i].axis == axis){
                return i;
            }
        }
    }

    api.getYAxisIndex = function(axis, config){
        var indexes = [];
        for (var i=0; i<config.length; i++){
            if(config[i].axis == undefined || config[i].axis != axis){
               indexes.push(i);
            }
        }
        return indexes;
    }

    api.getAxisLabel = function(index, config){
        return config[index].label;
    }

    api.getAxisNamesByAxisInfo =  function(axisDetails){
        var axisNames = "";
        for(var i=0; i<axisDetails.length; i++){
            axisNames = axisNames.concat(axisDetails[i].name);
            if(i!=axisDetails.length-1){
                axisNames = axisNames.concat(",");
            }
        }
        return axisNames;
    }

    api.getAxisNames =  function(columns){
        var axisNames = "";
        for(var i=0; i<columns.length; i++){
            axisNames = axisNames.concat(columns[i].name);
            if(i!=columns.length-1){
                axisNames = axisNames.concat(",");
            }
        }
        return axisNames;
    }

    api.getAxisTypes =  function(axisDetails){
        var axisType = "";
        for(var i=0; i<axisDetails.length; i++){
            axisType = axisType.concat(axisDetails[i].type);
            if(i!=axisDetails.length-1){
                axisType = axisType.concat(",");
            }
        }
        return axisType;
    }

    api.getType =  function(name, columns, isCheck ){
        var axisType = "";
        for(var i=0; i<columns.length; i++){
           if(columns[i].label == name && isCheck == 1){
               return columns[i].type;
           }else{
               if(isCheck == 0){
                   return columns[i].type;
               }
           }
        }
        return axisType;
    }

    api.getAxisIndexes =  function(name, columns, isCheck ){
        var XAxisIndexes = [];
        var YAxisIndexes = [];
        for(var k=0; k<columns.length; k++){

            if(columns[k].label == name && isCheck == 1){
                XAxisIndexes.push(k);
               return XAxisIndexes;
            }else if(isCheck == 0 && columns[k].label != name){
                    YAxisIndexes.push(k);
            }

        }
        return YAxisIndexes;
    }

    api.getAxisLabels =  function(axisDetails){
        var axisLabel = "";
        for(var i=0; i<axisDetails.length; i++){
            axisLabel = axisLabel.concat(axisDetails[i].label);
            if(i!=axisDetails.length-1){
                axisLabel = axisLabel.concat(",");
            }
        }
        return axisLabel;
    }

    api.createDataTable = function (data, columns) {
        var names = [];
        var types = [];
        for (var i = 0; i < columns.length; i++) {
            var name = columns[i][COLUMNS_LABEL_FIELD];
            names.push(name);
            var type = columns[i][COLUMNS_TYPE_FIELD].toUpperCase();
            if (type === "INT" || type === "INTEGER" || type === "FLOAT" || type === "DOUBLE") {
                type = "linear";
            } else if (columns[i][COLUMNS_TYPE_FIELD].toUpperCase() == "TIME" ) {
                type = "time";
            } else {
                type = "ordinal";
            }
            types.push(type);
        }
        datatable = [
            {
                "metadata": {
                    "names": names,
                    "types": types
                },
                "data": data
            }
        ];
        return datatable;
    }

    api.getAllQueryParamsFromURL = function () {
        var queryParamList = {}, qParam;
        var urlQueryString = decodeURIComponent(window.top.location.search.substring(1));

        if (urlQueryString) {
            var queryStringPairs = urlQueryString.split('&');
            for (var i = 0; i < queryStringPairs.length; i++) {
                qParam = queryStringPairs[i].split('=');
                queryParamList[qParam[0]] = qParam[1];
            }
            return queryParamList;

        } else {
            return null;
        }
    }

    api.getValuesOfQueryFilter = function(paramsToFilterBy, urlQueryParams) {
        var queryValues = [];
        for (var i = 0; i < paramsToFilterBy.length; i++) {
            var queryV = urlQueryParams[paramsToFilterBy[i]];
            if (typeof queryV != "undefined" && queryV != null && queryV != "") {
                queryValues[paramsToFilterBy[i]] = queryV;
            } else {
                return null;
            }
        }
        return queryValues;
    }

    api.parseColumns = function(data) {
        if (data.columns) {
            var keys = Object.getOwnPropertyNames(data.columns);
            columns = keys.map(function (key, i) {
                return column = {
                    name: key,
                    type: data.columns[key][COLUMNS_TYPE_FIELD]
                };
            });
            return columns;
        }
    }

    api.convertToEpoch = function (unix_timestamp) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        var thisDate = date.getDate();
        var thisMonth = date.getMonth();
        var thisYear = date.getUTCFullYear();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        // Will display time in 10:30:23 format
        return (formattedTime);
    }

    api.sortData = function (payload, field) {
        var dataFromDAS = JSON.parse(payload);
        sortedData = dataFromDAS.sort(function (a, b) {
            return a.field - b.field;
        });
        return sortedData;
    }

    api.intervalTrigger = function(callBack, interval) {
        return window.setInterval( callBack, interval );
    };



//stuff required for realtime charting
    /*
     function onRealTimeEventSuccessRecieval(streamId, data) {
     drawRealtimeChart(data);
     }
     */

    /*function onRealTimeEventErrorRecieval(dataError) {
     console.log("Error occurred " + dataError);
     }*/

    /**
     * Draws the real-time chart based on the values in the data object passed in.
     * @param data an object containing all the column:value pair data
     */
    /*function drawRealtimeChart(data, placeholder, gadgetConfig) {
     if(gadgetConfig.chartConfig){
     if (chart == null) {
     jQuery("#noChart").html("");
     gadgetConfig.chartConfig.width = $(placeholder).width() - 110;
     gadgetConfig.chartConfig.height = $(placeholder).height() - 40;
     chart = new vizg(createDataTable(convertData(data, gadgetConfig), gadgetConfig), gadgetConfig.chartConfig);
     chart.draw(placeholder);
     } else {
     chart.insert(convertData(data, gadgetConfig));
     }
     }
     }*/

    /**
     * Draws the batch-chart based on the values in the data object passed in.
     * @param data an object containing all the column:value pair data
     */

   /* function drawChart(data, placeholder,errorMessageHolder, gadgetConfig) {
        var dataTable = utils.makeDataTable(data, gadgetConfig.columns);
        gadgetConfig.chartConfig.width = $(placeholder).width();
        gadgetConfig.chartConfig.height = $(placeholder).height() - 65;
        var chartType = gadgetConfig.chartConfig.chartType;
        var xAxis = gadgetConfig.chartConfig.xAxis;
        jQuery(errorMessageHolder).html("");
        if (chartType === "bar" && dataTable.metadata.types[xAxis] === "N") {
            dataTable.metadata.types[xAxis] = "C";
        }
        if (gadgetConfig.chartConfig.chartType === "table" || gadgetConfig.chartConfig.chartType === "singleNumber") {
            gadgetConfig.chartConfig.height = $(placeholder).height();
            chart = igviz.draw(placeholder, gadgetConfig.chartConfig, dataTable);
            chart.plot(dataTable.data);

        } else {
            chart = igviz.setUp(placeholder, gadgetConfig.chartConfig, dataTable);
            chart.setXAxis({
                    "labelAngle": -35,
                    "labelAlign": "right",
                    "labelDy": 0,
                    "labelDx": 0,
                    "titleDy": 25
                })
                .setYAxis({
                    "titleDy": -30
                });
            chart.plot(dataTable.data);
        }
    }*/
}