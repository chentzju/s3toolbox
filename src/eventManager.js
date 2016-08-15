/**
 * Event Manager 事件管理器
 */
+function(toolBox){

    var types =['blur','focus','click','dbclick','mouseover','mousedown','mouseup','mousemove','mouseout','mouseenter','mouseleave','change','load','unload','resize','scroll','select','submit','keydown','keypress','keyup','error'];

    /**
     * 满足浏览器兼容性的事件绑定函数
     * @param element
     * @param type
     * @param handler
     */
    var addHandler = function(element,type,handler){
      if(element.addEventListener){
          element.addEventListener(type,handler,false);
      }else if(element.attachEvent){
          element.attachEvent("on"+type,handler);
      }else{
          element["on"+type] = handler;
      }
    };

    /**
     * 事件解除绑定，考虑浏览器兼容性
     * @param element
     * @param type
     * @param handler
     */
    var removeHandler = function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent(type,handler);
        }else{
            element["on"+type] = null;
        }
    };

    /**
     * @returns {Event|*}
     */
    var getEvent = function(event){
        return event ? event : window.event;
    };

    /**
     * 获取当前事件的节点
     */
    var getTarget = function(event){
        return event.target || event.srcElement;
    };

    /**
     * 停止冒泡
     * @param event
     */
    var stopPropagation = function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    };
    
    /**
     * 关闭默认事件
     * @param event
     */
    var preventDefault = function(event){
        if(event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
    }

    /**
     * 初始化事件绑定,通过检测元素的属性来完成绑定事件
     */
    var init = function(){
        var evt,target,f;

        //正则表达式，匹配函数
        var pattern = /[a-zA-Z0-9-_]\([a-zA-Z0-9-_]*\)$/
        types.forEach(function(item){
            $("["+item+"]").each(function(){
                var fn = $(this).attr(item);
                $(this).on(item,function(){
                    if(pattern.test(fn))
                        eval(fn);
                    else{
                        evt = getEvent(event);
                        target = getTarget(evt);
                        f = fn+"(target)";
                        eval(f);
                    }
                })
            })
        });
    };

    /**
     * 添加事件类型
     * @param type
     */
    var addTypes = function(type){
      types.push(type);
    };

    toolBox.eventManager = {
        init:init,
        addTypes:addTypes,
        addHandler: addHandler,
        removeHandler:removeHandler,
        getEvent:getEvent,
        getTarget:getTarget,
        stopPropagation:stopPropagation,
        preventDefault:preventDefault
    };
}(S3);