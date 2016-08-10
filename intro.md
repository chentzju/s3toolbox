# S3ToolBox工具箱简介

S3ToolBox工具箱主要用来实现一些通用的js功能，来简化开发过程中的重复工作，工具箱按照模块开发，可扩展，主要用来完成如通用功能、通用计算、表单、事件管理等常用的模块。S3ToolBox依赖jquery,使用时，需要提前加载jquery。

本文介绍了工具箱的组成和使用方法

当前工具箱包含:

    ajax.js             管理ajax

    calculator.js       通用计算器

    eventManager.js     事件管理器

    forms.js            form表单数据

    template.js         js模板引擎

    utils.js            通用模块


## 1.ajax
通过调用ajax来完成前后台的数据调用,与原来的execjava执行效果类似,但稍有不同;

1.使用S3命名空间

2.没有返回值，返回值在回调函数的data变量中


例如：

```javascript
S3.execjava("userinfobean",param,function(data){
//do something
},true)
```

## 2.计算器
计算器提供了多种计算的通用方法，考虑到javascript使用浮点运算进行计算的精度问题，会出现0.1+0.2 = 0.30000000000000004
的极端问题，计算器接口屏蔽了这些影响，在除除法以外的计算中都确保计算精度，同时除法也确保相对精确。

计算器封装在S3.cal对象内，共包含12个方法

#### 四则运算
```
S3.cal.add(a,b)  //a+b  确保精度
S3.cal.sub(a,b)  //a-b  确保精度
S3.cal.mul(a,b)  //a*b   确保精度
S3.cal.div(a,b)  //a/b   相对精确
```
#### 金额问题
```
S3.cal.addComma(n) //增加金额的逗号 addComma(a) //1000--->1,000
S3.cal.removeComma(n)  //移除逗号 removeComma(a) //1,000--->1000
```
#### 数组运算
```
S3.cal.arrMul(a,b)      //a[0]*b[0] a[1]*b[1] ... 返回一个新数组
S3.cal.addArr(a,b)      //a[0]+b[0] a[1]+b[1] ... 返回一个新数组
S3.cal.subArr(a,b)      //a[0]-b[0] a[1]-[1] ... 返回一个新数组
S3.cal.arrAddNum(a,n)    //a[i]+n ---b[i]  对每一项加上同一个数
S3.cal.arrSubNum(a,n)    //a[i]-n ---b[i]   对每一项减去同一个数
S3.cal.arrMulNum(a,n)    //a[i]*n ---b[i]   对每一项乘以同一个数
```
例子：
```
var a = 0.2;
var b = 0.3;
S3.cal.add(0.2,0.3)  //return 0.5
var c = [0.1,1];
S3.cal.arrAddNum(c,a)  //return [0.3,1.2]
```

## 3.事件管理器
事件管理器实现事件的绑定、解绑、事件对象的获取、目标获取以及事件对象管理。同事支持页面属性自动绑定事件。事件的方法封装在
S3.eventManager对象中，总共包含如下方法：
```
init()              //初始化绑定，搜索页面属性并绑定相关事件
addTypes(type)     //增加自动绑定的事件类型
addHandler(element,type,handler)         //绑定事件
removeHandler(element,type,handler)       //解除绑定
getEvent(event)            //获取当前事件
getTarget(event)           //获取触发事件的对象
stopPropagation(event)     //关闭事件冒泡  通常在父对象存在事件委托的时候使用
preventDefault(event)      //关闭默认事件， 通常用在禁用<a>标签的href跳转
```

#### 1.自动事件绑定

当前支持的事件类型有:
```
'blur','focus','click','dbclick','mouseover','mousedown','mouseup','mousemove','mouseout','mouseenter','mouseleave',
'change','load','unload','resize','scroll','select','submit','keydown','keypress','keyup','error'
```

例子：

在HTML中写明绑定类型和绑定事件
```
<input type = "text" focus="helloworld()">
<button  click = "clickfunction">点击调用clickfunction</button>
```
在javascript中声明被调用的函数，并调用init方法
```
var helloworld = function(){
    console.log("hello world");
};
var clickfunction = function(){
    cconsole.log("点击了button");
};
S3.eventManager.init();
```

#### 2.绑定和解除事件
```
var element = document.getElementById("myele");
var handler = function(){
    //do something
};
S3.eventManager.addHandler(element,"click",handler);
S3.eventManager.removeHandler(element,"click",handler);
```

#### 3.事件对象
```
var em = S3.eventManager;
em.addHandler(element,"click",function(){
    var evt = em.getEvent();          //获取事件
    var target = em.getTarget(evt);   //获取触发事件的对象
    em.stopPropagation(evt);            //禁止事件冒泡
    em.preventDefault(evt);             //禁止默认事件
});
```

## 4.表单管理
表单管理主要是为了方便开发人员在处理表单的时候，能够通过调用接口，自动化填充表单，以及通过调用接口，自动化获取表单内容，
以及清空表单锁开发。表单管理封装在S3.forms对象中。

主要包括3个方法：
```
json2form(form,data)    //将数据导入表单 接受表单对象和json格式的数据对象作为参数
form2json(form)         //从表单导出数据   参数：表单对象
clearForm(form)         //清空表单          参数：表单对象
```

例子：
```
var form = document.getElementById('formid');
S3.form.json2form(form,obj);        //json导入表单
console.log(S3.form.form2json(form));   //表单导出json
S3.form.clearForm(form);                //清空表单
```
## 5.模板引擎
S3ToolBox对原来我们熟悉的arttemplate进行了封装，精简了里面的一些不常用操作，保留原来的核心，封装在S3.template对象中，用
法与原来的arttemplate用法一直，只不过在S3命名空间下。

例如:
```
<div id = "temp"></div>
<script type="text/html" id = "template">
    <div>
        <h6><%= data.title%></h6>
        <ul>
            <%
            var list = data.list;
            for(var i=0;i<list.length;i++){
            %>
            <li>
                <%= list[i]%>
            </li>
            <% } %>
        </ul>
    </div>
</script>
```

```
var template = document.getElementById('template');
var dataobj = {title:'haha',list:['111',"222","333"]};
var html = S3.template("template",{data:dataobj}); //模板id和数据对象
document.getElementById('temp').innerHTML =html;
```

## 6.通用方法
通用方法中封装了一些在平时开发中会经常使用到的方法，主要包括
```
isArray(a)           //判断a是否为数组
isNumber(n)         //判断n是否是Number
isObject(o)             //判断o是否为对象
isPlainObject(o)        //判断o是否为纯对象，即没有构建函数，直接使用{}构造的对象
isNull(o)                   //判断对象是否为null
isUndefined(a)              //判断对象是否未定义
dateCompare(date1,date2)    //判断date1是否小于date2   小于返回true
isMobile()                  //判断设备是否是移动设备

has(obj,key)                    //判断对象是否包含某属性
keys(obj)                  //返回对象所有属性，返回格式为数组
values(obj)             //返回对象所有的值，用数组表示
extend(obj,context)         //扩展一个对象,把context对象的key复制到obj对象
clone(obj)              //克隆一个对象

forEach（arr,fun)        //对数组的每一个对象执行函数fun
some(arr,fun)           //对数组的每一个对象执行函数fun，只要一个返回true，就是true
```