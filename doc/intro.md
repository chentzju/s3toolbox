# S3ToolBox工具箱简介

S3ToolBox工具箱主要用来实现一些开发中通用的js功能，从而简化开发过程中的重复或复杂工作。工具箱按照模块化开发，内部
的每个模块单独定义，并作为S3ToolBox的属性绑定到工具箱，每个模块对外提供一定的接口供调用。工具箱可自定义扩展，可
以通过添加模块的方式完善工具箱。S3ToolBox使用S3作为命名空间，内部工具均为S3的属性。

##### (*)S3ToolBox依赖jquery,使用时，需要提前加载jquery。

## S3ToolBox
1. [基础设定](#1)
2. [S3ToolBox工具箱内容](#2)
3. [扩展S3ToolBox](#3-s3toolbox)

## 1.基础

S3工具箱在加载时会自动加载自带的CSS，CSS定义了S3自带的autocomplete,menu,page的样式效果，
如果项目不需要S3的CSS样式表设定，则需要在页面加载完成后，设定S3的CSS开关为关闭。关闭后，项目组需要自己
设定这些样式。

```javascript
    //关闭S3自带CSS
    S3.cssOff();

    //打印版本
    S3.version();   //"1.0"
```
使用S3ToolBox，需要引用jquery和s3toolbox两个javascript文件
```html
    <script src = "path/jquery.min.js"></script>
    <script src = "path/s3toolbox.min.js"></script>
```


## 2.工具箱内容（点击链接查看每个属性的用法）:
|   工具   | 功能     |
| -------- | -------- |
| [ajax.js](ajax)                  | 处理前后台的ajax调用   |
| [autocomplete.js](autocomplete)  | 自动补全工具，实现搜索框的搜索结果自动补全   |
| [calculator.js](calculator)      | 通用的计算器，处理一些基础的计算，解决javascript的计算精度问题  |
|[element.js](element)       |      虚拟Dom对象工具,用来生成虚拟DOM对象，提高性能，并能渲染成真实DOM|
|[eventManager.js](eventManager)    |  事件管理工具，提供兼容浏览器的事件管理功能，并提供自动绑定事件的功能|
|[forms.js](forms)           | form表单工具，实现json数据类型到form表单之间的转换|
|[menu.js](menu)           |  菜单插件，根据数据结构生成菜单|
|[page.js](page)         | 页码插件，实现一个能够按需翻页的页码插件|
|[table.js](table)       | 表格插件，能够更具定义生成任意类型的表格|
|[template.js](template)       |  js模板引擎，art模板引擎去掉一些不常用功能后封装，实现原模板引擎的渲染功能|
|[validate.js](validate)       |  表单验证工具，对表单进行验证，并返回验证结果|
|[utils.js](utils)     |  通用模块，一些通用的判断，以及一些浏览器兼容的解决|

## 3.扩展S3ToolBox

扩展S3ToolBox的方式就是把S3作为扩展对象，对S3进行属性的扩展，建议使用模块化的扩展方式。

```javascript
+function(tb){
    //定义内部的类或对象
    var obj = {};
    //obj.xxx = xxx

    //obj.sss = sss

    tb.props = obj
}(S3)
```

也可以直接通过设置属性值来扩展(不推荐)

例如：

```javascript
//扩展属性
S3.props = function(){}
```
