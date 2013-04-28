
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

    function articleClick(elem){
        $('.icon').removeClass("icon-close").addClass("icon-back");
        window.location = "#slide";
    }

    function commentClick(elem){
        window.location = "#slide";
    }

    function cornerClick(elem){
        if($('.icon').hasClass("icon-close")){
            close();
        }

        $('.icon').removeClass("icon-back").addClass("icon-close");
    }

    readjustHeight('.content');
    readjustHeight('.fulltext');


    $(".left").click(function() {
        articleClick($(this));
    });
    $(".right").click(function() {
        commentClick($(this));
    });
    $(".icon").click(function() {
        cornerClick($(this));
    });
});

