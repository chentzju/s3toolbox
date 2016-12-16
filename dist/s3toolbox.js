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
    var VERSION = "1.0";

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
    var menuCSS = "   ul.menu-list-level0{" +
        "        display: block;" +
        "        padding: 0;" +
        "        margin: 0;" +
        "        text-align: center;" +
        "        border:solid #b7bcc0 1px;" +
        "    }" +
        "    ul.menu-list-level1{" +
        "        padding: 0;" +
        "        margin: 0;" +
        "        cursor:pointer;" +
        "    }" +
        "    div.menu-title-level0{" +
        "        background-color: #2EC1E2;" +
        "        padding:10px;" +
        "        text-align:center;"    +
        "    }" +
        "    div.menu-title-level1{" +
        "        background-color: #79DEEE;" +
        "        padding:10px;" +
        "        cursor:pointer;" +
        "    }" +
        "    li.menu-content-level1{" +
        "        padding:8px;" +
        "        cursor:pointer;" +
        "    }" +
        "    li.menu-content-level1:hover{" +
        "        background: #dadada;"+
        " }";
    var pageCSS = "ul.pages{  display:block;  border:none;  text-transform:uppercase;  font-size:12px;  margin:10px 0 10px;  padding:0;  }"+
            " ul.pages li{ ursor:pointer; list-style:none; float:left; border:1px solid #ccc; text-decoration:none; margin:0 5px 0 0; padding:5px;  }"+
            "  ul.pages li:hover{  cursor:pointer;  border:1px solid #003f7e;  }"+
            "ul.pages li.pgEmpty{  border:1px solid #eee;  color:#eee;  }"+
            "ul.pages li.pgCurrent{  cursor:pointer;  border:1px solid #003f7e;  color:#000;  font-weight:700;  background-color:#e8f0f8;  }";

    var validateCSS = " .validate-field-error{border: 1px solid #ccc;border-color: #dd514c!important;box-shadow: inset 0 1px 1px rgba(0,0,0,.075);} "+
        " .validate-field-success{border: 1px solid #ccc;border-color: #5eb95e!important;  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);}"+
        " .validate-alert{background-color: #dd514c;border-color: #d83832;color: #fff;margin: 5px 0 5px;padding: .25em .625em;  font-size: 14px;  }";

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
    S3.version = function(){return Version;};
    return S3;
})(jQuery);
/**
 * ajax.js 实现ajax调用，综合原coresupport.js和core.js
 * Created by zjfh-chent on 2016/8/4.
 */
+function(toolBox){

    /**
     * ajax方法，通用
     * @param url
     * @param paramStr
     * @param callback
     * @param async
     * @param method
     */
    var ajax = function(url,paramStr,callback,async,method){
        if(paramStr == null)
            paramStr = "";
        if(async == null)
            async = true;      //异步优先
        if(method == null)
            method = "POST";  //安全优先
        if(paramStr.indexOf('__port=') < 0){
            paramStr += "&__port=" + location.port;
        }
        try {
            if(async){
                $.ajax({
                    type: method,
                    url: url,
                    async: async,
                    contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                    data:paramStr,
                    cache:false,
                    dataType: "html",
                    success: function(data){
                        toolBox.utils.isFunction(callback) &&  callback(JSON.parse(data));
                    },
                    timeout:3000
                });
            }
        }catch(e){
            throw new Error(e);
        }
    };

    //为S3开发的代码
    var dataSetIdList = "__ids";
    var dataSetParams = "__params";
    var dataSetAppId = "__appId";
    var custId,rootPath;

    function testConfig(){
        if(!toolBox.utils.isUndefined(S3Config)){
            custId = S3Config.getConfig("s3_custId");
            rootPath = S3Config.getConfig("s3_root");
            return true;
        }else{
            return false;
        }
    }
    /**
     * 应该跳转到某个静态errorinfo页面，
     * 如果没有定义处理系统错误的代码，则弹出报错
     * @param e
     */
    var localOnError = function (e){
        alert(e);
    };

    /**
     * 内部函数，处理参数
     * @param params
     * @returns {*}
     */
    var treatParams = function(params){
        var paramMap = {};
        if(params == null)
            return paramMap;
        if(typeof(params) == "string"){
            var pary = params.split('&');
            for(var i = 0; i < pary.length; i++){
                if(pary[i] == null || pary[i] == '')
                    continue;
                var tary = pary[i].split('=');
                var key = tary[0].trim();
                var val = tary[1];

                if(key.length == 0)
                    continue;
                paramMap[key] = val;
            }
        }else if(typeof(params) == "object"){
            paramMap = params;
        }
        return paramMap;
    };

    /**
     * execjava，与S3的execjava类似  需要S3config支持
     * @param id            后台路由
     * @param param         参数
     * @param appId         应用编号
     * @param callback      回调函数
     * @param onError   错误处理
     * @param async   异步标识
     * @param httpMethod    调用方式
     * @param uri           调用路径
     */
    var execjava = function(id,param,appId,callback,onError,async,httpMethod,uri){
        //查询是否有S3的定义
        if(!testConfig()){
            throw new Error("No S3Config detected!! Please make sure S3Config.php is properly included.");
            return;
        }
        //如果没有custId和rootPath 无法进行了
        if(custId == null || rootPath == null)
            return;
        //id必输
        if(!id)
            return;
        //如果是S3，那没问题
        if(!appId)
            appId = custId;
        //默认POST
        if(!httpMethod)
            httpMethod = 'POST';
        //默认异步调用
        if(!async)
            async = true;
        //如果没有地址，默认是S3指定
        if(!uri)
            uri = rootPath + '~main/ajax.php';
        //如果没有指定系统错误处理函数,则使用默认函数
        if(!onError)
            onError = localOnError;
        //处理参数
        var paramObj =treatParams(param);
        var paramStr = dataSetIdList + '=' + encodeURIComponent(id) + '&' + dataSetParams + '=' + encodeURIComponent(JSON.stringify(paramObj)) + '&'+dataSetAppId+'=' + encodeURIComponent(appId);

        //o了，可以进行ajax调用了
        try{
            ajax(uri, paramStr, callback, async, httpMethod);
        }catch(e){
            onError(e);
        }
    };
    toolBox.ajax = ajax;
    toolBox.execjava = execjava;
}(S3);
/**
 * Created by zjfh-chent on 2016/8/11.
 */

