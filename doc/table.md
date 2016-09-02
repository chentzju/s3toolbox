# table

表格插件通过传入的数据和配置，生成一个自定义的表格，表格插件基于element虚拟DOM，可以无限制任意扩展定制表格的
内容，但参数的格式须遵守element的参数规范。

表格插件封装在S3.table中，对外只提供一个table接口，生成一个表格,并返回一个Table对象的实例，该实例有一个setData属性，能够
在保持表头和表格配置不变的情况下，更新表体的数据。

## Table
1. [接口设定](#1)
2. [使用方法](#2)

## 1.接口设定

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
     table.setData(data)   属性
```


## 2.使用方法

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