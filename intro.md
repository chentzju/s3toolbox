# S3ToolBox工具箱简介

S3ToolBox工具箱主要用来实现一些通用的js功能，来简化开发过程中的重复工作，工具箱按照模块开发，可扩展，主要用来
完成如通用功能、通用计算、表单、事件管理等常用的模块。S3ToolBox依赖jquery,使用时，需要提前加载jquery。

本文介绍了工具箱的组成和使用方法

当前工具箱包含:
    ajax.js             管理ajax

    calculator.js       通用计算器

    element.js          虚拟Dom对象工具

    eventManager.js     事件管理器

    forms.js            form表单数据

    menu.js             菜单插件

    page.js             页码插件

    table.js            表格插件

    template.js         js模板引擎

    utils.js            通用模块


## ajax调用
通过调用ajax来完成前后台的数据调用,ajax封装后提供两个接口，其中S3.ajax方法为通用的ajax调用方法，适用于所有ajax调用；
而execjava方法是基于espresso框架原execjava方法，合并原core.js和coresupport.js的功能，而实现的一个方法，实现的原理基
本相同，细节稍有不同。

1.使用S3命名空间,调用时需要使用S3.execjava,S3.ajax

2.没有返回值，返回值在回调函数的data变量中,所以需要使用回调函数名或匿名函数作参数

3.为了防止后台数据源错乱，appid改为必输项

#### 函数定义

```javascript
    /**
     * ajax方法，通用
     * @param url        地址
     * @param paramStr   参数
     * @param callback  回调函数
     * @param async     是否异步，true 异步，false同步
     * @param method    报文提交方式，默认POST
     */
    var ajax = function(url,paramStr,callback,async,method){...}

    /**
     * execjava，与S3的原execjava基本相同，稍作了修改
     * @param id        后台bean
     * @param param     参数对象
     * @param appId        应用编号
     * @param callback      回调函数
     * @param onError       错误处理函数
     * @param async         异步标识，默认true  默认采用异步调用
     * @param httpMethod       调用方式，默认POST
     * @param uri               调用地址，默认rootPath/~main/ajax.php
     */
    var execjava = function(id,param,appId,callback,onError,async,httpMethod,uri){...}
```
#### 函数调用(主要示例execjava)
例如：

```javascript
var param = {};
var appid = 'usermanage'
var id = "userAuthenBean.getPublicKey"
S3.execjava(id,param,appid,function(result){
        	if(result.retCode != "200"){
                $("#errorTip").show();
                $("#loginres").html(errinfo["40001"]);
                $("#validate").next().attr("src","captcha.php?'+Math.random();");
            }
            //rsa加密
            var rsakey = new RSAKey();
    		rsakey.setPublic(result.modulus,result.exponent);
    		var pwd = rsakey.encrypt(password);
            param.loginName = loginName;
            param.password = pwd.toString(16);
            ...
        },function(e){
			var uri = S3Config.getConfig("s3_root") + "~main/" + "errorInfo.php?error="+e;
			window.location.href = uri;
        })
```

也可以将回调函数和错误处理函数单独写出来
```javascript
var success = function(data){
      if(result.retCode != "200"){
            $("#errorTip").show();
            $("#loginres").html(errinfo["40001"]);
            $("#validate").next().attr("src","captcha.php?'+Math.random();");
      }
      ...
};
var onError = function(e){
    var uri = S3Config.getConfig("s3_root") + "~main/" + "errorInfo.php?error="+e;
    window.location.href = uri;
}

//再调用execjava
S3.execjava(id,param,appid,success,onError);
```

## 计算器
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

## 虚拟DOM对象
element.js中封装了虚拟DOM的对象工具element。element对象可以对DOM数以javascript对象的方式生成，并且通过render函数渲染
生成HTML的DOM对象。

element.js对外有2个接口,均返回一个element对象，对象含有一个属性render，实现Element对象渲染为DOM对象。

```javascript
    /**
     * 基本转换，只转化一次
     * @param tagName
     * @param props
     * @param children
     * @returns {Element}
     */
    S3.element(tagName,props,children)  //浅度转换
    /**
     * 深度转换
     * @param tagName
     * @param props
     * @param children
     * @returns {Element}
     */
    S3.makeElement(tagName,props,children)  //深度转换

    /**
    * 渲染Element对象为DOM对象
    */
    Element.render()
```
样例:
```javascript
var el = S3.element;  //获取S3.element虚拟DOM对象

//每一个标签都要调用S3.element才能生成虚拟对象树
var ul = el('ul',{id:'list'},[
                el('li',{class:'item'},['Item 1']),
                el('li',{class:'item'},['Item 2'])
         ]);   //Element {tagName: "ul", props: Object, children: Array[2], key: undefined, count: 4}
//上面的代码相当于
var ul2 = el.makeElement('ul',{id:'list'},[{'li',{class:'item'},['Item 1']},{'li',{class:'item'},['Item 2']}]);

//渲染
var html = ul.render();  //  <ul id="list"><li class="item">Item 1</li><li class="item">Item 2</li></ul>

//插入到页面
document.body.appendChild(html);
```

