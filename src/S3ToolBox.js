/*
    definition of S3ToolBox
 */
"use strict";
var S3ToolBox = (function ($) {

    if ($ == null) throw new ReferenceError("This toolbox needs jquery,but not found.");

    var MagicBox;
    MagicBox = function () {

    };

    MagicBox.prototype = {
        init: function () {
        }
    };

    MagicBox.conflict = function (name) {
        return MagicBox[name] === null;
    };
    return MagicBox;
})(jQuery);
/*
 *   event binder
*   
* */
+function(S3){
    
    var eventTriggers = {
        
    };
    
    var EventBinder = function(){

    };

    
    //add your tool to S3ToolBox
    //S3.YourTool = YourTool;
}(S3ToolBox);
/*
    definition of Number Calculator
 */
+function(S3){
    var Calculator = function (){

    };

    Calculator.prototype = {

    };

    S3.Calculator = Calculator;
}(S3ToolBox);

/*
    definition of other tools
 */
+function(S3){

    // your own tool definition


    //add your tool to S3ToolBox
    //S3.YourTool = YourTool;
}(S3ToolBox);
