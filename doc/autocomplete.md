
## 自动补全autocomplete
autocomplete的功能是对指定的输入框input元素绑定autocomplete功能，每次当该输入框中输入内容后，会调用绑定的数据读取函数
callback，并将输入框的内容作为输入参数，callback返回的后台数据，将作为搜索结果展示在列表中，并供用户选择。

autocomplete功能封装在S3.autocomplete对象中，并对外提供一个autocomplete接口。

## autocomplete
1. [函数定义](#1)
2. [使用方法](#2)

## 1.函数定义

```javascript
    /**
     * autocomplete函数，实现某个输入框的自动补全，只要设置相应的参数即可
     * @param inputElement     需要实现自动补全的input元素
     * @param callback      回调函数，必须返回一个数组
     * @param options       参数设定，暂时只有选择框宽度一个选项  options = {width:'300px'}
     * @returns {boolean}
     */
    S3.autocomplete(element,callback,options);
```

## 2.使用方法

对于页面中的input元素
```
<input id="inputText" type="text">
```

可以这样绑定autocomplete
```javascript
    var input = document.getElementById('inputText');
    var callback = function(inputvalue){
         switch(inputvalue){
            case "a":
                return [1,2,3,4,5,6,7];
                break;
            default:
                return ["a","b","c","d"];
                break;
         }
    }
    //绑定autocomplete
    S3.autocomplete(input,callback,{})
```