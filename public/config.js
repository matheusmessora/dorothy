var CONFIG = (function () {

    var eureka_host = "";

    var warning_threshold = 1;
    var danger_threshold = 0;

    var services = ["ORDER2", "SHIPPING-LOADER"];

    function loadEurekaHost(callback){
        $.ajax({
            url: "/eureka-host",
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                eureka_host = data.host;
                callback();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, jqXHR.responseJSON)
            }
        });
    }

    return {
        loadEurekaHost: loadEurekaHost,
        host: eureka_host,
        warning_threshold: warning_threshold,
        danger_threshold: danger_threshold,
        services: services
    };
}());