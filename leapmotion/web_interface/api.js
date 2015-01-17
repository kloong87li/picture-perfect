API = {
    ROOT: "http://pp-rpi.noip.me:80"
}

API.startLoading = function() {
    $(".loading").text("Loading...");
}

API.stopLoading = function() {
    $(".loading").text("");
}

function wrap(cb) {
    return function(data) {
        if (!data.success) {
            $(".loading").text("Error!");
            return;
        }
        API.stopLoading();
        cb(data);
    };
}


API.startPreview = function(callback) {
    API.startLoading();
    $.post(API.ROOT+"/preview", wrap(callback));
}


API.stopPreview = function(callback) {
    API.startLoading();
    $.post(API.ROOT+"/stop_preview", wrap(callback));
}


API.getBrightness = function(callback) {
    API.startLoading();
    $.get(API.ROOT+"/brightness", wrap(callback));
}


API.setBrightness = function(val, callback) {
    API.startLoading();
    $.post(API.ROOT+"/brightness?value=" + val, wrap(callback));
}


API.getZoom = function(callback) {
    API.startLoading();
    $.get(API.ROOT+"/zoom", wrap(callback));
}


API.setZoom = function(val, callback) {
    API.startLoading();
    $.post(API.ROOT+"/zoom?value=" + val, wrap(callback));
}


API.capture = function(callback) {
    API.startLoading();
    $.post(API.ROOT + "/capture", wrap(callback));
}


API.setEffect = function(value, callback) {
    API.startLoading();
    $.post(API.ROOT + "/image_effect?value=" + value, wrap(callback));
}
