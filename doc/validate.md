# validate

表单验证工具的作用是根据HTML标签中设定的规则，对表单内的输入进行验证，如果出错则返回错误信息，如果正确则允许调用预先设定的函数。
表单验证工具封装在S3.validate属性中，对外只有一个S3.validate接口，通过调用该接口来设置表单验证。


## Validator

1. [设定验证的类型](#1)
2. [接口设定](#2)
3. [使用方法](#3)

## 1.设定验证的类型

1.input标签的type属性

input标签的type可设定的目前有3种，分别为：email,number,mobilephone，后续可是需求添加。
写法为：

```javascript
<input type = "number" >   //必须是数字 可以是小数
<input type = "email" >     //必须是邮箱
<input type = "mobilephone" >   //必须是手机
```

2.input标签的指定属性

在input标签内设置的特殊标签属性也可以起到表单验证的设定，分别有

       minlength = "x"  : 设定最小输入字符数   错误提示：至少填写 x 个字符
       maxlength = "x"  : 设定最大输入的字符数  错误提示：最多填写 x 个字符
       max = "x"  : 最大的输入数字，支持小数      错误提示： 请填写小于等于 x 的数值
       min = "x"   : 最小的输入数字，支持小数     错误提示：请填写大于等于x的数值
       required    : 非空                          错误提示：必须填写该字段
       pattern = "正则表达式" : 根据正则表达式匹配输入   错误提示：请按照要求的格式填写
       equalTo = "#id"   : 主要用来验证再次输入密码，属性值为第一次输入密码的<input>标签的id选择器

## 2.接口设定
```javascript
    /**
     * 验证函数对象
     * @param form  表单对象 也可以是div
     * @param options  可选配置，一般只需要配置前两个即可
     *
     * example:
     *  options = {
     *       onsuccess:function(){},  //验证通过后的回调函数
     *       submitButton:button,   //如果form不是表单，button不会自动提交，因此需要指定这个被点击后触发校验的按钮
     *       patterns:{} //如果对当前的type='number'或者mobilephone或者email校验规则不满意，可以自己写pattern 一般用不到
     *       markValid:function(validity){}    //如果对目前的校验成功的样式变化效果不满意，可以重新定义
     *       markInValid:function(validity){}  //如果对目前的校验失败样式变化不满意，可以重新定义
     */
    S3.validate(form,options)
```
## 3.使用方法
样例：

```javascript
    var form = document.getElementById("validetetest");
    var button = form.getElementById('button');
    var submitToJava = function (){
            //S3.execjava(bean,param,callback(){
            //  do something
            //
            // },true)
    };

    S3.validate(form,{
            onsuccess:function(){
                submitToJava();
            },
            submitButton:button
    });
```