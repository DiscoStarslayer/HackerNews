
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

    function readjustHeight(elem){
        $(elem).height($(window).height()-50);
    }

    function sharedClick(){
        $('.icon').removeClass("icon-close").addClass("icon-back");
        window.location = "#slide";
    }

    function articleClick(elem){
        sharedClick();
    }

    function commentClick(elem){
        sharedClick();
    }

    function cornerClick(elem){
        if($('.icon').hasClass("icon-close")){
            close();
        }

        $('.icon').removeClass("icon-back").addClass("icon-close");
    }

    function createArticleBlock(title, subText, comments){
        var block = '<tr><td class="left"><p><span class="title">' + title + 
                    '</span><br /><span class="subtitle">' + subText +
                    '</span></p></td><td class="right"><p class="rightSide">' + comments + 
                    '</p></td></tr>';
        $("#articleTable").after(block);
    }

    function displayArticles(titles, subText, comments){
        //decrement so articles appear in proper order
        for (var i = titles.length-1; i >= 0; i--){
            createArticleBlock(titles[i], subText[i], comments[i]);
        }
    }

    function addClickHandlers(){
        $(".left").click(function() {
            articleClick($(this));
        });
        $(".right").click(function() {
            commentClick($(this));
        });
    }

    function parseHomepage() {
        var page = this.responseXML;

        var titleClasses = page.getElementsByClassName('title');
        var rawSubText = page.getElementsByClassName('subtext');

        var titles = new Array();

        for (var i = 1; i < titleClasses.length; i = i + 2){
            titles.push(titleClasses[i].childNodes[0].textContent);
        }

        var subText = new Array();
        var comments = new Array();

        for (var i = 0; i < rawSubText.length; i++){
            var rawText = rawSubText[i].textContent;

            //assuming user cannot have | in name
            var splitText = rawText.split("|");

            subText.push(splitText[0]);
            comments.push(splitText[1]);
        }

        displayArticles(titles, subText, comments);
        addClickHandlers();
    }

    function getHTML(url, parseFunction){
        var request = new XMLHttpRequest({mozSystem: true});

        request.onload = parseFunction;

        request.open("GET", url);
        request.responseType = "document";
        request.send();
    }

    readjustHeight('.content');
    readjustHeight('.fulltext');

    $(".icon-box").click(function() {
        cornerClick($(this));
    });

    getHTML("https://news.ycombinator.com/", parseHomepage);
});

