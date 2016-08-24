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
                for(key in obj){
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
            var proto, ctor, o = {};
            if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
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
            return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
        };

        /**
         * 返回对象的属性数组
         * @param obj
         * @returns {Array}
         */
        var keys = function (obj) {
            if (!isObject(obj)) return [];
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
