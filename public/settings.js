var SETTINGS = (function () {

    function setInstances(serviceName, value, callback){

        $.ajax({
            url: "/api/settings/" + serviceName + "/instances/" + value,
            type: "PUT",
            headers: {
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            success: function(data, textStatus, jqXHR) {
                callback(null, data, serviceName);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("BAD REQUEST", jqXHR.responseJSON)
            }
        });
    }


    function bindMinusButtons() {
        $('.decrease').click(function(e){
            e.preventDefault();

            calculateInstances($(this), function(value) {
                return value - 1;
            });

        });
    }

    function calculateInstances(element, operation){
        var serviceName = element.attr("x-serviceName");

        var $2 = $("#" + serviceName + "-instance");
        var data = $2.html();
        var instancesQTD = Number(data);
        instancesQTD = operation(instancesQTD);
        console.log("[SETTINGS] increase", data, instancesQTD);

        if(instancesQTD > 0){
            setInstances(serviceName, instancesQTD, function(err, data, serviceName){
                $2.html(instancesQTD)
            });
        }
    }

    function bindPlusButtons() {
        $('.increase').click(function(e){
            e.preventDefault();

            calculateInstances($(this), function(value) {
                return value + 1;
            });

        });
    }

    function init() {

        bindPlusButtons();
        bindMinusButtons();
    }

    return {
        init: init
    };
}());