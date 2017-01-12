/**
 * Created by zjfh-chent on 2016/8/11.
 */
+function(toolbox){


    function getChildren(obj){
        var children = [];
        obj.forEach(function(item){
            if(item.tagName){
                item.props = item.props || {};
                item.children = utils.isArray(item.children) ? item.children : [];
                children.push(el.make(item));
            }
        });
        return children;
    }
    /**
     *  生成表头的虚拟DOM对象
     * @param data
     * @param options
     * @returns {Element}
     */
    function makeHead(data,options){
        var utils = toolbox.utils;
        var el = toolbox.element;

        if(data == null || !utils.isArray(data))
            return el("tbody",{},[]);

        //处理start  end不处理
        var rowchild = [];
        if(options.start && utils.isArray(options.start)){
            var start = options.start;
            var startChild = getChildren(start);
            rowchild.push(el('th',null,startChild));
        }

        //行的子元素
        data.forEach(function(item){
            if(utils.isPlainObject(item) && item.tagName){
                item.props = item.props || {};
                item.children = utils.isArray(item.children) ? item.children : [];
                item = el.make(item);
            }
            rowchild.push(el('th',null,[item]));
        });

        //生成行的虚拟DOM
        var tr = el('tr',{},rowchild);
        return  el('tbody',{},[tr]);
    }

    /**
     * 生成标题的虚拟DOM对象
     * @param data
     * @param options
     * @returns {Element}
     */
    function makeBody(data,options){
        var utils = toolbox.utils;
        var el = toolbox.element;

        if(data == undefined || !utils.isArray(data))
            return el('tbody',null,[]);

        //表体的子元素
        var bodychild=[];

        //对每一行
        for(var i =0;i<data.length;i++){
            var rowdata = data[i],rowchild=[];

            for(var key in rowdata) rowchild.push(el.make(
                {tagName:'td', props:{name: key}, children:[rowdata[key]]
                }));


            //处理start
            if(options.start && utils.isArray(options.start)){
                var start = options.start;
                var startChild = getChildren(start);
                rowchild.push(el('td',null,startChild))
            }

            //处理end
            if(options.end && utils.isArray(options.end)){
                var endChild = getChildren(options.end);
                rowchild.push(el('td',null,endChild));
            }

            //生成每一行的虚拟DOM 并作为表体的子元素
            var obj = options.tr ? {"class":options.tr}:null;
            bodychild.push(el('tr',obj,rowchild));
        }

        //生成标题的虚拟DOM
        return el('tbody',null,bodychild);
    }

    /**
     * 绑定事件的函数
     * @param table
     * @param callback
     */
    function bindCallBack(table,callback){
        var em = toolbox.event;
        em.addHandler(table,'click',function(){
            var evt = em.getEvent(event);
            var target = em.getTarget(evt);
            callback(target);
        });
    }

    /**
     *
     * @param parent 父容器
     * @param data   数据 包含 表头和标题
     * {
     *      title:['title1','title2',xxx,xxx],   //表头
     *      data:[{},{},{},{},{}]  //5行
     * }
     * @param callback  回调函数 //事件委托，参数为点击对象
     * @param options  表第一列和最后一列需要展示的内容，固定结构：
     * {
     *      start:{
     *          [
         *          {
         *          tagName:'input',//必须是string
         *          props:{type:'checkbox',name:'checkboxname','class':'checkboxclass'},//必须是对象
         *          children:['内容']//必须是数组
         *          }
     *          ]
     *      }
     *      end:{
     *          [
     *              {
     *                  tagName:'button',//必须是string
     *                  props:{name:'buttonname','class':'buttonclass'},//必须是对象
     *                  children:['按钮1']//必须是数组
     *              },
     *              {
     *                  tagName:'button',//必须是string
     *                  props:{name:'buttonname','class':'buttonclass'},//必须是对象
     *                  children:['按钮2']//必须是数组
     *              }
     *          ]
     *      }
     * }
     * @returns {Table.makeTable}
     * @constructor
     */
    var Table = function(parent,data,callback,options){
        options = $.extend({},Table.default,options);
        return new Table.prototype.makeTable(parent,data,callback,options);
    };

    Table.default = {
        width:"100%",   //表宽
        height:"100%",   //表体的高度 不含表头 只在需要滚动的时候才有效
        colWidth:[],     //列宽  默认均分
        tableClass:"s3-table",   //表类
        rowClass:"s3-table-row",          //行样式类  仅在偶数行存在
        scroll: false
    };


    Table.prototype = {
        constructor:Table,

        makeTable:function(container,data,callback,options){
            if(container == null){
                throw("Element Not Found Error! makeTable(container...)  请选择正确的元素对象！");
                return this;
            }
            if(data == null || data.data == undefined || !S3.utils.isArray(data.data)){
                throw("Type Error! Expect Array! makeTable(container,data...) 请使用正确的数据格式！");
                return this;
            }

            //表头Virtual DOM
            var thead = makeHead(data.title,options);
            this.thead = thead;
            //表体Virtual DOM
            var tbody = makeBody(data.data,options);

            //生成table
            var table = toolbox.element('table',{"width":options.width},[thead,tbody]).render();

            //是否有回调函数
            if(callback && toolbox.utils.isFunction(callback)){
                this.callback = callback;
                bindCallBack(table,this.callback);
            }

            container = typeof container == 'string' ? document.getElementById(container) : container;
            container.innerHTML = "";
            container.appendChild(table);

            this.options = options;
            this.container = container;

            //如果有排序功能，需要默认排序规则
            // this.sort = 'default';
            //this.sortType = '0';
            return this;
        },


        /**
         * 更新表体内容
         * @param data
         * @returns {Table}
         */
        setData:function(data){
            if(!data || !toolbox.utils.isArray(data)){
                throw new TypeError('TypeError! Expect Array, got '+data);
                return this;
            }

            //渲染DOM
            var table,child=[];
            var options = this.options;

            //表头
            if(this.thead)
                child.push(this.thead);

            //表体
            var tbody = makeBody(data,options);
            if(tbody)
                child.push(tbody);

            table = toolbox.element('table',{'width':options.width},child).render();

            if(this.callback)
                bindCallBack(table,this.callback);

            this.container.innerHTML = "";
            this.container.appendChild(table);
            return this;
        }
    };

    //把makeTable的原型指向Table的原型
    //从而makeTable的构造器指向Table的构造器
    Table.prototype.makeTable.prototype = Table.prototype;
    
    toolbox.table = Table;
}(S3);