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
            var touchContainer = document.createElement('div');
            touchContainer.id = 'article-touch-container';
            touchContainer.classList.add('article-touch-container');

            var articleContainer = document.createElement('div');
            articleContainer.classList.add('article-container');

            var commentBox = document.createElement('div');
            commentBox.classList.add('comment-box');
            commentBox.id = 'comment-box';

            var comments = document.createElement('p');
            comments.classList.add('comments');
            comments.id = 'comment-box';
            comments.textContent = articleData.comments;

            var articleTitle = document.createElement('p');
            articleTitle.classList.add('article-title');
            articleTitle.textContent = articleData.title;

            var br = document.createElement('br');

            var articleSubtext = document.createElement('p');
            articleSubtext.classList.add('mini');
            articleSubtext.classList.add('article-data');
            articleSubtext.textContent = subtextFromData(articleData);

            articleContainer.appendChild(commentBox).appendChild(comments);
            articleContainer.appendChild(articleTitle);
            articleContainer.appendChild(br);
            articleContainer.appendChild(articleSubtext);
            touchContainer.appendChild(articleContainer);

            return touchContainer;
        }
    };
});