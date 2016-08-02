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

/**
 * Utils 通用功能
 *
 */
+function(toolBox){

    /**
     * 一些通用的方法
     * @type {{isArray: (*|Function), isNumber: Utils.isNumber, isObject: Utils.isObject, isNull: Utils.isNull, isUndefined: Utils.isUndefined, has: Utils.has, keys: Utils.keys}}
     */
    var Utils;

    /**
     *兼容浏览器把-替换为/
     *@param val
     **/
    function delimiterConvert(val){
        return val.replace(/-/g,'/');
    }

    Utils = {

        /**
         * 判断是否数组
         */
        isArray: Array.isArray || function (obj) {
            return toString.call(obj) === '[object Array]';
        },

        /**
         * 判断是否数字
         * @param obj
         * @returns {boolean}
         */
        isNumber: function (obj) {
            return typeof obj === 'number';
        },

        /**
         * 判断是否对象
         * @param obj
         * @returns {boolean}
         */
        isObject: function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },
        /**
         *判断是否是纯对象
         * @param obj
         * @return {boolean}
         */
        isPlainObject: function (obj) {
            var proto, ctor, o = {};
            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }
            proto = Object.getPrototypeOf(obj);

            if (!proto) {
                return true;
            }


            var hasOwn = o.hasOwnProperty;
            var fn2String = hasOwn.toString;

            ctor = o.hasOwnProperty.call(proto, "constructor") && proto.constructor;
            return typeof ctor === "function" && fn2String.call(ctor) === fn2String.call(Object)
        },

        // Is a given value equal to null?
        isNull: function (obj) {
            return obj === null;
        },

        // Is a given variable undefined?
        isUndefined: function (obj) {
            return obj === void 0;
        },

        /**
         * 判断某对象是否含有某属性
         * @param obj
         * @param key
         * @returns {boolean}
         */
        has: function (obj, key) {
            return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
        },

        /**
         * 返回对象的属性数组
         * @param obj
         * @returns {Array}
         */
        keys: function (obj) {
            if (!Utils.isObject(obj)) return [];
            if (Object.keys) return Object.keys(obj);
            var keys = [];
            for (var key in obj) {
                if (Utils.has(obj, key)) keys.push(key);
            }
            // Ahem, IE < 9. no key in obj
            //TODO
            return keys;
        },

        /**
         * 返回对象的值数组
         * @param obj
         * @returns {*}
         */
        values: function (obj) {
            var keys = Utils.keys(obj);
            var length = keys.length;
            var values = Array(length);
            for (var i = 0; i < length; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        },

        /**
         * 克隆一个对象
         * @param obj
         * @returns {*}
         */
        clone: function (obj) {
            if (!Utils.isObject(obj)) return obj;
            return Utils.isArray(obj) ? obj.slice() : Utils.extend({}, obj);
        },

        /**
         * 扩展一个对象
         * @param obj
         */
        extend: function (obj) {

        },

        /**
         * 日期比较
         * @param date1
         * @param date2
         * @returns {boolean}
         */
        dateCompare: function (date1, date2) {
            var date1 = new Date(delimiterConvert(date1)).getTime();
            var date2 = new Date(delimiterConvert(date2)).getTime();
            if (date1 < date2) {
                return true;
            } else {
                return false;
            }
        }
    };

    toolBox.utils = Utils;
}(S3);

/**
 * Forms Manager管理表单的读写
 */
+function (toolBox) {

    var Forms = function () {

    };
    Forms.prototype={

        /**
         * 清理form
         * @param form
         */
        clearForm: function (form){
            form.reset();
        },

        /**
         * 将form表单中的数据封装成JSON对象。
         * @param form
         * @return {}
         */
        form2json:function(form){
            var obj = {};
            var a = $(form).serializeArray();
            $.each(a,function(){
                if(obj[this.name]!==undefined){
                    if(!obj[this.name].push){
                        obj[this.name] = [obj[this.name]];
                    }
                    obj[this.name].push(this.value||'');
                }else{
                    obj[this.name]=this.value||'';
                }
            });
            return obj;
        },


        /**
         * 将json数据填入form中。
         * @param form,jsonObj,pre
         */
        json2form:function(form,jsonObj,pre){
        var key,value,name,pre,eles,match;

        pre = pre || '';

        //遍历对象
        for(key in jsonObj){
            name = pre + key;
            value = jsonObj[key];

            //如果还是对象，那就要递归  基本用不到
            if(toolBox.utils.isPlainObject(value)){
                json2form(form,value,key+'.');
            }else{
                //查找form中 名字与name匹配的元素
                eles = [];
                match = form.elements;
                for(var i = 0 ;i<match.length;i++){
                    if(match[i].getAttribute('name') === name){
                        eles.push(match[i]);
                    }
                }
                //返回的匹配都是数组，直接计算即可
                eles.forEach(function(elex){
                    //select
                    if(elex.tagName.toLowerCase() === "select") {
                        if(elex.type === "select-multiple"){
                            for(var i = 0;i<elex.options.length;i++){
                                value.forEach(function (x) {
                                    if(elex.options[i].value === x)
                                        elex.options[i].selected = true;
                                });
                            }
                        }else{
                            for (var i = 0; i < elex.options.length; i++) {
                                if (elex.options[i].value === value) {
                                    elex.selectedIndex = i;
                                }
                            }
                        }
                    }
                    //checkbox
                    else if(elex.type === "checkbox"){
                        elex.checked = (elex.value === value || value.some(function(x){ return elex.value === x})) ? true:false;
                    }
                    // radio
                    else if(elex.type === "radio") {
                        elex.checked = elex.value === value ? true :false;
                    }else{
                        elex.value = value;
                    }
                });
            }
        }
    }
    };

    toolBox.form = new Forms();
}(S3);

