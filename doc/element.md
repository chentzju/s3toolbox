# element

element.js中封装了虚拟DOM的对象工具element。该模块中声明了一个虚拟的DOM对象Element。
Element对象可以以javascript对象的方式生成类似DOM结构的虚拟树，DOM处理性能
消耗比较大，在element中先通过javascript处理生成虚拟对象Element，再渲染成DOM树的处理性能比直接操作DOM更高，
逻辑上也更加容易理解。

element模块对外有2个接口,均返回一个element对象，对象含有一个属性render，render属性渲染element对象
成HTML的DOM对象。实现对象渲染为DOM对象。

## element
1. [基础定义](#1)
2. [接口定义](#2)
3. [使用方法](#3)

## 1.基础定义

对于任意一个对象，都可以用一下的虚拟对象描述
```javascript
    var obj = {
        tagName:'li',
        props:{'class':'li-active', id:'li-id'},
        children:[ 'text' ]
    }
    //或者,children也可以是标签
     var ulobj = {
            tagName:'ul',
            props:{'class':'ul-class', id:'ul-id'},
            children:[ obj ,obj]
     }
```
因此只要定义了标签名tagName，属性props，子节点children（子节点也可以是标签列表，也可以是文本），就可以通过javascript
来描述一个DOM对象。element就是基于这个基础生成的对象，Element对象的几个重要属性就是，tagName,props,children
（对应的，子节点也可以是Element，也可以使文本）。所以，只要定义了正确的obj的层级关系，就可以生成一个虚拟的DOM树，
从而渲染成页面DOM。

## 2.接口定义
```javascript
    /**
     * 基本转换，只进行一次初步封装,返回一个Element对象，因此需要指明标签的tagName,props和children
     * @param tagName  DOM树的标签名 string   例如： 'li'
     * @param props   DOM标签的属性列表  Object { 'class':"xxxx" ,id :"id"}
     * @param children  对象的内容 Array  [{Element},"xxxx"]  接受Element对象或者文本
     * @returns {Element}
     */
    S3.element(tagName,props,children)  //浅度转换
    /**
     * 深度转换，对整个对象进行遍历，遇到children时，会不断遍历下去，迭代生成一个Element对象
     * @param obj       标签
     * @returns {Element}
     */
    S3.element.makeElement(obj)  //深度转换

    /**
    * Element对象的属性
    * 渲染Element对象为DOM对象
    */
     S3.element(tagName,props,children).render()
     S3.element.makeElement(obj).render()
```

## 3.使用方法
样例:

```javascript
var el = S3.element;  //获取S3.element虚拟DOM对象接口

//每一个标签都要调用S3.element才能生成虚拟对象树
var ul = el('ul',{id:'list'},[
                el('li',{class:'item'},['Item 1']),   //接受Element对象  需要先封装返回一个Element
                el('li',{class:'item'},['Item 2'])
         ]);   //Element {tagName: "ul", props: Object, children: Array[2], key: undefined, count: 4}

//上面的，直接采用深度转换接口
var obj = {
    tagName:'ul',
    props:{id:'list'},
    children:[
            {tagName:'li',props:{class:'item'},children:['Item 1']},   //没有像上面一样调用el先封装成Element
            {tagName:'li',props:{class:'item'},children:['Item 2']}     //没有像上面一样调用el先封装成Element
         ]}
var ul2 = el.makeElement(obj);   //深度封装

//渲染
var html = ul.render();  //  <ul id="list"><li class="item">Item 1</li><li class="item">Item 2</li></ul>
//等价于 var html = ul2.render();

//插入到页面
document.body.appendChild(html);
```