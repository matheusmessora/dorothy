var MEMORY = (function () {

    var totalMem = 0;

    function countMem(instanceName, mem, free) {
        if(mem){
            totalMem += mem;
            countInstance(instanceName, mem, free)
        }
    }

    function countInstance(instanceName, mem, free){
        var $2 = $("#instance-" + instanceName + "-mem");

        var actualMemFree = Number($2.attr("x-mem-free"));
        var actualMem = Number($2.attr("x-mem"));

        actualMem += mem;
        actualMemFree += free;

        $2.attr("x-mem-free", actualMemFree);
        $2.attr("x-mem", actualMem);


        var formattedMem = formatBytes(actualMem*1000, 0);

        var percentage =actualMem * 100 / (actualMem + actualMemFree);

        $2.attr("aria-valuenow", actualMem);
        $2.attr("aria-valuemax", actualMem + actualMemFree);
        $2.attr("aria-valuemax", actualMem + actualMemFree);
        $2.css("width", percentage + "%");
        $2.html(formattedMem);

        console.log("Instances MEM", instanceName, mem, free, formattedMem, percentage)
    }

    function formatBytes(bytes,decimals) {
        if(bytes == 0) return '0 Byte';
        var k = 1000; // or 1024 for binary
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function reset(){
        totalMem = 0;
    }

    return {
        reset: reset,
        countMem: countMem
    };
}());