define(function (require) {
    "use strict";
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var articleGenerator = require('./articleGenerator');
    var loadingScreen = require('./loadingScreen');

    var parser = require('hnParser');

    var runSlowFunction = function (functionToRun) {
        loadingScreen.show(functionToRun, loadingScreen.hide);
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