+function(toolbox){


    var KEY = {
        UP: 38,
        DOWN: 40,
        RETURN: 13,
        ESC: 27,
        BACKSPACE: 8

    };

    /**
     * 单独一份拷贝 SELECTOR控件 返回一个SELECTOR对象实例，用来处理autoComplete的选择功能，
     * 每次调用autocomplete都会生成一个SELECTOR实例，所以autocomplete可以各自使用互不影响
     * @param inputElement
     * @param options
     * @returns {*}
     * @constructor
     */
    var Selector = function(inputElement,options){
        return new Selector.prototype.init(inputElement,options);
    };

    Selector.prototype = {
        /**
         * 初始化，通过构造函数调用，外部不可调用
         * @param inputElement
         * @param options
         * @returns {Selector}
         */
        init : function (inputElement,options){
            var that = this;
            var container = toolbox.element('div',
                    {
                        'class': options['class'] ? options['class']: 'autocomplete-container',
                        'style': 'display:none;position:absolute;z-index:999;left:'+options.left+'px;top:'+options.top+'px;'
                    }, []).render();
            if (options.width)
                    container.style.cssText += (';width:' + options.width+'px');
            document.body.appendChild(container);
            this.container = container;
            //绑定事件
            var em = toolbox.event;
            em.addHandler(container,'mouseover',function(event){
                var evt = em.getEvent(event);
                var target = em.getTarget(evt);
                if(!target.getAttribute('class')){
                    var list = container.getElementsByTagName('li');
                    $(container).find('.active').removeClass('active');
                    for(var i=0;i<list.length;i++){
                        if(list[i] === target){
                            that.active = i;
                            target.setAttribute('class','active');
                        }
                    }
                }
            });

            em.addHandler(container,'click',function(event){
                var evt = em.getEvent(event);
                var target = em.getTarget(evt);
                container.style.display = "none";
                if(target.tagName.toLowerCase() === 'li'){
                    inputElement.value = target.innerHTML;
                    inputElement.focus();
                }
            });
            return this;
        },
        /**
         * 隐藏属性
         * @returns {Selector}
         */
        hide:function(){
            this.container.style.display = 'none;';
            return this;
        },
        /**
         * 显示属性
         * @returns {Selector}
         */
        show:function(){
            this.container.style.display = "block";
            return this;
        },
        /**
         * 设置数据属性，接受一个数组，里面是需要展现的内容
         * @param data 这个数据是通过callback返回的，所以callback必须返回一个数组
         * @returns {Selector}
         */
        setData:function(data){
           var el = toolbox.element;
                var ul,list=[];
                data.forEach(function(item){
                    list.push(el('li',{},[item]))
                });
                ul = el('ul',{},list).render();
                ul.childNodes[0].setAttribute('class','active');
                this.container.innerHTML = "";
                this.container.appendChild(ul);
                this.active = 0;
                this.list = ul;
            return this;
        },
        /**
         * 移动选中的内容
         * @param step
         * @returns {Selector}
         */
        moveSelect:function (step) {
            var active = this.active;
            var ul = this.list;
            var list = ul.getElementsByTagName('li');
            list[active].setAttribute('class','');
            active = movePosition(active,step,list.length);
            list[active].setAttribute('class','active');
            this.active = active;

            //处理选项滚动
            var offset = 0;
            var container = this.container;
            for(var i=0;i<active;i++){
                    offset += list[i].offsetHeight;
            }
            if((offset + list[active].offsetHeight - container.scrollTop) > container.offsetHeight) {
                container.scrollTop = offset + list[active].offsetHeight - container.offsetHeight;
            } else if(offset < container.scrollTop) {
                container.scrollTop = offset;
            }
            return this;
        }
    };
    //函数，用来计算当前激活的点
    function movePosition(active,step,length) {
        active += step;
        if (active < 0) {
            active = length - 1;
        } else if (active >= length) {
            active = 0;
        }
        return active;
    }
    Selector.prototype.init.prototype = Selector.prototype;

    /**
     * autocomplete函数，实现某个输入框的自动补全，只要设置相应的参数即可
     * @param inputElement     需要实现自动补全的input元素
     * @param callback      回调函数，必须返回一个数组
     * @param options
     * @returns {boolean}
     */
    var autoComplete = function(inputElement,callback,options){
        if(!inputElement || typeof callback != 'function')
            return false;

        //取到需要绑定的元素
        inputElement = (typeof inputElement == 'string')?document.getElementById(inputElement) : inputElement;
        if(!inputElement.tagName || !(inputElement.tagName.toLowerCase() === 'input'))
                return false;

        //开始处理
        var left = inputElement.offsetLeft;
        var top = inputElement.offsetTop + inputElement.offsetHeight;
        //定制化参数，以后可以扩展
        options = options || {};
        options.left = options.left || left;
        options.top = options.top || top;
        //齐宽
        if(options.width)
            options.width = parseInt(options.width);
        else
            options.width = inputElement.offsetWidth;

        //获取一个新的selector对象
        var selector = Selector(inputElement,options);
        
        //对输入框绑定方法
        if(typeof callback == 'function'){
            var em = toolbox.event;

            //方法均是对selector对象的操作，除了在输入框输入内容

            em.addHandler(inputElement,'keyup',function(event){
                var evt = em.getEvent(event);
                switch(evt.keyCode){
                    case KEY.UP:
                        //if(selector.visible())
                        selector.moveSelect(-1,options);
                        break;
                    case KEY.DOWN:
                        selector.moveSelect(1,options);
                        break;
                    case KEY.ESC:
                    case KEY.BACKSPACE:
                        selector.hide();
                        break;
                    case KEY.RETURN:
                        selector.container.style.display = "none";
                        var ul = selector.list;
                        var list = ul.getElementsByTagName('li');
                        inputElement.value = list[selector.active].innerHTML;
                        inputElement.focus();
                        break;
                    default:
                        var text = inputElement.value;
                        if(!this.text || this.text != text){
                            //获得input的值
                            this.text = text;
                            var data = callback(text);
                            //如果callback返回格式错误，则不会显示
                            if(data && toolbox.utils.isArray(data) && data.length)
                                selector.setData(data).show()
                        }
                        break;
                }
            });
        }
    };

    S3.autocomplete = autoComplete;
}(S3);
/**
 * Forms Manager管理表单的读写
 */
+function (toolBox) {

        /**
         * 清理form
         * @param form
         */
       var clearForm = function (form){
            form.reset();
        };

        /**
         * 将form表单中的数据封装成JSON对象。
         * @param form
         * @return {}
         */
       var form2json = function(form){
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
        };


        /**
         * 将数据导入表单
         * @param form
         * @param jsonObj
         */
        var json2form = function(form,jsonObj,pre){
            var key,value,name,eles,match;

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
                        else if (elex.type !== "radio") {
                            elex.value = value;
                        } else {
                            elex.checked = (elex.value === value);
                        }
                    });
                }
            }
        };

    var forms = {
        clearForm:clearForm,
        json2form:json2form,
        form2json:form2json
    };

    toolBox.forms = forms ;
}(S3);

/**
 Number Calculator 数据/金额计算器
 */
+function(toolBox){

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
            return Math.round(Number(n1) * m + Number(n2) * m) / m;
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
            return Number((Math.round(Number(n1) * m - Number(n2) * m) / m).toFixed(Math.max(m1, m2)));
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
                    newArr[i] = multiply(arr1[i] , arr2[i]);
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
                    newArr[i] = add(arr1[i] , arr2[i]);
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
            if (arr1.length === arr1.length) {
                for (var i = 0; i < arr1.length; i++) {
                    newArr[i] = sub(arr1[i],arr2[i]);
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
                return multiply(x,num)
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
                return sub(x,num);
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
                return add(x,num);
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
            return value === undefined ? value : value.replace(/\,/g, '');
        };

    var calculator = {
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
    
    toolBox.number = calculator;
}(S3);
/**
 * Event Manager 事件管理器
 */
+function(toolBox){

    var types =['blur','focus','click','dbclick','mouseover','mousedown','mouseup','mousemove','mouseout','mouseenter','mouseleave','change','load','unload','resize','scroll','select','submit','keydown','keypress','keyup','error'];

    /**
     * 满足浏览器兼容性的事件绑定函数
     * @param element
     * @param type
     * @param handler
     */
    var addHandler = function(element,type,handler){
      if(element.addEventListener){
          element.addEventListener(type,handler,false);
      }else if(element.attachEvent){
          element.attachEvent("on"+type,handler);
      }else{
          element["on"+type] = handler;
      }
    };

    /**
     * 事件解除绑定，考虑浏览器兼容性
     * @param element
     * @param type
     * @param handler
     */
    var removeHandler = function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent('on'+type,handler);
        }else{
            element["on"+type] = null;
        }
    };

    /**
     * @returns {Event|*}
     */
    var getEvent = function(event){
        return event ? event : window.event;
    };

    /**
     * 获取当前事件的节点
     * @param event
     * @returns {*|Object}
     */
    var getTarget = function(){
        return event.target || event.srcElement;
    };

    /**
     * 停止冒泡
     * @param event
     */
    var stopPropagation = function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    };
    
    /**
     * 关闭默认事件
     * @param event
     */
    var preventDefault = function(event){
        if(event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
    };

    /**
     * 初始化事件绑定,通过检测元素的属性来完成绑定事件
     */
    var init = function(selector){
        var evt,target,f;

        //正则表达式，匹配函数
        var pattern = /[a-zA-Z0-9-_]\([a-zA-Z0-9-_]*\)$/;
        var pattern1 = /\([a-zA-Z0-9-_]*\)$/;
        selector = typeof selector == 'string'? ""+selector :"";
        types.forEach(function(item){
            $(selector+" ["+item+"]").each(function(){
                var fn = $(this).attr(item);
                $(this).on(item,function(event){
                    evt = getEvent(event);
                    target = getTarget(evt);
                    if(pattern.test(fn)){
                        f = fn.replace(pattern1,"(target)");
                        eval(f);
                    }
                    else{
                        f = fn+"(target)";
                        eval(f);
                    }
                })
            })
        });
    };

    /**
     * 添加事件类型
     * @param type
     */
    var addTypes = function(type){
      types.push(type);
    };

    toolBox.event = {
        init:init,
        addTypes:addTypes,
        addHandler: addHandler,
        removeHandler:removeHandler,
        getEvent:getEvent,
        getTarget:getTarget,
        stopPropagation:stopPropagation,
        preventDefault:preventDefault
    };
}(S3);
/**
 * Created by zjfh-chent on 2016/8/23.
 */
