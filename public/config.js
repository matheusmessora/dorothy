var CONFIG = (function () {

    var warning_threshold = 1;
    var danger_threshold = 0;

    var services = [];

    function init(callback){
        $.ajax({
            url: "/api/services",
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            success: function(data, textStatus, jqXHR) {
                CONFIG.services = data;
                callback(null)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("BAD REQUEST", jqXHR.responseJSON)
            }
        });
    }

    return {
        init: init,
        warning_threshold: warning_threshold,
        danger_threshold: danger_threshold,
        services: services
    };
}());