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
    
    toolBox.cal = calculator;
}(S3);