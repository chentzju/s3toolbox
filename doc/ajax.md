# ajax
通过ajax来完成前后台的数据接口调用,ajax封装后提供两个接口，由于ajax操作比较频繁，接口直接封装在S3的属性中。
ajax提供两个接口S3.ajax和S3.execjava，其中S3.ajax方法为通用的ajax调用方法，适用于所有ajax调用；
S3.execjava方法与原先工银聚平台的core.execjava功能类似，只是表达形式稍有不同，是专门用于工银聚espresso框架
前后台调用的方法。

## ajax
1. [差异](#1)
2. [函数定义](#2)
3. [使用方法](#3-execjava-ajax)

## 1.差异
ajax的调用方式与原来 var result = execjava(xxx)的调用方式稍有差异，主要表现在：

1. 使用S3命名空间,调用时需要使用S3.execjava(),S3.ajax()

2. 没有返回值，使用回调函数，返回值作为回调函数的data参数，ajax查询结束后会自动调用回调函数

3. 为了防止后台数据源错乱，appid改为必输项

## 2.函数定义

```javascript
    /**
     * ajax方法，通用，可以
     * 实现任意ajax调用
     * @param {String} async   是否异步，true 异步，false同步
     * @param {String} param   参数，json对象/html等
     * @param {String} dataType   参数类型,"json"/"html"
     * @param {Function}callback  回调函数，参数是调用返回值
     * @param {Function}onerror
     */
    var ajax = function(url,method,async,param,dataType,callback,onerror){...}

    /**
     * execjava，与S3的原execjava基本相同，稍作了修改
     * 仅用于espresso框架的后台调用
     *
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

## 3.使用方法(主要示例execjava，ajax类似)
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