/**
 * Event Manager 事件管理器
 */
+function(toolBox){

}(S3);

/**
    Number Calculator 数据/金额计算器
 */
+function(toolBox){

    var Cal;
    Cal = (function () {

        /**
         * 保证精确性的数值乘法
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var multiply = function (n1, n2) {
            var m = 0,
                s1 = n1.toString(),
                s2 = n2.toString(),
                t = s1.split(".");
            //判断小数点
            if (t[1]) {
                m += t[1].length;
            }
            t = s2.split(".");
            if (t[1]) {
                m += t[1].length;
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        };
        /**
         * 确保精度的数值加法
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var add = function (n1, n2) {
            var m1 = 0, m2 = 0,
                t = n1.toString().split(".");
            if (t[1]) {
                m1 = t[1].length;
            }
            t = n2.toString().split(".");
            if (t[1]) {
                m2 = t[1].length;
            }
            var m = Math.pow(10, Math.max(m1, m2));
            return (Number(n1) * m + Number(n2) * m) / m;
        };
        /**
         * 确保精度的数值减法
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var sub = function (n1, n2) {
            var m1 = 0, m2 = 0,
                t = n1.toString().split(".");
            if (t[1]) {
                m1 = t[1].length;
            }
            t = n2.toString().split(".");
            if (t[1]) {
                m2 = t[1].length;
            }
            var m = Math.pow(10, Math.max(m1, m2));
            return Number(((Number(n1) * m - Number(n2) * m) / m).toFixed(Math.max(m1, m2)));
        };

        /**
         * 相对精确的数值除法
         *
         * @param n1
         * @param n2
         * @returns {Number}
         */
        var division = function (n1, n2) {
            var m, m1 = 0, m2 = 0, t;
            var s1 = n1.toString();
            var s2 = n2.toString();
            t = s1.split(".");
            if (t[1]) {
                m1 += t[1].length;
            }
            t = s2.split(".");
            if (t[1]) {
                m2 += t[1].length;
            }
            m = Math.pow(10, m1 - m2);
            return Number((Number(s1.replace(".", "")) / Number(s2.replace(".", "")) * m).toFixed(2));
        };

        /**
         * 数组乘数组 11对应相乘
         * @param arr1
         * @param arr2
         * @returns {Array}
         */
        var mulArr = function (arr1, arr2) {
            var newArr = [];
            if (arr1.length === arr2.length) {
                for (var i = 0; i < arr1.length; i++) {
                    newArr[i] = arr1[i] * arr2[i];
                }
                return newArr;
            } else {
                throw new Error("传入数组长度必须相同");
            }
        };

        /**
         * 数组加上数组
         * @param arr1
         * @param arr2
         * @returns {Array}
         */
        var addArr = function (arr1, arr2) {
            var newArr = [];
            if (arr1.length === arr2.length) {
                for (var i = 0; i < arr1.length; i++) {
                    newArr[i] = arr1[i] + arr2[i];
                }
                return newArr;
            } else {
                throw new Error("传入数组长度必须相同");
            }
        };


        /**
         * 数组减去数组
         * @param arr1
         * @param arr2
         * @returns {Array}
         */
        var subArr = function (arr1, arr2) {
            var newArr = [];
            if (a.length === b.length) {
                for (var i = 0; i < arr1.length; i++) {
                    newArr[i] = arr1[i] - arr2[i];
                }
                return newArr;
            } else {
                throw new Error("传入数组长度必须相同");
            }
        };

        /**
         * 数组乘以一个公共数
         * @param arr1
         * @param num
         * @returns {Array}
         */
        var arrMulNum = function (arr1, num) {
            return arr1.map(function (x) {
                return x * num
            });
        };

        /**
         * 数组减去一个公共数
         * @param arr1
         * @param num
         * @returns {*|Array}
         */
        var arrSubNum = function (arr1, num) {
            return arr1.map(function (x) {
                return x - num;
            })
        };

        /**
         * 数组加上一个公共数
         * @param arr1
         * @param num
         * @returns {*|Array}
         */
        var arrAddNum = function (arr1, num) {
            return arr1.map(function (x) {
                return x + num;
            })
        };

        /**
         * 数字格式化为金额表达式
         * @param value
         * @returns {*}
         */
        var addComma = function (value) {
            value = value.toString();
            var hasMinus = false;
            var commaLen = 3;//千分位长度
            //判断是否为负数
            if (value.indexOf('-') != -1) {
                value = value.replace(/[-]/g, '');
                hasMinus = true;
            }
            if (value.length > commaLen) {
                var mod = value.length % commaLen;
                var output = (mod > 0 ? (value.substring(0, mod)) : '');//12,000.09 = 12
                for (var i = 0; i < Math.floor(value.length / commaLen); i++) {
                    if ((mod == 0) && (i == 0)) {
                        output += value.substring(mod + commaLen * i, mod + commaLen * (i + 1));
                    } else {
                        output += ',' + value.substring(mod + commaLen * i, mod + commaLen * (i + 1))
                    }
                }
                if (hasMinus) {
                    return ('-' + output);
                } else {
                    return output;
                }
            } else {
                if (hasMinus) {
                    return ('-' + value);
                } else {
                    return value;
                }
            }
        };

        /**
         * 移除逗号分隔符
         * @param value
         * @returns {*|string|{example, overwrite, disable_template_processing}|void|XML}
         */
        var removeComma = function (value) {
            return value === undefined ? value : value.replace(/,/g, '');
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

    toolBox.cal = Cal;
}(S3);

/**
 * 按钮防重复提交功能
 */
+function(tooBox){
    var btn = {};

    /**
     *  防止重复提交，锁定按钮（支持A和button）
     * param: obj[Object]-需要锁定的jQuery对象，必输
     * 		  disabled[boolen]-是否灰显，若不灰显则提示重复提交，true-灰显不提示，false-提示不灰显,默认false
     *		  fn[Object]-需要bind的提交事件的函数 (若是用bind绑定函数click事件，必输 )
     * return:
     */
    btn.lock= function(obj,disabled,fn){
        //var obj = $("#"+id);
        var reSubmit = function(){
            alert('请不要重复提交！');
        };

        if(fn){
            obj.unbind("click");
            //保存click事件吗，以便后续解锁重新绑定
            if(typeof fn == "function"){
                obj.attr("lockBindFn",fn.name);
            }
        }else{
            fn = obj.attr("onclick");
            if(fn){
                obj.attr("onclick","");
                //保存click事件吗，以便后续解锁重新绑定
                obj.attr("lockClickFn",fn);
            }else if(obj.is("a")){
                //不存在click事件，判定为用href实现的a标签
                fn = obj.attr("href");
                obj.attr("href","javascript:;");
                obj.attr("lockHrefFn",fn);
            }
        }

        if(disabled){
            if(obj.is("button") || obj.is("input")){
                obj.attr("disabled",true);
            }else if(obj.is("a")){
                obj.addClass("gray");
            }
            obj.attr("lockDisabled",disabled);
        }else{
            obj.bind("click",reSubmit);
        }
    };
    /**
     * 防止重复提交，解除锁定按钮（支持A和button）
     * param: obj[Object]-需要解除锁定的jQuery对象，必输
     * 		  fn[Object]-需要bind的提交事件的函数， 若是用bind绑定函数click事件，必输
     * return:
     */
    btn.unlock = function(obj,fn){
        //var obj = $("#"+id);

        var disabled= obj.attr("lockDisabled");
        if(disabled){
            if(obj.is("button") || obj.is("input")){
                obj.attr("disabled",false);
            }else if(obj.is("a")){
                obj.removeClass("gray");
            }
        }else{
            //解除绑定的重复提交提示
            obj.unbind("click");
        }

        //是否是bind事件，若是，重新bind
        if(obj.attr("lockBindFn")){
            if(typeof fn == "function"){
                obj.bind("click",fn);
            }
            return;
        }

        //是否是onclick事件，若是，重新添加onclick
        fn = obj.attr("lockClickFn");
        if(fn){
            obj.attr("onclick",fn);
            return;
        }

        //是否是href事件，若是，重新添加href
        fn = obj.attr("lockHrefFn");
        if(fn){
            obj.attr("href",fn);
        }
    };
    tooBox.btn = btn;
}(S3);

/**
 * template manager 模板引擎
 */
+function(toolBox){

    // 用<% 和 %>做标签
    var templateSettings = {
        evaluate : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape : /<%-([\s\S]+?)%>/g
    };

    //不匹配.号，与templateSetting关联
    var noMatch = /(.)^/;

    //忽略
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function(match) {
        return '\\' + escapes[match];
    };

    //跳过的字符
    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + toolBox.utils.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };

    /**
     * 编译返回一个编译完成的模板，对于复用的模板，应该使用这种方式调用
     * @param text
     * @param settings
     * @returns {template}
     */
    var template = function(text, settings) {
        //设定，通常不会更改
        var settings = settings || templateSettings;

        // 合并三种情况的正则表达式匹配设定
        var matcher = RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        // 编译源文件
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':createEscaper(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        try {
            var render = new Function(settings.variable || 'obj', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function(data) {
            return render.call(this, data);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    /**
     * 直接输入模板和参数，返回html的
     * @param tpl
     * @param data
     */
    var templateHtml = function(tpl,data){
        var compiled = template(tpl);
        return compiled(data);
    };


    //把需要编译的模板赋值给compile
    toolBox.compile = template;

    //把完整编译的模板赋值给template
    toolBox.template = templateHtml;
}(S3);