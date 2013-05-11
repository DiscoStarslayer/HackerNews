
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Zepto provides nice js and DOM methods (very similar to jQuery,
    // and a lot smaller):
    // http://zeptojs.com/
    var $ = require('zepto');

    // Need to verify receipts? This library is included by default.
    // https://github.com/mozilla/receiptverifier
    require('receiptverifier');

    // Want to install the app locally? This library hooks up the
    // installation button. See <button class="install-btn"> in
    // index.html
    require('./install-button');

    // Write your app here.

    function openArticleInBrowser(url){
        var url = $("#frame").attr("src");
        cornerClick(this);
        window.location = "#";
        var openURL = new MozActivity({
            name: "view",
            data: {
                type: "url", // Possibly text/html in future versions
                url: url
            }
        });
    }

    function readjustHeight(elem){
        $(elem).height($(window).height()-50);
    }

    function readjustApplicationHeight(){
        readjustHeight('.content');
        readjustHeight('.fulltext');
        readjustHeight('#frame');
    }

    function slideWindow(){
        $('.icon').removeClass("icon-close").addClass("icon-back");
        window.location = "#slide";
    }

    function articleClick(elem){
        $('.fulltext').empty();
        $('.fulltext').append('<iframe src="" id="frame" sandbox="allow-forms allow-scripts" mozbrowser remote></iframe>');
        slideWindow();
        window.setTimeout(function(){
            $('#header').text("Article");
            $('#openBrowse').show();
            $('#frame').attr("src", elem.attr("data-url"));
        }, 500);
    }

    function commentClick(elem){
        $('.fulltext').empty();
        $('.fulltext').append('<table id="commentTable"></table>');

        slideWindow();

        window.setTimeout(function(){
            $('#header').text("Comments");
            getHTML('https://news.ycombinator.com/' + elem.attr("data-url"), parseComments);
        }, 500);
    }

    function cornerClick(elem){
        if($('.icon').hasClass("icon-close")){
            close();
        }

        $('.icon').removeClass("icon-back").addClass("icon-close");
        $('#openBrowse').hide();
        $('#header').text("Hacker News");
        window.setTimeout(function() {
            $('#frame').attr("src", "");
        }, 500);
    }

    function createArticleBlock(article){
        var block = '<tr><td class="left" data-url="' + article.articleURL + 
                    '"><p><span class="title">' + article.title + 
                    '</span><br /><span class="subtitle">' + article.subText +
                    '</span></p></td><td class="right" data-url="' + article.commentsURL +
                    '"><p class="comments">' + article.comments + '</p></td></tr>';
        $("#articleTable").append(block);
    }

    function createCommentBlock(comment){
        var block = '<tr><td><p>' + comment.body + '</p></td></tr>';
        $("#commentTable").append(block);
    }

    function displayArticles(articles){
        for (var i = 0; i < articles.length; i++){
            createArticleBlock(articles[i]);
        }
    }

    function addClickHandlers(){
        $(".left").click(function() {
            articleClick($(this));
        });
        $(".right").click(function() {
            commentClick($(this));
        });
        $("#openBrowse").click(function(){
            openArticleInBrowser();
        });
    }

    function parseComments(){
        var page = this.responseXML;
        var temp = { body : "This is a test" };

        for (var i = 0; i < 100; i++){
            createCommentBlock(temp);
        }
    }

    function parseHomepage() {
        var articles = new Array();

        var page = this.responseXML;

        var titleClasses = page.getElementsByClassName('title');
        var rawSubText = page.getElementsByClassName('subtext');

        for (var i = 1; i < titleClasses.length; i = i + 2){
            articles.push({ title : titleClasses[i].childNodes[0].textContent, 
                            articleURL : titleClasses[i].childNodes[0].getAttribute("href")});
        }

        for (var i = 0; i < rawSubText.length; i++){
            if (rawSubText[i].childNodes.length > 1){
                var subText = rawSubText[i].childNodes[0].textContent +
                              rawSubText[i].childNodes[1].textContent +
                              rawSubText[i].childNodes[2].textContent +
                              rawSubText[i].childNodes[3].textContent;

                //remove 3 trailling characters
                articles[i].subText = subText.slice(0, -3);
                articles[i].comments = rawSubText[i].childNodes[4].textContent;
                articles[i].commentsURL = rawSubText[i].childNodes[4].getAttribute("href");
            } else {
                articles[i].subText = rawSubText[i].childNodes[0].textContent;
                articles[i].comments = "Job";
                articles[i].commentsURL = articles[i].articleURL;
            }
        }

        displayArticles(articles);
        addClickHandlers();
    }

    function getHTML(url, parseFunction){
        var request = new XMLHttpRequest({mozSystem: true});

        request.onload = parseFunction;

        request.open("GET", url);
        request.responseType = "document";
        request.send();
    }

    $(".icon-box").click(function() {
        cornerClick($(this));
    });

    readjustApplicationHeight();

    setInterval(readjustApplicationHeight, 1000);

    getHTML("https://news.ycombinator.com/", parseHomepage);

});

