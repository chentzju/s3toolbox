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
        },
        isMobile:function (){
            var sUserAgent = navigator.userAgent;
            if (sUserAgent.indexOf("Android") > -1 ||
                sUserAgent.indexOf("iPhone") > -1 ||
                sUserAgent.indexOf("iPad") > -1 ||
                sUserAgent.indexOf("iPod") > -1 ||
                sUserAgent.indexOf("Symbian") > -1){
                return true;
            }
            return false;
        }
    };

    toolBox.utils = Utils;
}(S3);
