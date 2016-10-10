var CONFIG = (function () {

    var warning_threshold = 1;
    var danger_threshold = 0;

    var services = ["ORDER2", "SHIPPING-LOADER"];

    return {
        warning_threshold: warning_threshold,
        danger_threshold: danger_threshold,
        services: services
    };
}());