/**
 * Created by zjfh-chent on 2016/12/16.
 */
(function(toolbox){
    var CookieStorage  = function(maxage,path){
        var cookie = (function(){
            var cookietemp = {};
            var all = document.cookie;
            if(all === "") return cookietemp;
            var list = all.split("; ");
            for(var i=0;i<list.length;i++){
                var cookie = list[i];
                var p = cookie.indexOf("=");
                var name = cookie.substring(0,p); //cookie name
                var value = cookie.substring(p+1);  //cookie value
                value = decodeURIComponent(value);
                cookietemp[name] = value;
            }
            return cookietemp;
        }());

        //length
        var keys = [];
        for(var key in cookie) keys.push(key);
        this.length = keys.length;

        //key
        this.key = function(n){
            if(n<0 || n>=keys.length) return null;
            return keys[n];
        };

        this.getItem = function(key){
            return cookie[key] || null;
        };

        this.setItem = function(key,value){
            if(!(key in cookie)){
                keys.push(key);
                this.length++;
            }

            cookie[key] = value;

            var localstr = key + "=" + encodeURIComponent(value);
            //属性 暂不考虑
            document.cookie = localstr;
        };
        this.removeItem = function(key){
            if(!(key in cookie)) return;

            delete cookie[key]; //对object去掉属性

            for(var i = 0;i < keys.length;i++){
                if(keys[i] === key){
                    keys.splice(i,1);
                    break;
                }
            }

            this.length--;    //cookie 个数--

            document.cookie = key + "=; max-age=0";
        };
    };
    var cookieStorage = new CookieStorage();

    toolbox.istore =  {
        get:function(key){
            if(sessionStorage)
                return sessionStorage.getItem(key);
            else
                return cookieStorage.getItem(key);
        },
        set:function(key,value){
            if(sessionStorage)
                sessionStorage.setItem(key,value);
            else
                cookieStorage.setItem(key,value);
        },
        remove:function(key,value){
            if(sessionStorage)
                sessionStorage.removeItem(key);
            else
                cookieStorage.removeItem(key,value);
        }
    };
})(S3);