+function(toolbox){

    /**
     * 处理属性设置
     * @param node
     * @param key
     * @param value
     */
    function setAttr(node,key,value){
        switch(key){
            case 'style':
                node.style.cssText = value;
                break;
            case 'value':
                var tagName = node.tagName || '';
                tagName = tagName.toLowerCase();
                if(tagName === 'input' || tagName === 'textarea'){
                    node.value = value;
                }else{
                    node.setAttribute(key,value);
                }
                break;
            default:
                node.setAttribute(key,value);
                break;
        }
    }

    /**
     * 虚拟DOM对象
     * @param {String} tagName  对象的标签名
     * @param {Object} props   对象的属性
     * @param {Array<Element|String>}  元素的子元素 可以是文字，也可以是Element对象
     */
    function Element (tagName, props, children) {
        var utils = toolbox.utils;
        if (!(this instanceof Element)) {
            if (!utils.isArray(children) && children != null) {
                children = Array.prototype.slice.call(arguments, 2)
                    .filter(
                        function(value){
                            return !!value;
                        })
            }
            return new Element(tagName, props, children)
        }

        if (utils.isArray(props)) {
            children = props;
            props = {}
        }

        this.tagName = tagName;
        this.props = props || {};
        this.children = children || [];
        this.key = props
            ? props.key
            : void 666;

        var count = 0;

        utils.forEach(this.children, function (child, i) {
            if (child instanceof Element) {
                count += child.count
            } else {
                children[i] = '' + child
            }
            count++
        });

        this.count = count
    }

    /**
     * 渲染DOM树
     * @returns {Element}
     */
    Element.prototype.render = function () {
        var el = document.createElement(this.tagName);
        var props = this.props;

        for (var propName in props) {
            var propValue = props[propName];
            setAttr(el, propName, propValue)
        }

        toolbox.utils.forEach(this.children, function (child) {
            // 阿门, 又是IE 8  input element has no appendChild property
            if(el.tagName.toLowerCase() != 'input') {
                var childEl = (child instanceof Element)
                    ? child.render()
                    : document.createTextNode(child);
                el.appendChild(childEl)
            }
        });
        return el
    };

    /**
     * 制作Element对象
     * @param obj
     * @return {Element}
     */
    function makeElement(obj){
        var utils = toolbox.utils;
        var el = toolbox.element;
        if(!utils.isPlainObject(obj) || !obj['tagName'])
            return null;

        if (!utils.isArray( obj['children'] ) &&  obj['children']  != null) {
            obj.children = Array.prototype.slice.call(arguments, 2)
                .filter(
                    function(value){
                        return !!value;
                    })
        }

        if (utils.isArray(obj['props'])) {
            obj.children = props;
            obj.props = {}
        }

        obj.props = obj.props || {};
        obj.children = obj.children || [];

        //迭代
        var childrenElements = obj.children.map(function (item) {
                if (utils.isPlainObject(item) && item.tagName)
                    return makeElement(item);
                else
                    return item;
            });
        return el(obj.tagName,obj.props,childrenElements);
    }

    /**
     * 
     * @param tagName
     * @param props
     * @param children
     * @returns {Element}
     */
    toolbox.element = function(tagName,props,children){
        return new Element(tagName,props,children);
    };
    toolbox.element.make = makeElement
}(S3);
/**
 * Created by zjfh-chent on 2016/12/16.
 */
(function(toolbox){
    var CookieStorage  = function(maxage,path){
        var cookie = (function(){
            var cookietemp = {};
            var all = document.cookie;
            if(all === "") return cookietemp;
            var list = all.split("; ");
            for(var i=0;i<list.length;i++){
                var cookie = list[i];
                var p = cookie.indexOf("=");
                var name = cookie.substring(0,p); //cookie name
                var value = cookie.substring(p+1);  //cookie value
                value = decodeURIComponent(value);
                cookietemp[name] = value;
            }
            return cookietemp;
        }());

        //length
        var keys = [];
        for(var key in cookie) keys.push(key);
        this.length = keys.length;

        //key
        this.key = function(n){
            if(n<0 || n>=keys.length) return null;
            return keys[n];
        }

        this.getItem = function(key){
            return cookie[key] || null;
        }

        this.setItem = function(key,value){
            if(!(key in cookie)){
                keys.push(key);
                this.length++;
            }

            cookie[key] = value;

            var localstr = key + "=" + encodeURIComponent(value);
            //属性 暂不考虑
            document.cookie = localstr;
        }
    };
    var cookieStorage = new CookieStorage();

    toolbox.istore =  {
        get:function(key){
            if(sessionStorage)
                return sessionStorage.getItem(key);
            else
                return cookieStorage.getItem(key);
        },
        set:function(key,value){
            if(sessionStorage)
                sessionStorage.setItem(key,value);
            else
                cookieStorage.setItem(key,value);
        }
    };
})(S3);
/**
 * Created by zjfh-chent on 2016/8/16.
 */
+function(toolbox){

    /**
     * 生成菜单，返回一个菜单Element对象
     * @param list  菜单数据
     * @param i 层级
     */
    var generatorMenu = function(list,i){
        var i = i || 0;
        var obj ={
            tagName:'ul',
            props:{'class':'menu-list-level'+i},
            children:[]
        };
        if(!list && !toolbox.utils.isArray(list)){
            list = [];
        }
        list.forEach(function(li){
            var liobj = {
                tagName:'li',
                props:{'class':'menu-content-level'+ i},
                children:[]
            };
            if(toolbox.utils.isPlainObject(li)){
                if(li['title']){}
                    liobj.children.push({
                       tagName:'div',
                       props:{'class':'menu-title-level'+ (i+1)},
                       children:[li['title']]
                    });
                if(li['content'] && toolbox.utils.isArray(li['content'])){
                    liobj.children.push(generatorMenu(li['content'],i+1));
                }
            }
            else{
                    liobj.children.push(li)
            }
            obj.children.push(liobj);
        });

        return toolbox.element.make(obj);
    };



    var options = {
        onclick:function(target){
            if($(target).attr("class").indexOf('title-level') != -1){
                var ul = $(target).parent().find('ul');
                if(ul.hasClass('active')){
                    ul.removeClass('active');
                    ul.slideUp();
                }else{
                    $('.menu-list-level0 .active').removeClass('active').slideUp();
                    ul.addClass('active').slideToggle();
                }
            }else{
                options.callback(target);
            }
        },
        callback:function(){

        }
    };

    /**
     * 渲染菜单
     * @param container
     * @param list
     * @param callback
     */
    var renderMenu = function(container,list,callback){
        container.appendChild(makeMenu(list,callback));
    };
    /**
     * 生成菜单
     * @param obj
     * @param callback
     * @returns {String|Element|*}
     */
    var makeMenu = function(obj,callback){
        var container = document.createElement('div');
        if(toolbox.utils.isPlainObject(obj)){
            if(obj['title']){
                var title = toolbox.element('div',{'class':'menu-title-level0'},[obj['title']]).render();
                container.appendChild(title)
            }
            if(toolbox.utils.isArray(obj.content)){
                var menu = generatorMenu(obj.content).render();
                if(typeof callback == 'function')
                    options.callback = callback;
                toolbox.event.addHandler(menu,'click',function(){
                    var evt = toolbox.event.getEvent();
                    var target = toolbox.event.getTarget(evt);
                    options.onclick(target);
                });
                container.appendChild(menu);
            }
        }
        return container;
    };


    S3.menu = {
        makeMenu:makeMenu,
        renderMenu:renderMenu
    }
}(S3);

