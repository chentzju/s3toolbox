/**
    S3 ToolBox 用来提供基础处理函数和控件的工具箱，包含了多种功能性控件
 */
"use strict";
var S3 = (function ($) {
    //工具箱依赖于jquery
    if ($ === null){
        throw new ReferenceError("This toolbox needs jquery,but not found.");
    }
    var ToolBox = function(){};

    return new ToolBox();
})(jQuery);