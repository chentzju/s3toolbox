/**
 * Created by zjfh-chent on 2016/8/16.
 */
+function(toolbox){

    /**
     * 生成菜单，返回一个菜单Element对象
     * @param list  菜单数据
     * @param i 层级
     */
    var generatorMenu = function(list,i){
        var i = i || 0;
        var obj ={
            tagName:'ul',
            props:{'class':'menu-list-level'+i},
            children:[]
        };
        if(!list && !toolbox.utils.isArray(list)){
            list = [];
        }
        list.forEach(function(li){
            var liobj = {
                tagName:'li',
                props:{'class':'menu-content-level'+ i},
                children:[]
            };
            if(toolbox.utils.isPlainObject(li)){
                if(li['title']){}
                    liobj.children.push({
                       tagName:'div',
                       props:{'class':'menu-title-level'+ (i+1)},
                       children:[li['title']]
                    });
                if(li['content'] && toolbox.utils.isArray(li['content'])){
                    liobj.children.push(generatorMenu(li['content'],i+1));
                }
            }
            else{
                    liobj.children.push(li)
            }
            obj.children.push(liobj);
        });

        return toolbox.element.makeElement(obj);
    };



    var options = {
        onclick:function(target){
            if($(target).attr("class").indexOf('title-level') != -1){
                var ul = $(target).parent().find('ul');
                if(ul.hasClass('active')){
                    ul.removeClass('active');
                    ul.slideUp();
                }else{
                    $('.menu-list-level0 .active').removeClass('active').slideUp();
                    ul.addClass('active').slideToggle();
                }
            }else{
                options.callback(target);
            }
        },
        callback:function(){

        }
    };

    /**
     * 渲染菜单
     * @param container
     * @param list
     * @param callback
     */
    var renderMenu = function(container,list,callback){
        container.appendChild(makeMenu(list,callback));
    };
    /**
     * 生成菜单
     * @param obj
     * @param callback
     * @returns {String|Element|*}
     */
    var makeMenu = function(obj,callback){
        var container = document.createElement('div');
        if(toolbox.utils.isPlainObject(obj)){
            if(obj['title']){
                var title = toolbox.element('div',{'class':'menu-title-level0'},[obj['title']]).render();
                container.appendChild(title)
            }
            if(toolbox.utils.isArray(obj.content)){
                var menu = generatorMenu(obj.content).render();
                if(typeof callback == 'function')
                    options.callback = callback;
                toolbox.eventManager.addHandler(menu,'click',function(){
                    var evt = toolbox.eventManager.getEvent();
                    var target = toolbox.eventManager.getTarget(evt);
                    options.onclick(target);
                });
                container.appendChild(menu);
            }
        }
        return container;
    };


    S3.menu = {
        makeMenu:makeMenu,
        renderMenu:renderMenu
    }
}(S3);