+function(toolBox){

    var Page = (function(){
        /**
         * 按钮
         * @param buttonLabel
         * @param pageNumber
         * @param pageCount
         * @param callback
         * @returns {*|jQuery|HTMLElement}
         */
        function renderButton(buttonLabel, pageNumber, pageCount,callback,container) {

            var buttonNode = document.createElement('li');
            buttonNode.innerHTML = buttonLabel;
            buttonNode.setAttribute('class','pgNext');

            var destPage = 1;
            switch (buttonLabel) {
                case "最前":
                    destPage = 1;
                    break;
                case "上一页":
                    destPage = pageNumber - 1;
                    break;
                case "下一页":
                    destPage = pageNumber + 1;
                    break;
                case "最后":
                    destPage = pageCount;
                    break;
            }

            // disable and 'grey' out buttons if not needed.
            var ctext;
            if (buttonLabel == "最前" || buttonLabel == "上一页") {
                if(pageNumber <= 1){
                    ctext =  buttonNode.getAttribute('class');
                    ctext = ctext + " pgEmpty";
                    buttonNode.setAttribute('class',ctext);
                }else{
                    toolBox.event.addHandler(buttonNode,'click',function(){
                        callback(destPage);
                        renderPage(destPage, pageCount,callback,container)
                    },false);
                }
            }
            else {
                if(pageNumber >= pageCount){
                    ctext =  buttonNode.getAttribute('class');
                    ctext = ctext + " pgEmpty";
                    buttonNode.setAttribute('class',ctext);
                }else{
                    toolBox.event.addHandler(buttonNode,'click',function(){
                        callback(destPage);
                        renderPage(destPage, pageCount,callback,container)
                    },false);
                }
            }

            return buttonNode;
        }
        /**
         * 生成页码的代码
         * @param currentNumber
         * @param pageCount
         * @param callback
         * @returns {*|jQuery|HTMLElement}
         */
        function renderPage(currentNumber, pageCount,callback,container){

            var pageNode = document.createElement('ul');
            pageNode.setAttribute('class','pages');

            // add previous and next buttons
            pageNode.appendChild(renderButton('最前', currentNumber, pageCount, callback,container));
            pageNode.appendChild(renderButton('上一页', currentNumber, pageCount, callback,container));

            var startPoint = 1;
            var endPoint =9;
            if (currentNumber > 4) {
                startPoint = currentNumber - 4;
                endPoint = currentNumber + 4;
            }
            if (endPoint > pageCount) {
                startPoint = pageCount - 8;
                endPoint = pageCount;
            }
            if (startPoint < 1) {
                startPoint = 1;
            }

            for (var page = startPoint; page <= endPoint; page++) {
                var listButton = document.createElement('li');
                listButton.innerHTML = page;
                listButton.setAttribute('class','page-number');
                var ctxt;
                if(page === currentNumber){
                    ctxt= listButton.getAttribute('class');
                    ctxt = ctxt + ' pgCurrent';
                    listButton.setAttribute('class',ctxt);
                }else{
                    toolBox.event.addHandler(listButton,'click',function() {
                        var evt = toolBox.event.getEvent(event);
                        var target = toolBox.event.getTarget(evt);
                        var num = target.innerHTML;
                        callback(parseInt(num));
                        renderPage(parseInt(num), pageCount,callback,container);
                    },false);
                }
                pageNode.appendChild(listButton);
            }
            // render in the next and last buttons before returning the whole rendered control back.
            pageNode.appendChild(renderButton('下一页', currentNumber, pageCount, callback,container));
            pageNode.appendChild(renderButton('最后', currentNumber, pageCount, callback,container));

            if(container){
                container.innerHTML = "";
                container.appendChild(pageNode);
            }
            return pageNode;
        }


        //page plugin start
        var options = {
            currentpage: 1,
            pagecount: 10
        };
        var callbackfunc = function(clickpage){
            return clickpage;
        };

        /**
         * 页码组件
         * @param container
         * @param callback
         * @param option
         * @returns {*}
         * @constructor
         */
        var Page = function(container,callback,option){
            if(!container || !callback)
                return null;
            callbackfunc = callback || callbackfunc;
            if(option){
                for(var key in option){
                    options[key] = option[key];
                }
            }
            return new Page.prototype.init(container,callbackfunc,options);
        };

        Page.prototype = {
            constructor:Page,
            init:function(container,callback,options){
                this.container = container;
                renderPage(parseInt(options.currentpage), parseInt(options.pagecount), callback,container);
                return this;
            },
            setPage:function(current){
                this.container.innerHTML = "";
                this.container.appendChild(renderPage(current, parseInt(options.pagecount), callbackfunc));
                return this;
            }

        };

        Page.prototype.init.prototype = Page.prototype;
        return Page;
    })();

    toolBox.page = Page;
}(S3);
/**
 * Created by zjfh-chent on 2016/8/11.
 */
