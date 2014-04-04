define(function () {
    "use strict";

    var DRAG = 'd';
    var COMMENT_TAP = 'c';
    var COMMENT_LONG = 'cl';
    var ARTICLE_TAP = 'a';
    var ARTICLE_LONG = 'l';

    var currentTouches = {};

    var copyTouchData = function (touch) {
        return {screenX: touch.screenX, screenY: touch.screenY,
            movementX: 0, movementY: 0,
            startTime: Date.now()};
    };

    var updateMovement = function (touch) {
        var oldTouchData = currentTouches[touch.identifier];

        var newTouchData = copyTouchData(touch);

        newTouchData.movementX =
            Math.abs(touch.screenX - oldTouchData.screenX) +
            oldTouchData.movementX;

        newTouchData.movementY =
            Math.abs(touch.screenY - oldTouchData.screenY) +
            oldTouchData.movementY;

        newTouchData.startTime = oldTouchData.startTime;

        return newTouchData;
    };

    var getDeltaTime = function (touch) {
        var touchData = currentTouches[touch.identifier];
        return Date.now() - touchData.startTime;
    };

    var determineTouchType = function (touch) {
        var touchData = currentTouches[touch.identifier];

        //we didnt drag finger
        if (touchData.movementX < 10 && touchData.movementY < 10) {
            var target = touch.target;

            var deltaTime = getDeltaTime(touch);

            if (target.id == 'comment-box') {

                if (deltaTime < 1000) {
                    return COMMENT_TAP;
                } else {
                    return ARTICLE_LONG;
                }

            } else {

                if (deltaTime < 1000) {
                    return ARTICLE_TAP;
                } else {
                    return ARTICLE_LONG;
                }

            }

        } else {
            return DRAG;
        }
    };

    var startTouch = function (touchEvent) {
        var touchList = touchEvent.changedTouches;

        for (var i = 0; i < touchList.length; i++) {
            var touch = touchList[i];

            currentTouches[touch.identifier] = copyTouchData(touch);
        }
        touchEvent.currentTarget.classList.toggle('active', true);
    };

    var moveTouch = function (touchEvent) {
        var touchList = touchEvent.changedTouches;

        for (var i = 0; i < touchList.length; i++) {
            var touch = touchList[i];

            currentTouches[touch.identifier] = updateMovement(touch);
        }
    };

    var endTouch = function (touchEvent) {
        var touchList = touchEvent.changedTouches;

        for (var i = 0; i< touchList.length; i++) {
            var touch = touchList[i];

            var touchType = determineTouchType(touch);

            if (touchType == ARTICLE_TAP) {
                alert('open article');
            } else if (touchType == COMMENT_TAP) {
                alert('open comment');
            }

            delete currentTouches[touch.identifier];
        }

        touchEvent.currentTarget.classList.toggle('active', false);
    };

    return {
        applyClickHandlers: function (DOMObjects) {

            for (var i = 0; i < DOMObjects.length; i++) {
                var thisObject = DOMObjects[i];

                thisObject.addEventListener('touchstart', startTouch);
                thisObject.addEventListener('touchend', endTouch);
                thisObject.addEventListener('touchmove', moveTouch);
                thisObject.addEventListener('touchleave', endTouch);
                thisObject.addEventListener('touchcancel', endTouch);
            }

        }
    };
});