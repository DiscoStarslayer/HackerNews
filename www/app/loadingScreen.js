define(function () {
    "use strict";
    var loadingNode = document.getElementById('loading-float');

    return {
        show: function (callback, finishedCallback) {
            loadingNode.classList.toggle('loading-hidden', false);

            var transitionEndAction = function () {
                loadingNode.removeEventListener('transitionend', 
                    transitionEndAction);
                callback(finishedCallback);
            };

            loadingNode.addEventListener('transitionend', transitionEndAction);
        },
        hide: function () {
            loadingNode.classList.toggle('loading-hidden', true);
        }
    };
});