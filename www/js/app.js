
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Zepto provides nice js and DOM methods (very similar to jQuery,
    // and a lot smaller):
    // http://zeptojs.com/
    var $ = require('zepto');

    // Write your app here.

    //HTML escape function, via http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery

    var slideStateEnum = {
        LEFT : 0,
        CENTER : 1,
        RIGHT : 2
    }

    var currentUrl;

    var leftmostPane = slideStateEnum.CENTER;

    var escapeHTML = (function () {
        'use strict';
        var chr = {
            '"': '&quot;', '&': '&amp;', "'": '&#39;',
            '/': '&#47;',  '<': '&lt;',  '>': '&gt;'
        };
        return function (text) {
            return text.replace(/[\"&'\/<>]/g, function (a) { return chr[a]; });
        };
    }());

    //Get base rem value, via http://stackoverflow.com/questions/16089004/use-jquery-to-increase-width-of-container-by-10-rem
    var rem = function rem() {
         var html = document.getElementsByTagName('html')[0];

         return function () {
             return parseInt(window.getComputedStyle(html)['fontSize']);
         }
     }();


    function openArticleInBrowser(url){
        cornerClick(this);
        window.location = "#";
        openBrowser(url);
    }

    function openBrowser(url){
        var openURL = new MozActivity({
            name: "view",
            data: {
                type: "url", // Possibly text/html in future versions
                url: url
            }
        });
    }


    function readjustHeight(elem){
        $(elem).height(window.innerHeight-(rem() * 5));
    }

    function readjustApplicationHeight(){
        readjustHeight('.content');
        readjustHeight('#fulltext');
        readjustHeight('#frame');
    }

    function slideWindow(){
        if (leftmostPane == slideStateEnum.CENTER){
            $('.icon').removeClass("icon-close").addClass("icon-back");
            $('#center-slide').attr('id', 'left-slide');
            $('#right-slide').attr('id', 'center-slide');
            leftmostPane = slideStateEnum.LEFT;
        }
        else if (leftmostPane == slideStateEnum.LEFT){
            $('.icon').removeClass("icon-back").addClass("icon-close");
            $('#center-slide').attr('id', 'right-slide');
            $('#left-slide').attr('id', 'center-slide');
            leftmostPane = slideStateEnum.CENTER;
        }        
    }

    function articleClick(elem){
        $('#fulltext').empty();
        $('#fulltext').append('<iframe src="" id="frame" remote mozbrowser></iframe>');
        slideWindow();
        window.setTimeout(function(){
            readjustHeight('#frame');
            $('#header').text("Article");
            $('#openBrowser').show();
            currentUrl = elem.attr("data-url");
            $('#frame').attr("src", 'http://read.dathomp.com/?url=' + elem.attr("data-url") + '&apiKey=kt9DInLRPSRzMj8MtbbuoUGEIJOa0N1eG0JFrKlnuKkT2ntgZWAy7IoL0YiT');
        }, 500);
    }

    function commentClick(elem){
        $('#fulltext').empty();
        slideWindow();

        window.setTimeout(function(){
            $('#header').text("Comments");
            getHTML('https://news.ycombinator.com/' + elem.attr("data-url"), parseComments);
        }, 500);
    }

    function cornerClick(elem){
        if(leftmostPane == slideStateEnum.CENTER){
            close();
        } else {
            slideWindow();

            $('#openBrowser').hide();
            $('#header').text("Hacker News");
            window.setTimeout(function() {
                $('#fulltext').empty();
            }, 500);
        }
    }

    function createArticleBlock(article){
        var block = '<tr><td class="left" data-url="' + article.articleURL + 
                    '"><div class="title">' + article.title + 
                    '</div><br /><div class="subtitle">' + article.subText +
                    '</div></td><td class="right" data-url="' + article.commentsURL +
                    '"><p class="comment-number">' + article.comments + '</p></td></tr>';
        return block;
    }

    function createCommentBlock(comment){
        var indent = '';
        for (var i = 0; i < comment.indents; i++){
            indent = indent + '<div class="buffer"></div>';
        }

        var block = '<div class="comment">\
                        '+ indent + '\
                        <div class="comment-container">\
                            <div class="meta">' +
                                comment.meta +
                           '</div><div class="body">' +
                                comment.body +
                           '</div>\
                        </div>\
                     </div>';
        return block;
    }

    function displayArticles(articles){
        var block = "";
        for (var i = 0; i < articles.length; i++){
            block = block + createArticleBlock(articles[i]);
        }
        $("#articleTable").append(block);
    }

    function addClickHandlers(){
        $(".left").click(function() {
            articleClick($(this));
        });
        $(".right").click(function() {
            commentClick($(this));
        });
        $("#openBrowser").click(function(){
            openArticleInBrowser(currentUrl);
        });
    }

    function parseComment(rawComment){
        var comment = { body : "",
                       meta : "",
                       indents : 0};

        //Calculate indents by length of blank gif on page
        var blankGif = rawComment.getElementsByTagName("img")[0];

        comment.indents = parseInt(blankGif.getAttribute('width'))/40;

        var meta = escapeHTML(rawComment.getElementsByClassName("comhead")[0].textContent);
        var body = rawComment.getElementsByClassName("comment")[0].innerHTML;

        //re to remove reply at end of body. For some reason reply is randomly in the comment span
        var re = /<a\ href="(?!http).*">reply<\/a>/i;
        body = body.replace(re, "");

        //re to clean up code comments
        re = /<pre><code>|<\/pre><\/code>/gi;
        body = body.replace(re, "");

        comment.meta = meta;
        comment.body = body;

        return comment;
    }

    function parseComments(){
        var page = this.responseXML;
        var tables = page.getElementsByTagName("table");

        //3rd table is where the comments start. Let's hope HN doesn't change anytime soon
        var commentsTable = tables[3];

        var comments = commentsTable.getElementsByTagName("table");

        var parsedComments = new Array();
        var block = "";
        for (var i = 0; i < comments.length; i++){
            parsedComments.push(parseComment(comments[i]));
            block = block + createCommentBlock(parsedComments[i]);
        }
        $("#fulltext").append(block);
        //make comment links open in browser instead of destroying app
        var $commentLinks = $(".comment a");
        $commentLinks.each(function(index){
            $commentLinks.eq(index).click(function(e){
                e.preventDefault();
                openBrowser($commentLinks.eq(index).attr('href'));
            });
        });
    }

    function parseHomepage() {
        var articles = new Array();

        var page = this.responseXML;

        var titleClasses = page.getElementsByClassName('title');
        var rawSubText = page.getElementsByClassName('subtext');

        for (var i = 1; i < titleClasses.length; i = i + 2){
            articles.push({ title : escapeHTML(titleClasses[i].childNodes[0].textContent), 
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
                articles[i].comments = parseInt(rawSubText[i].childNodes[4].textContent);
                if (isNaN(articles[i].comments)) {
                    articles[i].comments = "None";
                }
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

    

    // add interval to readjust on orientation change
    // for some reason window.innerHeight does not change instantly
    // on the device while it does in the simulator. This hack
    // avoids the weird timing issue
    readjustApplicationHeight();
    window.screen.onmozorientationchange = (function () {
        setInterval(readjustApplicationHeight, 750);
    });

    getHTML("https://news.ycombinator.com/", parseHomepage);
});