/**
 * Created by zjfh-chent on 2016/8/11.
 */

+function(toolbox){


    var KEY = {
        UP: 38,
        DOWN: 40,
        RETURN: 13,
        ESC: 27,
        BACKSPACE: 8

    };

    /**
     * 单独一份拷贝 SELECTOR控件 返回一个SELECTOR对象实例，用来处理autoComplete的选择功能，
     * 每次调用autocomplete都会生成一个SELECTOR实例，所以autocomplete可以各自使用互不影响
     * @param inputElement
     * @param options
     * @returns {*}
     * @constructor
     */
    var Selector = function(inputElement,options){
        return new Selector.prototype.init(inputElement,options);
    };

    Selector.prototype = {
        /**
         * 初始化，通过构造函数调用，外部不可调用
         * @param inputElement
         * @param options
         * @returns {Selector}
         */
        init : function (inputElement,options){
            var that = this;
            var container = toolbox.element('div',
                    {
                        'class': options['class'] ? options['class']: 'autocomplete-container',
                        'style': 'display:none;position:absolute;z-index:999;left:'+options.left+'px;top:'+options.top+'px;'
                    }, []).render();
            if (options.width)
                    container.style.cssText += (';width:' + options.width+'px');
            document.body.appendChild(container);
            this.container = container;
            //绑定事件
            var em = toolbox.event;
            em.addHandler(container,'mouseover',function(event){
                var evt = em.getEvent(event);
                var target = em.getTarget(evt);
                if(!target.getAttribute('class')){
                    var list = container.getElementsByTagName('li');
                    $(container).find('.active').removeClass('active');
                    for(var i=0;i<list.length;i++){
                        if(list[i] === target){
                            that.active = i;
                            target.setAttribute('class','active');
                        }
                    }
                }
            });

            em.addHandler(container,'click',function(event){
                var evt = em.getEvent(event);
                var target = em.getTarget(evt);
                container.style.display = "none";
                if(target.tagName.toLowerCase() === 'li'){
                    inputElement.value = target.innerHTML;
                    inputElement.focus();
                }
            });
            return this;
        },
        /**
         * 隐藏属性
         * @returns {Selector}
         */
        hide:function(){
            this.container.style.display = 'none;';
            return this;
        },
        /**
         * 显示属性
         * @returns {Selector}
         */
        show:function(){
            this.container.style.display = "block";
            return this;
        },
        /**
         * 设置数据属性，接受一个数组，里面是需要展现的内容
         * @param data 这个数据是通过callback返回的，所以callback必须返回一个数组
         * @returns {Selector}
         */
        setData:function(data){
           var el = toolbox.element;
                var ul,list=[];
                data.forEach(function(item){
                    list.push(el('li',{},[item]))
                });
                ul = el('ul',{},list).render();
                ul.childNodes[0].setAttribute('class','active');
                this.container.innerHTML = "";
                this.container.appendChild(ul);
                this.active = 0;
                this.list = ul;
            return this;
        },
        /**
         * 移动选中的内容
         * @param step
         * @returns {Selector}
         */
        moveSelect:function (step) {
            var active = this.active;
            var ul = this.list;
            var list = ul.getElementsByTagName('li');
            list[active].setAttribute('class','');
            active = movePosition(active,step,list.length);
            list[active].setAttribute('class','active');
            this.active = active;

            //处理选项滚动
            var offset = 0;
            var container = this.container;
            for(var i=0;i<active;i++){
                    offset += list[i].offsetHeight;
            }
            if((offset + list[active].offsetHeight - container.scrollTop) > container.offsetHeight) {
                container.scrollTop = offset + list[active].offsetHeight - container.offsetHeight;
            } else if(offset < container.scrollTop) {
                container.scrollTop = offset;
            }
            return this;
        }
    };
    //函数，用来计算当前激活的点
    function movePosition(active,step,length) {
        active += step;
        if (active < 0) {
            active = length - 1;
        } else if (active >= length) {
            active = 0;
        }
        return active;
    }
    Selector.prototype.init.prototype = Selector.prototype;

    /**
     * autocomplete函数，实现某个输入框的自动补全，只要设置相应的参数即可
     * @param inputElement     需要实现自动补全的input元素
     * @param callback      回调函数，必须返回一个数组
     * @param options
     * @returns {boolean}
     */
    var autoComplete = function(inputElement,callback,options){
        if(!inputElement || typeof callback != 'function')
            return false;

        //取到需要绑定的元素
        inputElement = (typeof inputElement == 'string')?document.getElementById(inputElement) : inputElement;
        if(!inputElement.tagName || !(inputElement.tagName.toLowerCase() === 'input'))
                return false;

        //开始处理
        var left = inputElement.offsetLeft;
        var top = inputElement.offsetTop + inputElement.offsetHeight;
        //定制化参数，以后可以扩展
        options = options || {};
        options.left = options.left || left;
        options.top = options.top || top;
        //齐宽
        if(options.width)
            options.width = parseInt(options.width);
        else
            options.width = inputElement.offsetWidth;

        //获取一个新的selector对象
        var selector = Selector(inputElement,options);
        
        //对输入框绑定方法
        if(typeof callback == 'function'){
            var em = toolbox.event;

            //方法均是对selector对象的操作，除了在输入框输入内容

            em.addHandler(inputElement,'keyup',function(event){
                var evt = em.getEvent(event);
                switch(evt.keyCode){
                    case KEY.UP:
                        //if(selector.visible())
                        selector.moveSelect(-1,options);
                        break;
                    case KEY.DOWN:
                        selector.moveSelect(1,options);
                        break;
                    case KEY.ESC:
                    case KEY.BACKSPACE:
                        selector.hide();
                        break;
                    case KEY.RETURN:
                        selector.container.style.display = "none";
                        var ul = selector.list;
                        var list = ul.getElementsByTagName('li');
                        inputElement.value = list[selector.active].innerHTML;
                        inputElement.focus();
                        break;
                    default:
                        var text = inputElement.value;
                        if(!this.text || this.text != text){
                            //获得input的值
                            this.text = text;
                            var data = callback(text);
                            //如果callback返回格式错误，则不会显示
                            if(data && toolbox.utils.isArray(data) && data.length)
                                selector.setData(data).show()
                        }
                        break;
                }
            });
        }
    };

    S3.autocomplete = autoComplete;
}(S3);