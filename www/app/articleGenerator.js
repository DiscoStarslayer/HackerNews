define(function () {
    "use strict";

    var subtextFromData = function (articleData) {
        var subtextString;

        if (articleData.articleType == 'job') {
            subtextString = articleData.time;
        } else {
            subtextString = articleData.score + ' points by ' +
                articleData.user + ' ' + articleData.time;
        }

        return subtextString;
    };

    return {
        createArticleDom: function (articleData) {
            var articleContainer = document.createElement('div');
            articleContainer.className = 'article-container';

            var commentBox = document.createElement('div');
            commentBox.className = 'comment-box';

            var comments = document.createElement('p');
            comments.className = 'comments';
            comments.textContent = articleData.comments;

            var articleTitle = document.createElement('p');
            articleTitle.className = 'article-title';
            articleTitle.textContent = articleData.title;

            var br = document.createElement('br');

            var articleSubtext = document.createElement('p');
            articleSubtext.className = 'mini article-data';
            articleSubtext.textContent = subtextFromData(articleData);

            articleContainer.appendChild(commentBox).appendChild(comments);
            articleContainer.appendChild(articleTitle);
            articleContainer.appendChild(br);
            articleContainer.appendChild(articleSubtext);

            return articleContainer;
        }
    };
});