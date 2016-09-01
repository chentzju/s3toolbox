/**
    S3 ToolBox 用来提供基础处理函数和控件的工具箱，包含了多种功能性控件
 */
"use strict";
var S3 = (function ($) {
    //工具箱依赖于jquery
    if ($ === null){
        throw new ReferenceError("This toolbox needs jquery,but not found.");
    }

    var S3 = function(){};
    S3.VERSION = "1.0";

    var autocompleteCSS = ".autocomplete-container{" +
        "            border:solid 1px black;" +
        "            width:180px;" +
        "            height:200px;" +
        "            overflow-y:auto;" +
        "        }" +
        "        .autocomplete-container ul{" +
        "            margin:0;" +
        "            padding:0;" +
        "        }" +
        "        .autocomplete-container li{" +
        "            display:block;" +
        "            height:30px;" +
        "            padding-top:10px;" +
        "            padding-left:10px;" +
        "            border-bottom:dashed 1px ;" +
        "        }" +
        "        .autocomplete-container li.active{" +
        "            background: #8bcbff;" +
        "        }";
    var menuCSS = "ul.menu-list {" +
        "    display: block;" +
        "    padding: 0;" +
        "    margin: 0;" +
        "    text-align: center;" +
        "}" +
        "ul.menu-list li {" +
        "    display: inherit;" +
        "    background: silver;" +
        "    cursor: pointer;" +
        "}" +
        "ul.menu-list .menu-title {" +
        "    background: #009697;" +
        "    height: 1.6rem;" +
        "    vertical-align: middle;" +
        "    padding: 5px;" +
        "    margin: 0;" +
        "}" +
        "" +
        "ul.menu-content {" +
        "    padding: 0;" +
        "}" +
        "ul.menu-content li {" +
        "    height: 1.5rem;" +
        "    background: #D1D1D1;" +
        "    border-bottom: solid 1px silver;" +
        "}";
    var pageCSS = " ul.pages {" +
        "display:block;" +
        "border:none;" +
        "text-transform:uppercase;" +
        "font-size:12px;" +
        "margin:10px 0 10px;" +
        "padding:0;" +
        "}" +
        " ul.pages li {" +
        "cursor:pointer;" +
        "list-style:none;" +
        "float:left;" +
        "border:1px solid #ccc;" +
        "text-decoration:none;" +
        "margin:0 5px 0 0;" +
        "padding:5px;" +
        "}" +
        " ul.pages li:hover {" +
        "cursor:pointer;" +
        "border:1px solid #003f7e;" +
        "}" +
        " ul.pages li.pgEmpty {" +
        "border:1px solid #eee;" +
        "color:#eee;" +
        "}" +
        " ul.pages li.pgCurrent {" +
        "cursor:pointer;" +
        "border:1px solid #003f7e;" +
        "color:#000;" +
        "font-weight:700;" +
        "background-color:#e8f0f8;" +
        "}";

    var validateCSS =  ".validate-field-error" +
        "    {" +
        "        border: 1px solid #ccc;" +
        "        border-color: #dd514c!important;" +
        "        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);" +
        "    }" +
        "    .validate-field-success{" +
        "        border: 1px solid #ccc;" +
        "        border-color: #5eb95e!important;" +
        "        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);" +
        "    }" +
        "    .validate-alert {" +
        "        background-color: #dd514c;" +
        "        border-color: #d83832;" +
        "        color: #fff;" +
        "        margin: 5px 0 5px;" +
        "        padding: .25em .625em;" +
        "        font-size: 14px;" +
        "    }";

    var CSS = autocompleteCSS + menuCSS + pageCSS + validateCSS;
    var id = "s3csssetting";
    var setCSS = function(){
        var style = document.createElement('style');
        style.id = id;
        style.type = "text/css";
        try{
            style.innerHTML = CSS;
        }catch(e){
            style.styleSheet.cssText = CSS;
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
        setCSS = null;
    };

    var cssOFF = function(){
        var css = document.getElementById(id);
        css.parentNode.removeChild(css);
        setCSS = null;
    };

    setCSS();
    
    S3.cssOff = cssOFF;
    return S3;
})(jQuery);