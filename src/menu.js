/**
 * Created by zjfh-chent on 2016/8/16.
 */
+function(toolbox){
    /**
     * 生成菜单，返回一个菜单HTML对象
     * @param array
     * @param callback
     */
    var makeMenu = function(array,callback){
        if(!toolbox.utils.isArray(array))
            return null;
        var menuNode = document.createElement("ul");
        menuNode.setAttribute('class','menu-list');
        var content,title,child,body;
        array.forEach(function(list){
            content = document.createElement('li');
            if(list['title']) {
                title = document.createElement('div');
                title.setAttribute('class','menu-title');
                title.innerHTML = list.title;
                content.appendChild(title);
            }
            body = document.createElement('ul');
            body.setAttribute('class','menu-content');
            if(list.content && toolbox.utils.isArray(list.content)){
                list.content.forEach(function(item){
                    child = document.createElement('li');
                    child.innerHTML = item;
                    body.appendChild(child);
                })
            }else{
                child = document.createElement('li');
                child.innerHTML = list.content;
                body.appendChild(child);
            }
            content.appendChild(body);
            menuNode.appendChild(content);
        });

        toolbox.eventManager.addHandler(menuNode,'click',function(){
            var evt = toolbox.eventManager.getEvent(event);
            var target = toolbox.eventManager.getTarget(evt);

            if(target.getAttribute('class') && target.getAttribute('class').indexOf('menu-title') != -1){
                //如果是标题
                $(target).next().slideToggle();
            }else{
                //如果是内容
                callback(target);
            }

        },false);
        return menuNode;
    };


    /**
     * 渲染菜单
     * @param array
     * @param callback
     * @param container
     */
    var renderMenu = function(array,callback,container){
        if(toolbox.utils.isArray(array) && container != null){
            if(typeof container === "string")
                container = document.getElementById(container);
            container.appendChild(makeMenu(array,callback));
        }
    };

    S3.menu = {
        makeMenu:makeMenu,
        renderMenu:renderMenu,
    }
}(S3);