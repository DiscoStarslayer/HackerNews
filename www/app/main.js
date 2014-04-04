define(function (require) {
    "use strict";
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var articleGenerator = require('./articleGenerator');
    var loadingScreen = require('./loadingScreen');
    var interaction = require('./interaction');

    var parser = require('hnParser');
    var touchEvents = require('touchEvents');

    var runSlowFunction = function (functionToRun) {
        loadingScreen.show(functionToRun, loadingScreen.hide);
    };

    var testFunction = function (event) {
        console.log(event.target);
    };

    var loadArticles = function (finishedCallback) {
        var articleTag = document.body.getElementsByTagName('article')[0];
        emptyNode(articleTag);

        parser.getArticles(function (data) {
            var articles = data.articles;
            var articleFragment = document.createDocumentFragment();

            for (var i = 0; i < articles.length; i++) {
                articleFragment.appendChild(
                    articleGenerator.createArticleDom(articles[i]));
            }

            articleTag.appendChild(articleFragment);
            //interaction.applyClickHandlers(
                //document.getElementsByClassName('article-touch-container'));

            var articleTouchContainers = 
                document.getElementsByClassName('article-touch-container');
            var articleTouchContainersLength = articleTouchContainers.length;

            for (var j = 0; j < articleTouchContainersLength; j++) {
                var articleTouchContainer = articleTouchContainers[j];
                touchEvents.attachInteractionEvents(articleTouchContainer);

                articleTouchContainer.addEventListener('tap', testFunction);
            }

            setTimeout(finishedCallback, 200);
        });
    };

    var emptyNode = function (node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };


    runSlowFunction(loadArticles);

});
