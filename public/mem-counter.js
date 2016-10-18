var MEMORY = (function () {

    var totalMem = 0;

    function countMem(instanceName, mem, used) {
        if(mem){
            totalMem += mem;
            countInstance(instanceName, mem, used)
        }
    }

    function countInstance(instanceName, mem, used){
        var $2 = $("#service-" + instanceName + "-mem");

        var actualMemTotal = Number($2.attr("x-mem-total"));
        var actualMemFree = Number($2.attr("x-mem-free"));
        var actualMemUsed = Number($2.attr("x-mem-used"));

        actualMemTotal += mem;
        actualMemUsed += used;
        actualMemFree += actualMemTotal - actualMemUsed;

        $2.attr("x-mem-total", actualMemTotal);
        $2.attr("x-mem-free", actualMemFree);
        $2.attr("x-mem-used", actualMemUsed);


        var formattedMem = formatBytes(actualMemUsed*1000, 0);

        var percentage = actualMemUsed * 100 / actualMemTotal;

        $2.attr("aria-valuenow", actualMemUsed);
        $2.attr("aria-valuemax", actualMemTotal);
        $2.css("width", percentage + "%");
        $2.html(formattedMem);

        console.log("service MEM", instanceName, mem, used, formattedMem, percentage)
    }

    function formatBytes(bytes,decimals) {
        if(bytes == 0) return '0 Byte';
        var k = 1000; // or 1024 for binary
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
    }

    function reset(){
        totalMem = 0;
    }

    return {
        reset: reset,
        countMem: countMem
    };
}());