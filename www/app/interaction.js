define(function () {
    "use strict";

    var articleTouchStartHandler = function (tapEvent) {
        tapEvent.target.classList.toggle('active', true);
    };

    var articleTapHandler = function (tapEvent) {

    };

    var articleLongPressHandler = function (pressEvent) {

    };

    var articleTouchOverHandler = function (leaveEvent) {
        leaveEvent.target.classList.toggle('active', false);
    };

    return {
        handleArticleInteraction: function(articleTouchContainer) {
            articleTouchContainer.addEventListener('tap', articleTapHandler);

            articleTouchContainer.addEventListener('longpress',
                articleLongPressHandler);

            articleTouchContainer.addEventListener('toucheventstart', 
                articleTouchStartHandler);

            articleTouchContainer.addEventListener('toucheventover',
                articleTouchOverHandler);
        }
    };
});