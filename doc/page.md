# page

page页码组件，主要实现页面上数据页码的管理，通过调用页面插件，可以轻松管理页面上的table页码。页码管理封装在S3.page中，并
只对外提供一个S3.page接口，该接口返回一个Page对象，对象包含1个setPage属性，用来跳转到指定页码。

## page
1. [接口设定](#1)
2. [使用方法](#2)

## 1.接口调用

当外部代码需要生成一个page组件时，通过S3.page(container,callback,options)接口调用，得到一个绘制好的page组件，
并将这个组件的Page对象返回。该对象自主封装了点击翻页的响应功能，因此无需再次设定页码，只需要设定点击的callback事件即可，callback事件函数的
callback默认参数是当前点击的页码。

如果需要手动设置页码，也可以通过返回的Page对象的setPage(page)属性来实现。

options默认参数
      currentpage: 1,    表示当前的页码是第1页
      pagecount: 10      表示页码的总数共10页

```javascript
        /**
         * 页码组件
         * @param container
         * @param callback
         * @param option
         * @returns {Page}
         */
         page(container,callback,options)
```

## 2.使用方法

样例：

```javascript
var container = document.getElementById('container');
//定义组件  设定点击页码的回调函数和属性选型
var pageClick = function(page){
        //加载这一页的数据
}
//一共30页
var options = {
        pagecount: 30
}
//生成组件
var page = S3.page(container,callback,options); //在container元素对象中创建一个页码组件，并返回一个对象

//不建议使用，但是如果有特殊需求，可以使用
//跳转到第8页
page.setPage(8);
```