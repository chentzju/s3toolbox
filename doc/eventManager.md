# 事件管理 S3.event

事件管理器实现事件的绑定、解绑、事件对象的获取、目标获取以及事件对象管理。
同事支持页面属性自动绑定事件。事件的方法封装在S3.event对象中。

## event
1. [自动绑定](#1)
2. [接口定义](#2)
3. [使用方法](#3)

## 1.自动绑定
事件自动绑定的结构为S3.event.init()，该接口实现了对页面上特定标签的扫描和事件的自动绑定。

```javascript
/**
* 核心函数，实现页面中的事件自动绑定
* 根据页面中标签上指定的绑定标记，实现页面中时间的自动绑定
*/
init(selector) //初始化绑定，搜索selector选中标签的子元素的属性并绑定相关事件

addTypes(type)     //增加自动绑定的事件类型
```
目前支持自动绑定的事件类型有以下几个：
```
'blur','focus','click','dbclick','mouseover','mousedown','mouseup','mousemove','mouseout','mouseenter','mouseleave',
'change','load','unload','resize','scroll','select','submit','keydown','keypress','keyup','error'
```
如果需要添加别的，就需要调用S3.event.addTypes(typeName)来增加自动绑定的事件类型。

#### 如何绑定：

只要在标签上什么事件类型和指定的处理函数，就可以实现事件的自动绑定。

例如：某按钮事件类型是click事件，处理事件的函数是clickfunction,则在标签上如下写
```html
<button click="clickfunction()">
<button click="clickfunction">

//如果要取得点击的对象
<button click="clickfunction(e)">
```

#### 具体样例：
在HTML中写明绑定类型和绑定事件
```html
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
S3.event.init();
```

## 2.接口定义
```javascript
/**
* 满足浏览器兼容性的事件绑定函数
* @param element  元素
* @param type   事件类型  如：click
* @param handler    处理函数
*/
S3.event.addHandler(element,type,handler)         //绑定事件
/**
* 事件解除绑定，考虑浏览器兼容性
* @param element    元素
* @param type   事件类型
* @param handler    处理函数
*/
S3.event.removeHandler(element,type,handler)       //解除绑定
/**
* @returns {Event|*}
*/
S3.event.getEvent()   //获取当前触发的事件

/**
* 获取当前事件的节点
* @param event   getEvent()的返回值
* @returns {*|Object}
*/
S3.event.getTarget(event)  //获取触发事件的节点
/**
 * 停止冒泡
 * @param event
 */
S3.event.stopPropagation(event)     //关闭事件冒泡  通常在父对象存在事件委托的时候使用
/**
 * 关闭默认事件
 */
S3.event.preventDefault(event)      //关闭默认事件， 通常用在禁用<a>标签的href跳转
```
## 3.使用方法

#### 绑定和解除事件
```
var element = document.getElementById("myele");
var handler = function(){
    //do something
};
S3.event.addHandler(element,"click",handler);
S3.event.removeHandler(element,"click",handler);
```
#### 事件对象处理
```
var em = S3.event;
em.addHandler(element,"click",function(){
    var evt = em.getEvent();          //获取事件
    var target = em.getTarget(evt);   //获取触发事件的对象
    em.stopPropagation(evt);            //禁止事件冒泡
    em.preventDefault(evt);             //禁止默认事件
});
```