## 事件管理器
事件管理器实现事件的绑定、解绑、事件对象的获取、目标获取以及事件对象管理。同事支持页面属性自动绑定事件。事件的方法封装在
S3.eventManager对象中，总共包含如下方法：
```javascript
/**
* 核心函数，实现页面中的事件自动绑定
*/
init()              //初始化绑定，搜索页面属性并绑定相关事件
addTypes(type)     //增加自动绑定的事件类型
/**
* 满足浏览器兼容性的事件绑定函数
* @param element  元素
* @param type   事件类型  如：click
* @param handler    处理函数
*/
addHandler(element,type,handler)         //绑定事件
/**
* 事件解除绑定，考虑浏览器兼容性
* @param element    元素
* @param type   事件类型
* @param handler    处理函数
*/
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

#### 2.手动绑定和解除事件
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

## 表单管理
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
<form id = "formid">
        <input type = "text" name="name1" >
        <input name ="name2" type = "text">
        <input name = "name3" type = "checkbox" value ="aaaa">aaaa
        <input name = "name3" type ="checkbox" value ="aaab">aaab
        <input name = "name3" type ="checkbox" value ="aaac">aaac

        <input name = "name4" type = "radio" value ="aaaa">aaaa
        <input name = "name4" type ="radio" value = "aaab">aaab
        <input name = "name4" type ="radio" value = "aaac">aaac
        <select name = "name5">
                <option value="aaaa">
                    haha
                </option>
                <option value ="bbbb">
                    hehe
                </option>
                <option value ="keke">
                    keke
                </option>
        </select>
        <select name = "name6" multiple>
            <option value="aaaa">
                haha
            </option>
            <option value ="bbbb">
                hehe
            </option>
            <option value ="keke">
                keke
            </option>
        </select>
    </form>
```
```
var form = document.getElementById('formid');
var obj = {
     name1:"张三",
     name2:"历史",
     name3:['aaaa','aaac'],
     name4:'aaab',
     name5:'bbbb',
};
S3.form.json2form(form,obj);        //json导入表单
console.log(S3.form.form2json(form));   //表单导出json
S3.form.clearForm(form);                //清空表单
```

## 菜单组件
菜单组件实现一个简单的菜单，通过传入的数据对象生成一个简单的菜单。菜单组件封装在S3.menu对象中，对象包含3个属性，分别为
renderMenu,makeMenu和cssOff。作用分别是，渲染菜单到容器，制作菜单和关闭默认样式。

菜单组件提供了默认的CSS样式表，如果对默认样式不满意，可以通过设定CSS默认样式表关闭，再使用自己的设计来进行排版和样式布局。

接口
```
/**
* 渲染菜单
* @param array
* @param callback
* @param container
*/
renderMenu(array,callback,container)
/**
* 生成菜单，返回一个菜单HTML对象
* @param array
* @param callback
*/
makeMenu(array,callback)
cssOff()
```
参数类型

    renderMenu: 接受一个数组array，一个回调函数callback和一个容器container，数组要求按照如下格式:
                var menu = [
                            {title:'title1',
                                content:["content1","content2","content3"]},
                            {title:'title2',
                                content:["content2","content2","content3"]},
                        ];
                回调函数中的参数是组件被点击的时候的点击目标元素
                容器是存放菜单的地方

    makeMenu:  参数array与renderMenu相同，callback也与render相同，makeMenu返回一个组装好的组件的HTML对象

    cssOff:  关闭默认的CSS样式表，此时，需要开发者自己设置菜单的样式,需要在使用makeMenu和renderMenu之前调用才能生效

样例:
```javascript
var menu = [
         {title:'title1', content:["content1","content2","contetn3"]},
         {title:'title2', content:["content2","content2","contetn3"]},
        ];
S3.menu.renderMenu(menu,function(e){console.log("点击了"+e)},"menu");
//上面的语句，相当于
//var container = document.getElementById('menu');
//var node = S3.menu.makeMenu(menu,function(e){console.log()})
//container.appendChild(node);
```
## 页码组件
page页码组件，主要实现页面上数据页码的管理，通过调用页面插件，可以轻松管理页面上的table页码。页码管理封装在S3.page中，并
只对外提供一个S3.page接口，该接口返回一个Page对象，对象包含两个属性：init和setPage，通常init为自动调用，setPage需要主
动调用。

