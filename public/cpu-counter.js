var CPU = (function () {

    var cores = 0;

    function countCores(instanceName, processors) {
        if(processors){
            cores += processors;
            countInstanceCore(instanceName, processors)
        }

        $("#qtd-cpu").html(cores)
    }

    function countInstanceCore(instanceName, processors){
        console.log("Instances Cores", instanceName, processors)
        var actualCores = Number($("#instance-" + instanceName + "-cpu").attr("x-value"));
        actualCores += processors;
        $("#instance-" + instanceName + "-cpu").attr("x-value", actualCores).html("CPU: " + actualCores);
    }

    function reset(){
        cores = 0;
    }

    return {
        reset: reset,
        countCores: countCores
    };
}());