+function(toolbox){

    /**
     *  生成表头的虚拟DOM对象
     * @param headdata
     * @param options
     * @returns {Element}
     */
    function makeHead(headdata,options){
        var utils = toolbox.utils;
        if(headdata == undefined || !utils.isArray(headdata))
            return null;

        var el = toolbox.element;
        var rowchild = [];

        //处理start  end不处理
        var startCol,startChild = [];
        if(options && options.start && utils.isArray(options.start)){
            var start = options.start;
            start.forEach(function(item){
                startChild.push(el.make(item));
            });
        }
        startCol = el('th',null,startChild);

        //行的子元素
        rowchild.push(startCol);
        headdata.forEach(function(item){
            if(utils.isPlainObject(item)){
                item = el.make(item);
            }
            rowchild.push(el('th',null,[item]));
        });

        //生成行的虚拟DOM
        var obj = options.th ? {"class":options.th}:null;
        var tr = el('tr',obj,rowchild);

        //生成表头的虚拟DOM
        var thead = el('thead',{},[tr]);

        //返回虚拟DOM
        return thead;
    }

    /**
     * 生成标题的虚拟DOM对象
     * @param bodydata
     * @param options
     * @returns {Element}
     */
    function makeBody(bodydata,options){
        var utils = toolbox.utils;
        if(bodydata == undefined || !utils.isArray(bodydata))
            return null;

        var el = toolbox.element;

        //表体的子元素
        var bodychild=[];

        //处理start
        var startCol,startChild = [];
        if(options && options.start && utils.isArray(options.start)){
            var start = options.start;
            start.forEach(function(item){
                startChild.push(el.make(item));
            });
        }
        startCol = el('th',null,startChild);


        //处理end
        var endCol,endChild = [];
        if(options && options.end && utils.isArray(options.end)){
            var end = options.end;
            end.forEach(function(item){
                endChild.push(el.make(item));
            });
        }
        endCol = el('td',null,endChild);

        //对每一行
        for(var i =0;i<bodydata.length;i++){
            var rowdata = bodydata[i],rowchild=[];

            if(startCol){
                rowchild.push(startCol);
            }
            for(var key in rowdata) rowchild.push(el.make(
                {tagName:'td', props:{name: key}, children:[rowdata[key]]
                }));
            if(endCol) {
                rowchild.push(endCol);
            }

            //生成每一行的虚拟DOM 并作为表体的子元素
            var obj = options.tr ? {"class":options.tr}:null;
            bodychild.push(el('tr',obj,rowchild));
        }

        //生成标题的虚拟DOM
        var tbody = el('tbody',null,bodychild);

        return tbody;
    }

    /**
     * 绑定事件的函数
     * @param table
     * @param callback
     */
    function bindCallBack(table,callback){
        var em = toolbox.event;
        em.addHandler(table,'click',function(){
            var evt = em.getEvent(event);
            var target = em.getTarget(evt);
            callback(target);
        });
    }

    /**
     *
     * @param parent 父容器
     * @param data   数据 包含 表头和标题
     * {
     *      title:['title1','title2',xxx,xxx],   //表头
     *      data:[{},{},{},{},{}]  //5行
     * }
     * @param callback  回调函数 //事件委托，参数为点击对象
     * @param options  表第一列和最后一列需要展示的内容，固定结构：
     * {
     *      start:{
     *          [
         *          {
         *          tagName:'input',//必须是string
         *          props:{type:'checkbox',name:'checkboxname','class':'checkboxclass'},//必须是对象
         *          children:['内容']//必须是数组
         *          }
     *          ]
     *      }
     *      end:{
     *          [
     *              {
     *                  tagName:'button',//必须是string
     *                  props:{name:'buttonname','class':'buttonclass'},//必须是对象
     *                  children:['按钮1']//必须是数组
     *              },
     *              {
     *                  tagName:'button',//必须是string
     *                  props:{name:'buttonname','class':'buttonclass'},//必须是对象
     *                  children:['按钮2']//必须是数组
     *              }
     *          ]
     *      }
     * }
     * @returns {Table.makeTable}
     * @constructor
     */
    var Table = function(parent,data,callback,options){
        return new Table.prototype.makeTable(parent,data,callback,options);
    };

    Table.prototype = {
        constructor:Table,
        makeTable:function(parent,data,callback,options){

            if(parent == null || data == null || data.data == undefined || !toolbox.utils.isArray(data.data))
                return null;

            //缓存数据
            var headTemp;

            //判断是否有表头
            if(data.title && toolbox.utils.isArray(data.title)){
                headTemp = data.title;
            }
            //是否有回调函数
            if(callback && toolbox.utils.isFunction(callback)){
                this.callback = callback;
            }

            //渲染DOM
            var thead = makeHead(headTemp,options);
            var tbody = makeBody(data.data,options);
            var table,child=[];
            if(thead) {
                this.thead = thead;
                child.push(thead);
            }
            if(tbody)
                child.push(tbody);
            table = toolbox.element('table',{},child).render();


            if(this.callback)
                bindCallBack(table,this.callback);

            parent = typeof parent == 'string'?document.getElementById(parent):parent;
            parent.innerHTML = "";
            table.style = "width:100%";
            parent.appendChild(table);

            this.options = options;
            this.parent = parent;

            //如果有排序功能，需要默认排序规则
            // this.sort = 'default';
            //this.sortType = '0';
            return this;
        },
        /**
         * 更新表体内容
         * @param data
         * @returns {Table}
         */
        setData:function(data){
            if(!data || !toolbox.utils.isArray(data)){
                throw new TypeError('期望传入表格的内容数组，实际传入'+data+",请使用正确的参数!");
                return this;
            }

            //渲染DOM
            var table,child=[];
            var options = this.options || null;
            var tbody = makeBody(data,options);
            if(this.thead)
                child.push(this.thead);
            if(tbody)
                child.push(tbody);
            table = toolbox.element('table',{},child).render();
            if(this.callback)
                bindCallBack(table,this.callback);
            this.parent.innerHTML = "";
            this.parent.appendChild(table);
            return this;
        }
    };

    //把makeTable的原型指向Table的原型
    //从而makeTable的构造器指向Table的构造器
    Table.prototype.makeTable.prototype = Table.prototype;

    toolbox.table = Table;
}(S3);
/**
 * template manager 模板引擎
 */
+function(toolBox){
    /**
     * 模板引擎
     * @name    template
     * @param   {String}            模板名
     * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
     * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
     */
    var template = function (filename, content) {
        return typeof content === 'string'
            ?   compile(content, {
            filename: filename
        })
            :   renderFile(filename, content);
    };


    /**
     * 设置全局配置
     * @name    template.config
     * @param   {String}    名称
     * @param   {Any}       值
     */
    template.config = function (name, value) {
        defaults[name] = value;
    };



    var defaults = template.defaults = {
        openTag: '<%',    // 逻辑语法开始标签
        closeTag: '%>',   // 逻辑语法结束标签
        escape: true,     // 是否编码输出变量的 HTML 字符
        cache: true      // 是否开启缓存（依赖 options 的 filename 字段）
    };


    var cacheStore = template.cache = {};


    /**
     * 渲染模板
     * @name    template.render
     * @param   {String}    模板
     * @param   {Object}    数据
     * @return  {String}    渲染好的字符串
     */
    template.render = function (source, options) {
        return compile(source, options);
    };


    /**
     * 渲染模板(根据模板名)
     * @name    template.render
     * @param   {String}    模板名
     * @param   {Object}    数据
     * @return  {String}    渲染好的字符串
     */
    var renderFile = template.renderFile = function (filename, data) {
        var fn = template.get(filename) || showDebugInfo({
                filename: filename,
                name: 'Render Error',
                message: 'Template not found'
            });
        return data ? fn(data) : fn;
    };


    /**
     * 获取编译缓存（可由外部重写此方法）
     * @param   {String}    模板名
     * @param   {Function}  编译好的函数
     */
    template.get = function (filename) {

        var cache;

        if (cacheStore[filename]) {
            // 使用内存缓存
            cache = cacheStore[filename];
        } else if (typeof document === 'object') {
            // 加载模板并编译
            var elem = document.getElementById(filename);

            if (elem) {
                var source = (elem.value || elem.innerHTML)
                    .replace(/^\s*|\s*$/g, '');
                cache = compile(source, {
                    filename: filename
                });
            }
        }

        return cache;
    };


    var toString = function (value, type) {

        if (typeof value !== 'string') {

            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') {
                value = toString(value.call(value));
            } else {
                value = '';
            }
        }

        return value;

    };


    var escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };


    var escapeFn = function (s) {
        return escapeMap[s];
    };

    var escapeHTML = function (content) {
        return toString(content)
            .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    };


    var isArray = Array.isArray || function (obj) {
            return ({}).toString.call(obj) === '[object Array]';
        };


    var each = function (data, callback) {
        var i, len;
        if (isArray(data)) {
            for (i = 0, len = data.length; i < len; i++) {
                callback.call(data, data[i], i, data);
            }
        } else {
            for (i in data) {
                callback.call(data, data[i], i);
            }
        }
    };


    var utils = template.utils = {

        $helpers: {},

        $include: renderFile,

        $string: toString,

        $escape: escapeHTML,

        $each: each

    };/**
     * 添加模板辅助方法
     * @name    template.helper
     * @param   {String}    名称
     * @param   {Function}  方法
     */
    template.helper = function (name, helper) {
        helpers[name] = helper;
    };

    var helpers = template.helpers = utils.$helpers;




    /**
     * 模板错误事件（可由外部重写此方法）
     * @name    template.onerror
     * @event
     */
    template.onerror = function (e) {
        var message = 'Template Error\n\n';
        for (var name in e) {
            message += '<' + name + '>\n' + e[name] + '\n\n';
        }

        if (typeof console === 'object') {
            console.error(message);
        }
    };


