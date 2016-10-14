var INDEX = (function () {

    var template = $("#application-map").html();
    var outOfServiceTemplate = $("#application-out-of-service").html();

    function getMetric(url, instance, callback) {

        $.ajax({
            url: "/metric?url=" + url,
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            success: function(data, textStatus, jqXHR) {
                callback(null, data, instance);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("BAD REQUEST", jqXHR.responseJSON)
            }
        });
    }

    function loadFixedServices() {
        for (var i = 0; i < CONFIG.services.length; i++) {
            var service = CONFIG.services[i];
            var alert = 'danger';
            var icon = 'glyphicon-fire';

            var json = {
                name: service,
                alert: {
                    level: alert,
                    icon: icon
                }
            };

            var rendered = Mustache.render(outOfServiceTemplate, json);

            $('.' + json.alert.level + '-host-map').prepend(rendered)
        }
    }

    function remove(arr, what) {
        var found = arr.indexOf(what);

        while (found !== -1) {
            arr.splice(found, 1);
            console.log("Removed " + what, arr);
            found = arr.indexOf(what);
        }
    }

    function getApps(callback) {

        $.ajax({
            url: "/eureka/apps",
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            success: function(data, textStatus, jqXHR) {
                callback(null, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("BAD REQUEST", jqXHR.responseJSON)
            }
        });
    }

    function count(data){
        var applications = data.applications.application;

        var hostSet = new Set();
        var totalInstances = 0;
        var totalApplications = applications.length;

        for (var i = 0; i < applications.length; i++) {
            var instances = applications[i].instance;
            for (var j = 0; j < instances.length; j++) {
                var element = instances[j].hostName;
                hostSet.add(element);
            }
            totalInstances += instances.length;
        }

        $("#qtd-hosts").html(hostSet.size);
        $("#qtd-instances").html(totalInstances);
        $("#qtd-applications").html(totalApplications);
    }

    function hostMap(data) {
        var applications = data.applications.application;

        for (var i = 0; i < applications.length; i++) {
            var applicationName = applications[i].name;

            remove(CONFIG.services, applicationName);
            var instances = applications[i].instance;
            var alert = 'info';
            var icon = '';

            if(instances.length == CONFIG.warning_threshold){
                alert = 'warning';
                icon = 'glyphicon-exclamation-sign'
            } else if(instances.length == CONFIG.danger_threshold){
                alert = 'danger';
                icon = 'glyphicon-fire'
            }

            var json = {
                name: applicationName,
                instances: instances,
                alert: {
                    level: alert,
                    icon: icon
                }

            };

            for (var j = 0; j < instances.length; j++) {
                var instance = instances[j];
                instance.uid = instance.statusPageUrl.replace(/[^a-z0-9]/gi,'');

                getMetric(instance.homePageUrl + "metrics", instance, function(err, data, instance){
                    if(err) {
                        console.error(err)
                        return;
                    }

                    // console.log(id, data['systemload.average'])
                    var cpuLoad = data['systemload.average'] * 100 / data.processors;

                    if(cpuLoad > 125){
                        $("#instance-" + instance.uid).addClass("danger");
                    }else if(cpuLoad > 100){
                        $("#instance-" + instance.uid).addClass("warning");
                    }


                    CPU.countCores(instance.app, data.processors);
                    MEMORY.countMem(instance.app, data.heap, data["heap.used"]);
                })
            }

            var rendered = Mustache.render(template, json);

            $('.' + json.alert.level + '-host-map').prepend(rendered)
        }
    }

    function triggerEffects() {
        var dangerDiv = $(".danger");
        var warningDiv = $(".warning");

        setInterval(function(){
            dangerDiv.toggleClass("danger");
            warningDiv.toggleClass("warning");
        },500)
    }

    function loadApplications() {
        $('.warning-host-map').html('');
        $('.danger-host-map').html('');
        $('.info-host-map').html('');

        CPU.reset();
        MEMORY.reset();
        getApps(function(err, data){
            if(err) {
                console.error(err)
                return;
            }

            console.log(data);

            count(data);
            hostMap(data);
            loadFixedServices();


            // triggerEffects();
        });
    }

    function bindRefreshButton() {
        $('#refresh').click(function(e){
            e.preventDefault();

            loadApplications();
        });
    }

    function init() {

        CONFIG.init(function(err) {
            loadApplications();
            setInterval(function(){
                loadApplications();
            },300000);

            bindRefreshButton();
        });

    }

    return {
        init: init
    };
}());