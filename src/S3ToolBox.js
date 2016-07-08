/*
    definition of S3ToolBox
 */
"use strict";
var S3 = (function ($) {
    if ($ === null){
        throw new ReferenceError("This toolbox needs jquery,but not found.");
    }

    var ToolBox = function(){};

    return ToolBox;
})(jQuery);



/*  .Utils.*/
+function(toolBox){

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    // IE < 9 is always the problem
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
        var constructor = obj.constructor;
        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    }

    /**
     * 一些通用的方法
     * @type {{isArray: (*|Function), isNumber: Utils.isNumber, isObject: Utils.isObject, isNull: Utils.isNull, isUndefined: Utils.isUndefined, has: Utils.has, keys: Utils.keys}}
     */
    var Utils = {

        isArray : Array.isArray || function(obj) {
            return toString.call(obj) === '[object Array]';
        },

        isNumber : function(obj){
            return typeof obj === 'number';
        },

        isObject : function(obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },

        // Is a given value equal to null?
        isNull : function(obj) {
            return obj === null;
        },

         // Is a given variable undefined?
        isUndefined : function(obj) {
            return obj === void 0;
        },

        has : function(obj, key) {
            return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
        },

        keys : function(obj) {
            if (!Utils.isObject(obj)) return [];
            if (Object.keys) return Object.keys(obj);
            var keys = [];
            for (var key in obj) if (Utils.has(obj, key)) keys.push(key);
            // Ahem, IE < 9.
            if (hasEnumBug) collectNonEnumProps(obj, keys);
            return keys;
        },

        values : function(obj) {
            var keys = Utils.keys(obj);
            var length = keys.length;
            var values = Array(length);
            for (var i = 0; i < length; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        },

        clone : function(obj) {
             if (!Utils.isObject(obj)) return obj;
             return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        }
    };

    //
    toolBox.Utils = Utils;
}(S3);

/**
 *
 */
+function(toolBox){
    var str = '<div class = "preloader">loading</div>';

    var totalheight=0;
    var callback = null;


    var ScrollLoad = function(element,options){

    };

    function loadData(){
        totalheight=parseFloat($(window).height())+parseFloat($(window).scrollTop());
        if($(document).height()<=totalheight){

        }
    }

    ScrollLoad.setCallBack = function(callback){
        callback = callback;
    };

    ScrollLoad.activeScrollLoad = function(){
        if(typeof callback != '[object function]') {
            throw ('You even not set a callback function!')
            return;
        }
        $(window).scroll(function(){
            loadData();
        });
    };

    ScrollLoad.removeScrollLoad = function(){
        $(window).unbind('scroll');
    }
    toolBox.ScrollLoad = ScrollLoad;
}(S3);

/*
    Number Calculator
 */