// 模板调试器
    var showDebugInfo = function (e) {

        template.onerror(e);

        return function () {
            return '{Template Error}';
        };
    };


    /**
     * 编译模板
     * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
     * @name    template.compile
     * @param   {String}    模板字符串
     * @param   {Object}    编译选项
     *
     *      - openTag       {String}
     *      - closeTag      {String}
     *      - filename      {String}
     *      - escape        {Boolean}
     *      - cache         {Boolean}
     *
     * @return  {Function}  渲染方法
     */
    var compile = template.compile = function (source, options) {

        // 合并默认配置
        options = options || {};
        for (var name in defaults) {
            if (options[name] === undefined) {
                options[name] = defaults[name];
            }
        }


        var filename = options.filename;


        try {

            var Render = compiler(source, options);

        } catch (e) {

            e.filename = filename || 'anonymous';
            e.name = 'Syntax Error';

            return showDebugInfo(e);

        }


        // 对编译结果进行一次包装

        function render (data) {

            try {

                return new Render(data, filename) + '';

            } catch (e) {

                // 运行时出错后自动开启调试模式重新编译
                if (!options.debug) {
                    options.debug = true;
                    return compile(source, options)(data);
                }

                return showDebugInfo(e)();

            }

        }


        render.prototype = Render.prototype;
        render.toString = function () {
            return Render.toString();
        };


        if (filename && options.cache) {
            cacheStore[filename] = render;
        }


        return render;

    };




    // 数组迭代
    var forEach = utils.$each;


    // 静态分析模板变量
    var KEYWORDS =
        // 关键字
        'break,case,catch,continue,debugger,default,delete,do,else,false'
        + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
        + ',throw,true,try,typeof,var,void,while,with'

        // 保留字
        + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
        + ',final,float,goto,implements,import,int,interface,long,native'
        + ',package,private,protected,public,short,static,super,synchronized'
        + ',throws,transient,volatile'

        // ECMA 5 - use strict
        + ',arguments,let,yield'

        + ',undefined';

    var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
    var SPLIT_RE = /[^\w$]+/g;
    var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
    var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
    var BOUNDARY_RE = /^,+|,+$/g;
    var SPLIT2_RE = /^$|,+/;


    // 获取变量
    function getVariable (code) {
        return code
            .replace(REMOVE_RE, '')
            .replace(SPLIT_RE, ',')
            .replace(KEYWORDS_RE, '')
            .replace(NUMBER_RE, '')
            .replace(BOUNDARY_RE, '')
            .split(SPLIT2_RE);
    }


    // 字符串转义
    function stringify (code) {
        return "'" + code
            // 单引号与反斜杠转义
                .replace(/('|\\)/g, '\\$1')
                // 换行符转义(windows + linux)
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n') + "'";
    }


    function compiler (source, options) {

        var openTag = options.openTag;
        var closeTag = options.closeTag;
        var escape = options.escape;



        var line = 1;
        var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};

        //兼容性测试 是否现代浏览器引擎
        var isNewEngine = ''.trim;
        var replaces = isNewEngine
            ? ["$out='';", "$out+=", ";", "$out"]
            : ["$out=[];", "$out.push(", ");", "$out.join('')"];

        var concat = isNewEngine
            ? "$out+=text;return $out;"
            : "$out.push(text);";

        var print = "function(){"
            +      "var text=''.concat.apply('',arguments);"
            +       concat
            +  "}";

        var include = "function(filename,data){"
            +      "data=data||$data;"
            +      "var text=$utils.$include(filename,data,$filename);"
            +       concat
            +   "}";

        var headerCode = "'use strict';"
            + "var $utils=this,$helpers=$utils.$helpers,"
            + "";

        var mainCode = replaces[0];

        var footerCode = "return new String(" + replaces[3] + ");"

        // html与逻辑语法分离
        forEach(source.split(openTag), function (code) {
            code = code.split(closeTag);

            var $0 = code[0];
            var $1 = code[1];

            // code: [html]
            if (code.length === 1) {

                mainCode += html($0);

                // code: [logic, html]
            } else {

                mainCode += logic($0);

                if ($1) {
                    mainCode += html($1);
                }
            }


        });

        var code = headerCode + mainCode + footerCode;

        try {


            var Render = new Function("$data", "$filename", code);
            Render.prototype = utils;

            return Render;

        } catch (e) {
            e.temp = "function anonymous($data,$filename) {" + code + "}";
            throw e;
        }




        // 处理 HTML 语句
        function html (code) {

            // 记录行号
            line += code.split(/\n/).length - 1;

            if (code) {
                code = replaces[1] + stringify(code) + replaces[2] + "\n";
            }

            return code;
        }


        // 处理逻辑语句
        function logic (code) {

            var thisLine = line;

            // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
            // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
            if (code.indexOf('=') === 0) {

                var escapeSyntax = escape && !/^=[=#]/.test(code);

                code = code.replace(/^=[=#]?|[\s;]*$/g, '');

                // 对内容编码
                if (escapeSyntax) {

                    var name = code.replace(/\s*\([^\)]+\)/, '');

                    // 排除 utils.* | include | print

                    if (!utils[name] && !/^(include|print)$/.test(name)) {
                        code = "$escape(" + code + ")";
                    }

                    // 不编码
                } else {
                    code = "$string(" + code + ")";
                }


                code = replaces[1] + code + replaces[2];

            }

            // 提取模板中的变量名
            forEach(getVariable(code), function (name) {

                // name 值可能为空，在安卓低版本浏览器下
                if (!name || uniq[name]) {
                    return;
                }

                var value;

                // 声明模板变量
                // 赋值优先级:
                // [include, print] > utils > helpers > data
                if (name === 'print') {

                    value = print;

                } else if (name === 'include') {

                    value = include;

                } else if (utils[name]) {

                    value = "$utils." + name;

                } else if (helpers[name]) {

                    value = "$helpers." + name;

                } else {

                    value = "$data." + name;
                }

                headerCode += name + "=" + value + ",";
                uniq[name] = true;


            });

            return code + "\n";
        }


    }

    toolBox.template = template;
}(S3);
/**
 * Utils 通用功能
 *
 */
+function(toolBox){
        /**
         *兼容浏览器把-替换为/
         *@param val
         **/
        function delimiterConvert(val){
            return val.replace(/-/g,'/');
        }

        function deepCopy(obj){
            var newobj;
            if(isArray(obj)){
                newobj = obj.slice();
                return newobj;
            }
            if(isObject(obj)){
                for(var key in obj){
                    if(isObject(obj[key]))
                        newobj[key] = deepCopy(obj[key]);
                    else
                        newobj[key] = obj[key];
                }
            }
        }

        /**
         * 判断是否数组
         */
        var isArray = Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };

        /**
         * 是否是类数组的结构
         * @param obj
         * @returns {boolean}
         */
        var isArrayLike = function(obj){
            return !!(isArray(obj) || obj.length);

        };
        /**
         *
         * @param obj
         * @returns {boolean}
         */
        var isFunction = function(obj){
            return typeof obj === 'function';
        };

        /**
         * 判断是否数字
         * @param obj
         * @returns {boolean}
         */
        var isNumber = function (obj) {
            return typeof obj === 'number';
        };

        /**
         * 判断是否对象
         * @param obj
         * @returns {boolean}
         */
        var isObject = function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        };

        /**
         *判断是否是纯对象 纯{}下的
         * @param obj
         * @return {boolean}
         */
        var isPlainObject = function (obj) {
            if(obj && Object.prototype.toString.call(obj) === "[object Object]"&& obj.constructor === Object
            && !Object.hasOwnProperty.call(obj,"constructor")){
                var key;
                for(key in obj){}
                return key === undefined || Object.hasOwnProperty.call(obj,key);
            }
            return false;
        };

        /**
         *
         * @param obj
         * @returns {boolean}
         */
        var isNull = function (obj) {
            return obj === null;
        };

        /**
         *
         * @param obj
         * @returns {boolean}
         */
        var isUndefined = function (obj) {
            return obj === void 0;
        };

        /**
         * 判断某对象是否含有某属性
         * @param obj
         * @param key
         * @returns {boolean}
         */
        var has = function (obj, key) {
            if(obj !== Object(obj))
                throw new TypeError('Object has called on a non-object');
            return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
        };

        /**
         * 返回对象的属性数组
         * @param obj
         * @returns {Array}
         */
        var keys = function (obj) {
            if(obj !== Object(obj))
                throw new TypeError('Object.keys called on a non-object');
            if (Object.keys) return Object.keys(obj);
            var keys = [];
            for (var key in obj) {
                if (has(obj, key)) keys.push(key);
            }
            return keys;
        };

        /**
         * 返回对象的值数组
         * @param obj
         * @returns {*}
         */
        var values = function (obj) {
            var keyAry = keys(obj);
            var length = keyAry.length;
            var values = new Array(length);
            for (var i = 0; i < length; i++) {
                values[i] = obj[keyAry[i]];
            }
            return values;
        };

        /**
         * 将一个对象扩展到另一个对象
         * @param obj
         * @param context
         * @returns {*}
         */
         var extend = function (obj, context) {
            if (!isPlainObject(context))
                return obj ? obj : {};
            else{
                for (var key in context) {
                    obj[key] = context[key];
                }
                return obj;
            }
        };

        /**
         * 克隆一个对象
         * @param obj
         * @returns {*}
         */
        var clone = function (obj) {
            if (!isObject(obj))
                return obj;
            else
                return deepCopy(obj);
        };

        /**
         * 日期比较  date1 小于date2 返回true  否则返回false
         * @param date1
         * @param date2
         * @returns {boolean}
         */
        var dateCompare = function (date1, date2) {
            var date1 = new Date(delimiterConvert(date1)).getTime();
            var date2 = new Date(delimiterConvert(date2)).getTime();
            if (date1 < date2) {
                return true;
            } else {
                return false;
            }
        };

        /**
         *
         */
        var isMobile = function (){
            var sUserAgent = navigator.userAgent;
            if (sUserAgent.indexOf("Android") > -1 ||
                sUserAgent.indexOf("iPhone") > -1 ||
                sUserAgent.indexOf("iPad") > -1 ||
                sUserAgent.indexOf("iPod") > -1 ||
                sUserAgent.indexOf("Symbian") > -1){
                return true;
            }
            return false;
        };

        /**
         * 判断IE678浏览器
         * @returns {boolean}
         */
        var isIE678 =function (){
            if(navigator.userAgent.indexOf("MSIE")>0) {
                //是否是IE浏览器
                if(navigator.userAgent.indexOf("MSIE 6.0")>0)
                {
                    return true;
                }
                if(navigator.userAgent.indexOf("MSIE 7.0")>0)
                {
                    return true;
                }
                if(navigator.userAgent.indexOf("MSIE 8.0")>0)
                {
                    return true;
                }
            }
            else {
                return false;
            }
        };
        /**
         * 迭代器，用来兼容IE8-的数组迭代
         * @returns {*}
         * @param array
         * @param fn
         */
        var forEach = function(array,fn) {
            if(isArrayLike(array)){
                var i;
                for(i=0;i<array.length;i++){
                    fn(array[i])
                }
            }else{
                throw new Error('请传入正确的参数');
            }
        };
        /**
         * 数组函数，对每一个元素执行fn 只要一个返回真，则为真
         * @param array
         * @param fn
         * @returns {boolean}
         */
        var some = function(array,fn){
            if(isArrayLike(array)){
                var i;
                for(i=0;i<array.length;i++){
                    if(fn(array[i]))
                        return true;
                }
                return false;
            }else{
                throw new Error('请传入正确的参数');
            }
        };

        /**
         * 重定义array.map
         * @param array
         * @param fn
         * @returns {Array}
         */
        var map = function(array,fn){
            if(isArrayLike(array)){
                var newAry = [];
                for(var i =0;i<array.length;i++){
                    newAry.push(fn(array[i]));
                }
                return newAry;
            }else{
                throw new Error('请传入正确参数');
            }
        };

        /**
         *
         * @param array
         * @param fn
         * @returns {Array}
         */
        var filter = function(array,fn){
            if(isArrayLike(array)){
                var newAry = [];
                for(var i = 0;i<array.length;i++){
                    if(fn(array[i]))
                        newAry.push(array[i]);
                }
                return newAry;
            }
        };

        /**
         *
         * @param str
         * @returns {*|{dist}|XML|{example, overwrite, disable_template_processing}|void|string}
         */
        var trim = function(str){
            return str.replace(/(^\s*)|(\s*$)/g, '');
        };

        if(!String.prototype.trim){
            String.prototype.trim = function(){
                return trim(this);
            };
        }

        if(!Array.prototype.forEach){
            Array.prototype.forEach = function(fn){
                return forEach(this,fn);
            }
        }

        if(!Array.prototype.filter){
            Array.prototype.filter = function(fn){
                return filter(this,fn);
            }
        }

        if(!Array.prototype.some){
            Array.prototype.some = function(fn){
                return some(this,fn);
            }
        }
        if(!Array.prototype.map){
            Array.prototype.map = function(fn){
                return map(this,fn);
            }
        }

        /**
         *
         * @type {{isArray: (*|Function), isNumber: isNumber, isObject: isObject, isPlainObject: isPlainObject, isNull: isNull, isUndefined: isUndefined, has: has, keys: keys, values: values, extend: extend, clone: clone, dateCompare: dateCompare, isMobile: isMobile, forEach: forEach, some: some}}
         */
        var utils = {
            isArray: isArray,
            isArrayLike:isArrayLike,
            isFunction:isFunction,
            isNumber: isNumber,
            isObject: isObject,
            isPlainObject: isPlainObject,
            isNull: isNull,
            isUndefined: isUndefined,
            isIE678:isIE678,
            has: has,
            keys: keys,
            values: values,
            extend: extend,
            clone: clone,
            dateCompare: dateCompare,
            isMobile: isMobile,
            forEach:forEach
        };
        toolBox.utils = utils;
}(S3);

