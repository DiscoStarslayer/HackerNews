define(function () {
    "use strict";

    var hnUrl = "https://news.ycombinator.com/";

    var isOdd = function (value) {
        return (value % 2 == 1);
    };

    var getPageData = function (url, callback) {
        var request = new XMLHttpRequest({
            mozSystem: true
        });

        //need a temporary call back to pass XHR result
        //as a variable
        var xhrWrapper = function() {
            callback(this);
        };

        var xhrError = function() {
            callback(undefined);
        };

        request.onload = xhrWrapper;
        request.onerror = xhrError;
        request.open("GET", url, true);
        request.responseType = "document";
        request.send();
    };

    var getNextPage = function (pageData) {
        var pageDocument = pageData.responseXML;

        //crazy selector autogenerated with firefox
        var moreButton = pageDocument.querySelector(
            'td.title:nth-child(2) > a:nth-child(1)');

        return moreButton.getAttribute('href');

    };

    var parseScore = function (rawScoreText) {
        //example text: 140 points
        //mode of action, trim whitespace, split by space, convert left side to
        //int

        var scoreTokens = rawScoreText.trim().split(' ');
        return parseInt(scoreTokens[0], 10);
    };

    var parseComments = function (rawCommentText) {
        //example text: 96 comments
        //same method as parseScore, but if == discuss then 0 comments

        var cleanedCommentText = rawCommentText.trim();

        if (cleanedCommentText == 'discuss') {
            return 0;
        }

        var commentTokens = cleanedCommentText.split(' ');
        return parseInt(commentTokens[0], 10);
    };

    var parseTime = function (rawTimeText, articleType) {
        //A little trickier this time, time text from job articles are easy
        //but post articles have the entire string since it isn't wrapped in
        //a HTML tag, ex "140 points by GabrielF00 2 hours ago  | 96 comments"
        //job ex "2 hours ago"
        if (articleType == 'job') {
            return rawTimeText.trim();
        } else {
            var tokens = rawTimeText.trim().split(' ');

            //as far as I can tell, token count doesnt change up to the time so
            //we'll take advantage of that, also usernames can't contain spaces
            var parsedTime = tokens[4] + ' ' + tokens[5] + ' ' + tokens[6];

            return parsedTime;
        }
    };

    var zipArticleData = function (articleList, subtextList) {
        //zips together articleList and subtextList into array of objects

        var fullList = [];
        for (var i = 0; i < articleList.length; i++) {
            var fullObject = {};
            var article = articleList[i];
            var subtext = subtextList[i];

            fullObject.title = article.title;
            fullObject.url = article.url;
            if (subtext.articleType == 'job') {
                fullObject.time = subtext.time;
                fullObject.comments = 'Job';
                fullObject.commentsURL = article.url;
            } else {
                fullObject.score = subtext.score;
                fullObject.user = subtext.user;
                fullObject.userURL = subtext.userURL;
                fullObject.time = subtext.time;
                fullObject.comments = subtext.comments;
                fullObject.commentsURL = subtext.commentsURL;
            }
            fullObject.articleType = subtext.articleType;
            fullList.push(fullObject);
        }

        return fullList;
    };

    var getArticles = function (pageData) {
        //This is where things get weird, all titles are listed under the
        //title class (thankfully) but so is the article height. I assert
        //that if you grab all titles, then skip every odd title you'll get
        //the articles you need with a child <a> tag. If you stop after 60,
        //title class doesn't collide with any other objects, everything before
        //is inline css.
        //subtext data is nicely colected into the subtext class, atleast that
        //is easy
        //Thankfully the page hasn't changed often since launch, should be
        //decently stable

        var pageDocument = pageData.responseXML;
        var titles = pageDocument.querySelectorAll('.title'); //the fun bit
        var subtexts = pageDocument.querySelectorAll('.subtext'); //boring


        var articleList = [];
        var i;
        //lets grab the titles :) 60 because 30 articles a page * 2 for skip
        for (i = 0; i < 60; i++) {
            if (isOdd(i)) {
                var articleData = {};
                var thisTitle = titles[i];

                //first child of title class is the anchor we want
                var articleAnchor = thisTitle.children[0];
                articleData.title = articleAnchor.textContent;
                articleData.url = articleAnchor.getAttribute('href');
                articleList.push(articleData);
            }
        }

        var subtextList = [];
        for (i = 0; i < subtexts.length; i++) {
            var subtextData = {};
            var thisSubtext = subtexts[i];
            //children are score, user, comments. In that order with some
            //spreadout text in the parent. If job post there are no children
            //tags

            //job post
            if (thisSubtext.children.length === 0) {
                subtextData.articleType = 'job';

                //job posts only contain time
                subtextData.time = parseTime(thisSubtext.textContent,
                    subtextData.articleType);

            } else {
                subtextData.articleType = 'post';

                //score
                var scoreSpan = thisSubtext.children[0];
                subtextData.score = parseScore(scoreSpan.textContent);

                //user
                var user = thisSubtext.children[1];
                subtextData.user = user.textContent;

                subtextData.userURL = user.getAttribute('href');

                //comments
                var comments = thisSubtext.children[2];
                subtextData.comments = parseComments(comments.textContent);

                subtextData.commentsURL = comments.getAttribute('href');

                //time
                subtextData.time = parseTime(thisSubtext.textContent,
                    subtextData.articleType);
            }

            subtextList.push(subtextData);
        }

        return zipArticleData(articleList, subtextList);
    };

    var pageDataToOutput = function (pageData, callback) {
        var nextPage = getNextPage(pageData);
        var articles = getArticles(pageData);

        var returnable = {
            nextPage: nextPage,
            articles: articles
        };

        callback(returnable);
    };

    return {
        getArticles: function (callback, url) {
            //gets list of articles from provided url
            //if no url specified grabs articles from front page
            //
            //returns an object to callback:
            //
            //on success:
            //  nextPage: url to next page
            //  articles: array of objects
            //      title: article title
            //      url: article url
            //      score: article score
            //      user: user who posted the article
            //      userURL: url to the userpage
            //      time: when post was made
            //      comments: number of comments
            //      commentsURL: url for comments page
            //      articleType: article type: job, post
            //on error:
            //  Error

            if ('undefined' === typeof url) {
                url = hnUrl;
            } else {
                url = hnUrl + url;
            }

            getPageData(url, function(pageData) {
                if ('undefined' === typeof pageData) {
                    return new Error('There was a problem loading the page');
                } else {
                    pageDataToOutput(pageData, callback);
                }
            });
        }
    };
});