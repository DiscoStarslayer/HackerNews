define(function (require) {
    "use strict";
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var articleGenerator = require('./articleGenerator');

    var parser = require('hnParser');

    parser.getArticles(function (data) {
        var articles = data.articles;
        var articleTag = document.body.getElementsByTagName('article')[0];

        var articleFragment = document.createDocumentFragment();
        for (var i = 0; i < articles.length; i++) {
            articleFragment.appendChild(articleGenerator.createArticleDom(articles[i]));
        }
        articleTag.appendChild(articleFragment);
    });
});
