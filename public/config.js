var CONFIG = (function () {

    var eureka_host = "http://localhost:3001";

    var warning_threshold = 1;
    var danger_threshold = 0;

    var services = ["ORDER2", "SHIPPING-LOADER"];

    return {
        host: eureka_host,
        warning_threshold: warning_threshold,
        danger_threshold: danger_threshold,
        services: services
    };
}());