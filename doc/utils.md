# utils

## 通用方法
通用方法中封装了一些在平时开发中会经常使用到的方法，并且解决了一些浏览器兼容性问题；扩展了一些IE8不支持的方法、
属性等。

utils主要包括以下接口：
```javascript
//基础
isArray(a)           //判断a是否为数组
isArrayLike(a)      //判断a是否是类数组对象，如arguments
isFunction（f)       //判断f是否为函数
isNumber(n)         //判断n是否是Number
isObject(o)             //判断o是否为对象
isPlainObject(o)        //判断o是否为纯对象，即没有构建函数，直接使用{}构造的对象
isNull(o)                   //判断对象是否为null
isUndefined(a)              //判断对象是否未定义

//设备
isIE678()                   //判断客户端是否是IE8以下的浏览器  返回true表示是
isMobile()                  //判断设备是否是移动设备

//对象
has(obj,key)                    //判断对象是否包含某属性
keys(obj)                  //返回对象所有属性，返回格式为数组
values(obj)             //返回对象所有的值，用数组表示
extend(obj,context)         //扩展一个对象,把context对象的key复制到obj对象
clone(obj)              //克隆一个对象

//数组
forEach（arr,fun)        //对数组的每一个对象执行函数fun
```

同时，为了兼容IE8，utils扩展了一些特殊的对象属性：
```javascript
String.prototype.trim     //用来消除String前后的空格
Array.prototype.forEach    //对数组的每一个元素执行参数中设定的函数
Array.prototype.filter      //对数组的每一个元素执行判断，筛选出返回true的所有元素，组成一个新数组
Array.prototype.some       //对数组的每一个元素执行判断，只要有一个返回true，就返回true
Array.prototype.map        //对数组的每一个元素执行参数中设定的函数，并将返回值组成一个新的数组
```