/**
 * Created by zjfh-chent on 2016/8/24.
 */
+function(toolbox){
    /**
     * 验证函数对象
     * @param form
     * @param options
     *
     * example:
     *  options = {
     *       onsuccess:function(){},  //验证通过后的回调函数
     *       submitButton:button,   //如果form不是表单，button不会自动提交，因此需要指定这个被点击后触发校验的按钮
     *       patterns:{} //如果对当前的type='number'或者mobilephone或者email不满意，可以自己写pattern 一般用不到
     *       markValid:function(validity){}    //如果对目前的校验成功的效果不满意，可以重新定义
     *       markInValid:function(validity){}  //如果对目前的校验失败变红不满意，可以重新定义
     *  }
     */
    var Validator = function(form,options){
        this.options = $.extend({}, Validator.DEFAULTS, options);
        this.options.patterns = $.extend({}, Validator.DEFAULTS.patterns, options.patterns);
        this.$element = $(form);
        this.init();
    };

    //默认配置
    Validator.DEFAULTS = {
        inputType: ['email', 'number', 'mobilephone'],
        patterns: {},
        validateOnSubmit: true,
        allFields: ':input:not(:submit, :button, :disabled, :hidden)',
        inValidClass: 'validate-field-error',
        validClass: 'validate-field-success',
        keyboardFields: ':input:not(:button, :disabled, :hidden)',
        keyboardEvents: 'focusout, keyup',
        submitButton:null,
        onValid: function (validity) {
        },
        onInValid: function (validity) {
        },
        markValid: function (validity) {
            var options = this.options;
            var $field = $(validity.field);
            $field.addClass(options.validClass).removeClass(options.inValidClass);
            $field.parent().find('.validate-alert').hide();
            options.onValid.call(this, validity);
        },
        markInValid: function (validity) {
            var options = this.options;
            var $field = $(validity.field);
            $field.addClass(options.inValidClass).removeClass(options.validClass);
            var $alert = $field.parent().find('.validate-alert');
            if (!$alert.length) {
                $alert = $("<div class='validate-alert'></div>").hide();
                $field.after($alert);
            }
            $alert.html(validity.errormsg).show();
            options.onInValid.call(this, validity);
        },
        onsuccess:function(){}
    };
    Validator.DEFAULTS.patterns = {
        email: /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,
        number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
        dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        integer: /^-?\d+$/,
        mobilephone:"^(86)?1[3,5,7,8]\\d{9}$"
        //TODO password pattern 理论上也应该加上
    };
    Validator.ERROR_MAP = {
        tooShort: 'minlength',
        checkedOverflow: 'maxchecked',
        checkedUnderflow: 'minchecked',
        rangeOverflow: 'max',
        rangeUnderflow: 'min',
        tooLong: 'maxlength'
    };
    Validator.validationMessages = {
        valueMissing: '必须填写这个字段',
        tooShort: '至少填写 %s 个字符',
        patternMismatch: '请按照要求的格式填写',
        rangeOverflow: '请填写小于等于 %s 的值',
        rangeUnderflow: '请填写大于等于 %s 的值',
        stepMismatch: '',
        tooLong: '至多填写 %s 个字符',
        typeMismatch: '请按照规定的类型填写'
    };

    /**
     * 初始化
     */
    Validator.prototype.init = function() {
        var _this = this;
        var $element = this.$element;
        var options = this.options;

        //禁用HTML5原生的校验器
        $element.attr('novalidate', 'novalidate');
        function regexToPattern(regex) {
            var pattern = regex.toString();
            return pattern.substring(1, pattern.length - 1);
        }
        //对于H5原生校验禁用的，补充一个pattern，来确保原生校验关闭后，仍能校验
        $.each(options.inputType, function(i, type) {
            var $field = $element.find('input[type=' + type + ']');
            if(type == 'mobilephone'){
                $field.attr('type','number');
            }
            if (!$field.attr('pattern')) {
                $field.attr('pattern', regexToPattern(options.patterns[type]));
            }
        });

        //当提交的时候调用
        $element.on('submit.validator', function(e) {
            //如果没有validateOnSubmit，点击提交的时候不会校验，通过option配置
            if (options.validateOnSubmit) {
                var formValidity = _this.isFormValid();
                //return result
                if ($.type(formValidity) === 'boolean') {
                    if(formValidity && typeof options.onsuccess == 'function')
                        options.onsuccess();
                    return formValidity;
                }
            }
        });

        //当表单不是<form>标签时，定义一个提交的按钮，点击这个按钮的时候调用
        if(options.submitButton){
            $(options.submitButton).on('click.validator', function(e) {
                //如果没有validateOnSubmit，点击提交的时候不会校验，通过option配置
                if (options.validateOnSubmit) {
                    var formValidity = _this.isFormValid();
                    //return result
                    if ($.type(formValidity) === 'boolean') {
                        if(formValidity && typeof options.onsuccess == 'function')
                            //表单校验成功，则调用成功后的函数
                            options.onsuccess();
                        return formValidity;
                    }
                }
            });
        }

        //绑定时间的函数
        function bindEvents(fields, eventFlags) {
            var events = eventFlags.split(',');
            var validate = function(e) {
                _this.validate(this);
            };
            $.each(events, function(i, event) {
                $element.on(event + '.validator', fields, validate);
            });
        }

        //绑定事件
        bindEvents(options.keyboardFields, options.keyboardEvents);
    };

    /**
     *
     * @param field
     * @returns {*}
     */
    Validator.prototype.validate = function(field) {
        var _this = this;
        var $element = this.$element;
        var $field = $(field);

        // 验证确认密码
        var equalTo = $field.attr('equalTo');
        //本质上就是把前一个密码的正则用到后一个的pattern字段
        if (equalTo) {
            $field.attr('pattern', '^' + $element.find(equalTo).val() + '$');
        }

        var pattern = $field.attr('pattern') || false;
        var re = new RegExp(pattern);
        var value = $field.val();

        //确定校验
        var required = ($field.attr('required') !== undefined) && ($field.attr('required') !== 'false');
        var maxLength = parseInt($field.attr('maxlength'), 10);
        var minLength = parseInt($field.attr('minlength'), 10);
        var min = Number($field.attr('min'));
        var max = Number($field.attr('max'));

        //取得校验结果
        var validity = this.createValidity({field: $field[0], valid: true});

        //验证长度
        if (!isNaN(maxLength) && value.length > maxLength) {
            validity.valid = false;
            validity.tooLong = true;
        }
        if (!isNaN(minLength) && value.length < minLength) {
            validity.valid = false;
            validity.tooShort = true;
        }

        // TODO: 日期验证
        //最大值和最小值验证
        if (!isNaN(min) && Number(value) < min) {
            validity.valid = false;
            validity.rangeUnderflow = true;
        }
        if (!isNaN(max) && Number(value) > max) {
            validity.valid = false;
            validity.rangeOverflow = true;
        }
        //是否必须验证
        if (required && !value) {
            validity.valid = false;
            validity.valueMissing = true;
        }else if (pattern && !re.test(value) && value){ // check pattern
            validity.valid = false;
            validity.patternMismatch = true;
        }

        //校验完成，调用完成的函数
        var validateComplete = function(validity) {
            validity.errormsg = _this.getValidationMessage(validity);
            _this.markField(validity);
            $field.data('validity', validity);
            return validity;
        };
        validateComplete(validity);
    };
    /**
     * 创建校验结果对象
     * @param validity
     */
    Validator.prototype.createValidity = function(validity) {
        return $.extend({
            tooShort: validity.tooShort || false,
            patternMismatch: validity.patternMismatch || false,
            rangeOverflow: validity.rangeOverflow || false, // higher than maximum
            rangeUnderflow: validity.rangeUnderflow || false, // lower than  minimum
            valueMissing: validity.valueMissing || false,
            stepMismatch: validity.stepMismatch || false,
            tooLong: validity.tooLong || false,
            typeMismatch: validity.typeMismatch || false,
            valid: validity.valid || true
        }, validity);
    };

    /**
     * 校验结果显示，调用options中的函数，可以自定义
     * @param validity
     */
    Validator.prototype.markField = function(validity) {
        var options = this.options;
        var flag = 'mark' + (validity.valid ? '' : 'In') + 'Valid';
        options[flag] && options[flag].call(this, validity);
    };

    /**
     * 获取校验错误声明
     * @param validity
     * @returns {*|undefined}
     */
    Validator.prototype.getValidationMessage = function(validity) {
        var messages = Validator.validationMessages;
        var error;
        var message;
        var placeholder = '%s';
        var $field = $(validity.field);

        // get error name
        $.each(validity, function(key, val) {
            // skip `field` and `valid`
            if (key === 'field' || key === 'valid') {
                return key;
            }
            // W3C specs error type
            if (val === true) {
                error = key;
                return false;
            }
        });

        message = messages[error] || undefined;

        if (message && Validator.ERROR_MAP[error]) {
            message = message.replace(placeholder,
                $field.attr(Validator.ERROR_MAP[error]) || '规定的');
        }
        return message;
    };

    /**
     *
     * @returns {*}
     */
    Validator.prototype.isFormValid = function() {
        var formValidity = this.validateForm();
        if (!formValidity.valid) {
            return false;
        }
        return true;
    };

    /**
     *
     * @returns {{valid: boolean, validity: Array}}
     */
    Validator.prototype.validateForm = function() {
        var _this = this;
        var $element = this.$element;
        var options = this.options;
        var $allFields = $element.find(options.allFields);
        var valid = true;
        var formValidity = [];
        $allFields.each(function() {
            var $this = $(this);
            var fieldValid = _this.isValid(this);
            var fieldValidity = $this.data('validity');
            valid = !!fieldValid && valid;
            formValidity.push(fieldValidity);
        });

        var validity = {
            valid: valid,
            validity: formValidity
        };
        return validity;
    };
    /**
     *
     * @param field
     * @returns {boolean}
     */
    Validator.prototype.isValid = function(field) {
        var $field = $(field);
        //如果没有认证过，就要认证一次，认证过的不需要再次认证
        if ($field.data('validity') === undefined) {
            this.validate(field);
        }
        return $field.data('validity') && $field.data('validity').valid;
    };
    //定义接口
    toolbox.validate = function(form,option){
        return new Validator(form,option);
    };
}(S3);
/**
 * Created by zjfh-chent on 2016/8/10.
 */

if (!this.JSON) {
    this.JSON = {};
}
(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return this.getUTCFullYear()   + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z';
        };
        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
        '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' :
        '"' + string + '"';
    }


    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                        partial.join(',\n' + gap) + '\n' +
                        mind + ']' :
                        '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                    mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
})();