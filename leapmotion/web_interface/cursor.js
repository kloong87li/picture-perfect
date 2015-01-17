
// bounding coords should be obj with top, bottom, left, and right
function Cursor(boundingCoords, color) {
    this.cursorEl = $("<div class='hand-cursor'></div>");
    $("body").append(this.cursorEl);

    this.bounds = boundingCoords;
    this.cursorEl.offset({top: this.bounds.top, left: this.bounds.left});
    this.cursorEl.css({'background-color': color});

    this.listeners = [];

}


Cursor.prototype.updatePos = function(position, ibox) {
    var normalizedPoint = ibox.normalizePoint(position, true);

    var appX = normalizedPoint[0] * WINDOW_WIDTH;
    var appY = (1 - normalizedPoint[1]) * WINDOW_HEIGHT;

    // clamp appX and appY to bounds
    appY = Math.min(appY, this.bounds.bottom);
    appY = Math.max(appY, this.bounds.top);
    appX = Math.min(appX, this.bounds.right);
    appX = Math.max(appX, this.bounds.left);

    // update cursor element pos
    this.cursorEl.css({top: appY, left: appX});

    // fire any listener events
    for (var i = 0; i < this.listeners.length; i++) {
        var data = this.listeners[i];

        elPos = data.element.offset();
        if ((elPos.left <= appX && appX <= elPos.left + data.element.width()) &&
            (elPos.top <= appY && appY <= elPos.top + data.element.height())) {
            if (data.has_entered) {
                data.hover();
            } else {
                data.enter();
                data.has_entered = true;
            }
        } else if (data.has_entered) {
            data.exit();
            data.has_entered = false;
        }
    }
}


Cursor.prototype.registerListener = function(el, enterCb, hoverCb, exitCb) {
    var data = {
        element: el,
        enter: enterCb,
        hover: hoverCb,
        exit: exitCb,
        has_entered: false
    };

    this.listeners.push(data);
}


Cursor.prototype.deregisterListener = function(el) {
    for (var i = 0; i < this.listeners.length; i++) {
        if (this.listeners[i].element === el) {
            this.listeners.splice(i, 1);
        }
    }
}
