当外部代码需要生成一个page组件时，通过S3.page(container,callback,options)接口调用，得到一个绘制好的page组件，并将这个组件
的对象返回。该对象自主封装了点击翻页的响应功能，因此无需再次设定页码，只需要设定点击的callback事件即可，callback事件函数的
默认参数是当前点击的页码。如果需要手动设置页码，也可以通过返回对象的setPage(page)来实现。

options默认参数
      currentpage: 1,    表示当前的页码是第1页
      pagecount: 10      表示页码的总数共10页
```javascript
        /**
         * 页码组件
         * @param container
         * @param callback
         * @param option
         * @returns {*}
         * @constructor
         */
         page(container,callback,options)
```

ex:
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

## 表格插件table
表格插件通过传入的数据和配置，生成一个自定义的表格，由于表格插件基于element虚拟DOM，因此，可以无限制任意扩展定制表格的
内容，具体的格式须遵守element的参数规范。

表格插件封装在S3.table中，对外只提供一个table接口，生成一个表格,并返回一个Table对象的实例，该实例有一个setData属性，能够
在保持表头和表格配置不变的情况下，更新表体的数据。

```javascript
/**
     *
     * @param parent 父容器
     * @param data   数据 包含 表头和标题
     * {
     *      title:['title1','title2',xxx,xxx],   //表头  数组，每一行是一个string 或一个对象
     *      data:[{},{},{},{},{}]  //5行  每一行为一个对象
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
    var table = S3.table(parent,data,callback,options)   //返回一个Table对象的实例

     /**
      * 更新表体内容
      * @param data   数组[{},{},{},{}]每一行是一个对象
      * @returns {Table}
      */
    table.setData(data)
```
使用方法：

对于如下的页面容器，组织数据并生成一个表，之后更新数据
```
<div id = 'table1'></div>
```

```javascript
    //表格数据
   var data1 = {
            title: ["content1","content2","contetn3",'title4'],
            data:[
                {
                    name: {tagName:'a',props:{href:'#'},children:['链接']},
                    money:'45',
                    count:{tagName:'input',props:{type:'text',value:'50',children:[]}}
                },
                {
                    name: {tagName:'a',props:{href:'#'},children:['链接']},
                    money:'45',
                    count:{tagName:'input',props:{type:'text',value:'50',children:[]}}
                },
                {
                    name: {tagName:'a',props:{href:'#'},children:['链接']},
                    money:'45',
                    count:{tagName:'input',props:{type:'text',value:'50',children:[]}}
                }
            ]
        };
        //用来更新表体的数据
        var data2 = [
            {name:'张三',money:'25'},
            {name:'张三',money:'35'},
            {name:'张三',money:'15'}
        ];
        //表格配置
        var opt = {
            start:[
                {
                    tagName:'input',
                    props:{type:'checkbox'}
                }
            ],
            end:[
                {
                    tagName:'button',
                    props:{"class":'mybutton'},
                    children:['点击']
                },
                {
                    tagName:'button',
                    props:{"class":'mybutton'},
                    children:['点击']
                }
            ]
        };
        //生成表
        var table = S3.table('table1',data1,hello,opt);
        //刷新数据
        table.setData(data2);
```


## 模板引擎
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

## 通用方法
通用方法中封装了一些在平时开发中会经常使用到的方法，主要包括
```
isArray(a)           //判断a是否为数组
isArrayLike(a)      //判断a是否是类数组对象，如arguments
isFunction（f)       //判断f是否为函数
isNumber(n)         //判断n是否是Number
isObject(o)             //判断o是否为对象
isPlainObject(o)        //判断o是否为纯对象，即没有构建函数，直接使用{}构造的对象
isNull(o)                   //判断对象是否为null
isUndefined(a)              //判断对象是否未定义
dateCompare(date1,date2)    //判断date1是否小于date2   小于返回true
isIE678()                   //判断客户端是否是IE8以下的浏览器  返回true表示是
isMobile()                  //判断设备是否是移动设备

has(obj,key)                    //判断对象是否包含某属性
keys(obj)                  //返回对象所有属性，返回格式为数组
values(obj)             //返回对象所有的值，用数组表示

extend(obj,context)         //扩展一个对象,把context对象的key复制到obj对象
clone(obj)              //克隆一个对象

forEach（arr,fun)        //对数组的每一个对象执行函数fun
```