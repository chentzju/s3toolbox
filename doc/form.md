# forms

表单管理主要是为了方便开发人员在处理表单的时候，能够通过调用接口，自动化填充表单，以及通过调用接口，自动化获取表单内容，
以及清空表单锁开发。表单管理封装在S3.forms对象中。

forms对象处理都依赖于表单中的元素都存在name属性，并将name属性作为与数据对象交互的键值；如果name属性不存在，
则无法检测到。

## forms
1. [接口定义](#1)
2. [受用方法](#2)

## 1.接口定义
主要包括3个方法：
```javascript
/**
 * 将数据导入表单
 * @param forms  form HTML对象
 * @param jsonObj  json数据对象
 */
S3.forms.json2form(form,data)    //将数据导入表单 接受表单对象和json格式的数据对象作为参数
 /**
  * 将form表单中的数据封装成JSON对象后返回，根据表单中标签的name属性
  * @param form   需要导出数据的表单
  * @return {}
  */
S3.forms.form2json(form)         //从表单导出数据   参数：表单对象
/**
 * 清空表单
 * @param form 表单
 */
S3.forms.clearForm(form)         //清空表单          参数：表单对象
```

## 2.使用方法
直接对对应的form执行接口方法即可。

例子：
```html
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
S3.forms.json2form(form,obj);        //json导入表单
console.log(S3.forms.form2json(form));   //表单导出json
S3.forms.clearForm(form);                //清空表单
```