/**
 * 按钮防重复提交功能
 */
+function(tooBox){

    /**
     *  防止重复提交，锁定按钮（支持A和button）
     * param: obj[Object]-需要锁定的jQuery对象，必输
     *		  fn[Object]-需要bind的提交事件的函数 (若是用bind绑定函数click事件，必输 )
     * return:
     */
    var lock= function(obj,disabled,fn){
        var obj = $(obj);
        var disabled = true;
        var reSubmit = function(){
            alert('请不要重复提交！');
        };

        if(fn){
            obj.unbind("click");
            //保存click事件吗，以便后续解锁重新绑定
            if(typeof fn == "function"){
                obj.attr("lockBindFn",fn.name);
            }
        }else{
            fn = obj.attr("onclick");
            if(fn){
                obj.attr("onclick","");
                //保存click事件吗，以便后续解锁重新绑定
                obj.attr("lockClickFn",fn);
            }else if(obj.is("a")){
                //不存在click事件，判定为用href实现的a标签
                fn = obj.attr("href");
                obj.attr("href","javascript:;");
                obj.attr("lockHrefFn",fn);
            }
        }

        if(disabled){
            if(obj.is("button") || obj.is("input")){
                obj.attr("disabled",true);
            }else if(obj.is("a")){
                obj.addClass("gray");
            }
            obj.attr("lockDisabled",disabled);
        }else{
            obj.bind("click",reSubmit);
        }
    };
    /**
     * 防止重复提交，解除锁定按钮（支持A和button）
     * param: obj[Object]-需要解除锁定的jQuery对象，必输
     * 		  fn[Object]-需要bind的提交事件的函数， 若是用bind绑定函数click事件，必输
     * return:
     */
    var unlock = function(obj,fn){
        var obj = $(obj);

        var disabled= obj.attr("lockDisabled");
        if(disabled){
            if(obj.is("button") || obj.is("input")){
                obj.attr("disabled",false);
            }else if(obj.is("a")){
                obj.removeClass("gray");
            }
        }else{
            //解除绑定的重复提交提示
            obj.unbind("click");
        }

        //是否是bind事件，若是，重新bind
        if(obj.attr("lockBindFn")){
            if(typeof fn == "function"){
                obj.bind("click",fn);
            }
            return;
        }

        //是否是onclick事件，若是，重新添加onclick
        fn = obj.attr("lockClickFn");
        if(fn){
            obj.attr("onclick",fn);
            return;
        }

        //是否是href事件，若是，重新添加href
        fn = obj.attr("lockHrefFn");
        if(fn){
            obj.attr("href",fn);
        }
    };
    var btn = {
        lock:lock,
        unlock:unlock
    };

    tooBox.btn = btn;
}(S3);