+function(toolBox){

    var Cal=(function(){

        /**
         * 保证精确性的数值乘法
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var multiply = function (n1,n2){
            var m = 0,
                s1 = n1.toString(),
                s2 = n2.toString(),
                t = s1.split(".");
            //判断小数点
            if(t[1]){m += t[1].length;}
            t = s2.split(".");
            if(t[1]){ m += t[1].length;}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
        };
        /**
         * 确保精度的数值加法
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var add = function (n1,n2) {
            var m1=0,m2 = 0,
                t = n1.toString().split(".");
            if(t[1]){m1 = t[1].length;}
            t = n2.toString().split(".");
            if(t[1]){m2 = t[1].length;}
            var m=Math.pow(10,Math.max(m1,m2));
            return (Number(n1)*m+Number(n2)*m)/m;
        };
        /**
         * 确保精度的数值减法
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var sub = function (n1,n2)
        {
            var m1=0,m2 = 0,
                t = n1.toString().split(".");
            if(t[1]){m1 = t[1].length;}
            t = n2.toString().split(".");
            if(t[1]){m2 = t[1].length;}
            var m=Math.pow(10,Math.max(m1,m2));
            return Number(((Number(n1)*m-Number(n2)*m)/m).toFixed(Math.max(m1,m2)));
        };

        /**
         * 相对精确的数值除法
         *
         * @param n1
         * @param n2
         * @returns {Number}
         */
         var division = function(n1,n2){
            var m,m1=0,m2=0,t;
            var s1=n1.toString();
            var s2=n2.toString();
            t=s1.split(".");
            if(t[1]){
                m1+=t[1].length;
            }
            t=s2.split(".");
            if(t[1]){
                m2+=t[1].length;
            }
            m = Math.pow(10,m1-m2);
            return Number((Number(s1.replace(".",""))/Number(s2.replace(".",""))*m).toFixed(2));
        };

        /**
         * 数组乘数组 11对应相乘
         * @param arr1
         * @param arr2
         * @returns {Array}
         */
        var mulArr = function (arr1,arr2){
            var newArr=[];
            if (arr1.length===arr2.length) {
                for(var i=0;i<arr1.length;i++){
                    newArr[i]=arr1[i]*arr2[i];
                }
                return newArr;
            }else{
                throw new Error("传入数组长度必须相同");
            }
        };

        //数组加数组
        var addArr = function (arr1,arr2){
            var newArr=[];
            if (arr1.length===arr2.length) {
                for(var i=0;i<arr1.length;i++){
                    newArr[i]=arr1[i]+arr2[i];
                }
                return newArr;
            }else{
                throw new Error("传入数组长度必须相同");
            }
        };


        //数组减数组
        var subArr = function (arr1,arr2){
            var newArr=[];
            if (a.length===b.length) {
                for(var i=0;i<arr1.length;i++){
                        newArr[i]=arr1[i]-arr2[i];
                }
                return newArr;
            }else{
                throw new Error("传入数组长度必须相同");
            }
        };

        /**
         * 数组乘以一个公共数
         * @param arr1
         * @param num
         * @returns {Array}
         */
        var arrMulNum = function (arr1,num){
            return arr1.map(function(x){
                return x*num
            });
        };

        /**
         * 数组减去一个公共数
         * @param arr1
         * @param num
         * @returns {*|Array}
         */
        var arrSubNum = function (arr1,num){
            return arr1.map(function(x){
                return x - num;
            })
        };

        /**
         * 数组加上一个公共数
         * @param arr1
         * @param num
         * @returns {*|Array}
         */
        var arrAddNum = function(arr1,num){
            return arr1.map(function(x){
                return x + num;
            })
        };

        /**
         * 数字格式化为金额表达式
         * @param value
         * @returns {*}
         */
        var addComma = function (value){
            value = value.toString();
            var hasMinus = false;
            var commaLen = 3;//千分位长度
            //判断是否为负数
            if(value.indexOf('-')!= -1){
                value = value.replace(/[-]/g,'');
                hasMinus = true;
            }
            if(value.length > commaLen){
                var mod = value.length % commaLen;
                var output = (mod>0?(value.substring(0,mod)):'');//12,000.09 = 12
                for(var i =0;i < Math.floor(value.length / commaLen); i++){
                    if((mod == 0) && (i == 0)){
                        output += value.substring(mod + commaLen * i ,mod + commaLen * (i+1));
                    }else{
                        output +=  ',' + value.substring(mod + commaLen * i, mod + commaLen * (i+1))
                    }
                }
                if(hasMinus){
                    return ('-' + output);
                }else{
                    return output;
                }
            }else{
                if(hasMinus){
                    return ('-'+value);
                }else{
                    return value;
                }
            }
        };

        /**
         * 移除逗号分隔符
         * @param value
         * @returns {*|string|{example, overwrite, disable_template_processing}|void|XML}
         */
        var removeComma = function (value){
            return value === undefined ? value:value.replace(/\,/g,'');
        };

        return {
            //四则运算
            add: add,
            sub: sub,
            mul: multiply,
            div: division,

            //金额问题
            addComma: addComma,
            removeComma: removeComma,

            //数组运算
            arrMul: mulArr,
            arrAdd: addArr,
            arrSub: subArr,

            arrAddNum: arrAddNum,
            arrSubNum: arrSubNum,
            arrMulNum: arrMulNum
        };

    })();

    toolBox.Cal = Cal;
}(S3);