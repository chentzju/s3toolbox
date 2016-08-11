/**
 * ajax.js 实现ajax调用，综合原coresupport.js和core.js
 * Created by zjfh-chent on 2016/8/4.
 */
+function(toolBox){

    /**
     * ajax方法，通用
     * @param url
     * @param paramStr
     * @param callback
     * @param async
     * @param method
     */
    var ajax = function(url,paramStr,callback,async,method){
        if(paramStr == null)
            paramStr = "";
        if(async == null)
            async = true;      //异步优先
        if(method == null)
            method = "POST";  //安全优先
        if(paramStr.indexOf('__port=') < 0){
            paramStr += "&__port=" + location.port;
        }
        try {
            if(async){
                $.ajax({
                    type: method,
                    url: url,
                    async: async,
                    contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                    data:paramStr,
                    cache:false,
                    dataType: "html",
                    success: function(data){
                        callback(JSON.parse(data));
                    },
                    timeout:3000
                });
            }
        }catch(e){
            throw new Error(e);
        }
    };

    var dataSetIdList = "__ids";
    var dataSetParams = "__params";
    var dataSetAppId = "__appId";

    //为S3开发的代码
    var custId,rootPath;

    function testConfig(){
        if(!toolBox.utils.isUndefined(S3Config)){
            custId = S3Config.getConfig("s3_custId");
            rootPath = S3Config.getConfig("s3_root");
        }
    }
    /**
     * 应该跳转到某个静态errorinfo页面，
     * 如果没有正常跳转，则弹出报错
     * @param e
     */
    var localOnError = function (e){
        alert(e);
    };

    /**
     * 内部函数，处理参数
     * @param params
     * @returns {*}
     */
    var treatParams = function(params){
        var paramMap = {};
        if(params == null)
            return paramMap;
        if(typeof(params) == "string"){
            var pary = params.split('&');
            for(var i = 0; i < pary.length; i++){
                if(pary[i] == null || pary[i] == '')
                    continue;
                var tary = pary[i].split('=');
                var key = tary[0].trim();
                var val = tary[1];

                if(key.length == 0)
                    continue;
                paramMap[key] = val;
            }
        }else if(typeof(params) == "object"){
            paramMap = params;
        }
        return paramMap;
    };

    /**
     * execjava，与S3的execjava类似
     * @param id
     * @param param
     * @param appId
     * @param callback
     * @param onError
     * @param async
     * @param httpMethod
     * @param uri
     */
    var execjava = function(id,param,appId,callback,onError,async,httpMethod,uri){
        testConfig();
        if(custId == null || rootPath == null)
            return;
        if(!id)
            return;
        if(!appId)
            appId = custId;
        if(!httpMethod)
            httpMethod = 'POST';
        if(!async)
            async = true;
        if(!uri)
            uri = rootPath + '~main/ajax.php';
        if(!onError)
            onError = localOnError;
        var paramObj =treatParams(param);
        var paramStr = dataSetIdList + '=' + encodeURIComponent(id) + '&' + dataSetParams + '=' + encodeURIComponent(JSON.stringify(paramObj)) + '&'+dataSetAppId+'=' + encodeURIComponent(appId);
        try{
            ajax(uri, paramStr, callback, async, httpMethod);
        }catch(e){
            onError(e);
        }
    };
    toolBox.ajax = ajax;
    toolBox.execjava = execjava;
}(S3);
