define(function () {
    "use strict";
    var loadingNode = document.getElementById('loading-float');

    return {
        show: function (callback, finishedCallback) {
            loadingNode.className = 'loading-float';

            var transitionEndAction = function () {
                loadingNode.removeEventListener('transitionend', 
                    transitionEndAction);
                callback(finishedCallback);
            };

            loadingNode.addEventListener('transitionend', transitionEndAction);
        },
        hide: function () {
            loadingNode.className = 'loading-float loading-hide';
        }
    };
});