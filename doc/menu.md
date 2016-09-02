# menu

菜单组件实现一个简单的菜单，通过传入的数据对象生成一个简单的菜单。菜单的层级可以通过参数来设定，
生成函数中设有递归，支持无限层级的菜单。
菜单组件封装在S3.menu对象中,分别有makeMenu,renderMenu两个接口

## menu

1. [接口定义](#2)
2. [参数类型](#1)
3. [使用方法](#3)

## 1.接口定义
```
/**
* 渲染菜单，在容器中生成
* @param container   html容器
* @param obj         参数对象
* @param callback    点击菜单后回调函数
*/
renderMenu(container,obj,callback)
/**
* 生成菜单，返回一个菜单HTML对象，但不添加到页面
* @param obj   参数对象
* @param callback    点击菜单后回调函数
*/
makeMenu(array,callback)
```

## 2.参数类型
参数类型必须符合如下的结构：
title表示标题，必须为字符串；content表示内容，必须为数组。
content中的对象也可以使一个menu对象，即支持无线扩展

```
var menu = {
        title:'title1',
        content:[
            {
                title:'title2',
                content:["content2","content2","contetn3"]
            },
            {
                title:'title2',
                content:["content2","content2","contetn3"]
            },
            {
                title:'title2',
                content:["content2","content2","contetn3"]
            }
        ]
    };
```

## 3.使用方法
样例:
```javascript
var menu = {
        title:'title1',
        content:[
            {
                title:'title2',
                content:["content2","content2","contetn3"]
            },
            {
                title:'title2',
                content:["content2","content2","contetn3"]
            },
            {
                title:'title2',
                content:["content2","content2","contetn3"]
            }
        ]
    };

var menu1 =  S3.menu.makeMenu(menu);
var container = document.getElementById('menu',callback);
container.appendChild(menu1);

//上面的语句，相当于
S3.menu.renderMenu("menu",menu,callback);
```
