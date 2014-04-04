define(function () {
    "use strict";

    var longPress = new Event('longpress');
    var tap = new Event('tap');
    var touchEventOver = new Event('toucheventover');
    var touchEventStart = new Event('toucheventstart');
    var touchData = {};

    var getTouchData = function (touch) {
        return touchData[touch.identifier];
    };

    var isDrag = function (touchData) {
        return (touchData.movementX > 10 &&
            touchData.movementY > 10);
    };

    var checkIfLongPress = function (touch) {
        updateTouchData(touch);
        var data = getTouchData(touch);

        if (!isDrag(data)) {
            data.currentTarget.dispatchEvent(longPress);
            touchData[touch.identifier].hasLongPressed = true;
        }

    };

    var checkIfTap = function (touch) {
        updateTouchData(touch);
        var data = getTouchData(touch);
        var hasLongPressed = data.hasLongPressed;

        if (!isDrag(data) && !hasLongPressed) {
            data.currentTarget.dispatchEvent(tap);
        }
    };

    var initTouchData = function (touch, currentTarget) {
        var longPressTimeoutId = window.setTimeout(function () {
            checkIfLongPress(touch);
        }, 1500);
        touchData[touch.identifier] = {
            screenX: touch.screenX,
            screenY: touch.screenY,
            movementX: 0,
            movementY: 0,
            startTime: Date.now(),
            longPressTimeoutId: longPressTimeoutId,
            currentTarget: currentTarget,
            hasLongPressed: false
        };

        currentTarget.dispatchEvent(touchEventStart);
    };

    var updateTouchData = function (touch) {
        var oldTouchData = getTouchData(touch);
        var newTouchData = oldTouchData;

        newTouchData.screenX = touch.screenX;
        newTouchData.screenY = touch.screenY;

        newTouchData.movementX = 
            Math.abs(touch.screenX - oldTouchData.screenX) +
            oldTouchData.movementX;
        newTouchData.movementY =
            Math.abs(touch.screenY - oldTouchData.screenY) +
            oldTouchData.movementY;

        touchData[touch.identifier] = newTouchData;
    };

    var removeTouchData = function (touch) {
        var data = getTouchData(touch);

        window.clearTimeout(data.longPressTimeoutId);
        data.currentTarget.dispatchEvent(touchEventOver);
        delete touchData[touch.identifier];
    };

    var startTouch = function (touchEvent) {
        var touchList = touchEvent.changedTouches;

        var touchListLength = touchList.length;
        for (var i = 0; i < touchListLength; i++) {
            var touch = touchList[i];
            initTouchData(touch, touchEvent.currentTarget);
        }

    };

    var moveTouch = function (touchEvent) {
        var touchList = touchEvent.changedTouches;

        var touchListLength = touchList.length;
        for (var i = 0; i < touchListLength; i++) {
            var touch = touchList[i];
            updateTouchData(touch);
        }
    };

    var endTouch = function (touchEvent) {
        var touchList = touchEvent.changedTouches;

        var touchListLength = touchList.length;
        for (var i = 0; i < touchListLength; i++) {
            var touch = touchList[i];

            checkIfTap(touch);
            removeTouchData(touch);
        }

    };

    return {

        //Adds logic for new events to the element given to the function
        //dispatches 'tap' event on a single tap
        //dispatches 'longpress' event on a long press
        attachInteractionEvents: function (element) {
            element.addEventListener('touchstart', startTouch);
            element.addEventListener('touchend', endTouch);
            element.addEventListener('touchmove', moveTouch);
            element.addEventListener('touchleave', endTouch);
            element.addEventListener('touchcancel', endTouch);
        }

    };

});