/**
 * ajax.js 实现ajax调用，综合原coresupport.js和core.js
 * Created by zjfh-chent on 2016/8/4.
 */
+function(toolBox){

    /**
     * ajax方法，通用
     * @param {String} url
     * @param {String} method
     * @param {String} async
     * @param {String} param
     * @param {String} dataType
     * @param {Function}callback
     * @param {Function}onerror
     */
    var ajax = function(url,method,async,param,dataType,callback,onerror){
        param = param || "";
        async = async || true;      //异步优先
        method = method || "POST";  //安全优先
        dataType = dataType || "json";
        try {
            $.ajax({
                type: method,
                url: url,
                async: async,
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                data:param,
                cache:false,
                dataType: dataType,
                success: function(data){
                    toolBox.utils.isFunction(callback) && callback(JSON.parse(data));
                },
                error: function(){
                    toolBox.utils.isFunction(callback) && onerror();
                },
                timeout:3000
            });
        }catch(e){
            throw new Error(e);
        }
    };

    //为S3开发的代码
    var dataSetIdList = "__ids";
    var dataSetParams = "__params";
    var dataSetAppId = "__appId";

    function testConfig(){
        if(!toolBox.utils.isUndefined(S3Config)){
            var custId = S3Config.getConfig("s3_custId");
            var rootPath = S3Config.getConfig("s3_root");
            return {
                custId:custId,
                rootPath:rootPath
            };
        }else{
            return null;
        }
    }
    /**
     * 应该跳转到某个静态errorinfo页面，
     * 如果没有定义处理系统错误的代码，则弹出报错
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
     * execjava，与S3的execjava类似  需要S3config支持
     * @param id            后台路由
     * @param param         参数
     * @param appId         应用编号
     * @param callback      回调函数
     * @param onError   错误处理
     * @param async   异步标识
     * @param httpMethod    调用方式
     * @param uri           调用路径
     */
    var execjava = function(id,param,appId,callback,onError,async,httpMethod,uri){
        //查询是否有S3的定义
        var config = testConfig();
        if(!config){
            throw new Error("No S3Config detected!! Please make sure S3Config.php is properly included.");
            return false;
        }
        //如果没有custId和rootPath 无法进行了
        //id必输
        if(config.custId == null || config.rootPath == null || !id)
            return false;
        //如果是S3，那没问题
        appId = appId || custId;
        //默认POST
        httpMethod = httpMethod || 'POST';
        //默认异步调用
        async = async || true;
        //如果没有地址，默认是S3指定
        if(!uri)
            uri = config.rootPath + '~main/ajax.php';
        //如果没有指定系统错误处理函数,则使用默认函数
        if(!onError)
            onError = localOnError;

        //处理参数
        var paramObj = treatParams(param);
        var paramStr = dataSetIdList + '=' + encodeURIComponent(id) + '&' + dataSetParams + '=' + encodeURIComponent(JSON.stringify(paramObj)) + '&'+dataSetAppId+'=' + encodeURIComponent(appId);
        if(paramStr.indexOf('__port=') < 0){
            paramStr += "&__port=" + location.port;
        }
        var dataType = "html";
        
        try{
            ajax(uri, httpMethod, async, paramStr,dataType, callback,onError);
        }catch(e){
            onError(e);
        }

    };
    toolBox.ajax = ajax;
    toolBox.execjava = execjava;
}(S3);