/**
 * Created by zjfh-chent on 2016/8/11.
 */
+function(toolbox){

    /**
     *  生成表头的虚拟DOM对象
     * @param headdata
     * @param options
     * @returns {Element}
     */
    function makeHead(headdata,options){
        var utils = toolbox.utils;
        if(headdata == undefined || !utils.isArray(headdata))
            return null;

        var el = toolbox.element;
        var rowchild = [];

        //处理start  end不处理
        var startCol,startChild = [];
        if(options && options.start && utils.isArray(options.start)){
            var start = options.start;
            start.forEach(function(item){
                startChild.push(el.makeElement(item));
            });
        }
        startCol = el('th',null,startChild);

        //行的子元素
        rowchild.push(startCol);
        headdata.forEach(function(item){
            if(utils.isPlainObject(item)){
                item = el.makeElement(item);
            }
            rowchild.push(el('th',null,[item]));
        });

        //生成行的虚拟DOM
        var tr = el('tr',null,rowchild);

        //生成表头的虚拟DOM
        var thead = el('thead',{},[tr]);

        //返回虚拟DOM
        return thead;
    }

    /**
     * 生成标题的虚拟DOM对象
     * @param bodydata
     * @param options
     * @returns {Element}
     */
    function makeBody(bodydata,options){
        var utils = toolbox.utils;
        if(bodydata == undefined || !utils.isArray(bodydata))
            return null;

        var el = toolbox.element;

        //表体的子元素
        var bodychild=[];

        //处理start
        var startCol,startChild = [];
        if(options && options.start && utils.isArray(options.start)){
            var start = options.start;
            start.forEach(function(item){
                startChild.push(el.makeElement(item));
            });
        }
        startCol = el('th',null,startChild);


        //处理end
        var endCol,endChild = [];
        if(options && options.end && utils.isArray(options.end)){
            var end = options.end;
            end.forEach(function(item){
                endChild.push(el.makeElement(item));
            });
        }
        endCol = el('td',null,endChild);

        //对每一行
        for(var i =0;i<bodydata.length;i++){
            var rowdata = bodydata[i],rowchild=[];

            if(startCol){
                rowchild.push(startCol);
            }
            for(var key in rowdata) rowchild.push(el.makeElement(
                {tagName:'td', props:{name: key}, children:[rowdata[key]]
                }));
            if(endCol) {
                rowchild.push(endCol);
            }

            //生成每一行的虚拟DOM 并作为表体的子元素
            bodychild.push(el('tr',null,rowchild));
        }

        //生成标题的虚拟DOM
        var tbody = el('tbody',null,bodychild);

        return tbody;
    }

    /**
     * 绑定事件的函数
     * @param table
     * @param callback
     */
    function bindCallBack(table,callback){
        var em = toolbox.eventManager;
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
        return new Table.prototype.makeTable(parent,data,callback,options);
    };

    Table.prototype = {
        constructor:Table,
        makeTable:function(parent,data,callback,options){

            if(parent == null || data == null || data.data == undefined || !toolbox.utils.isArray(data.data))
                return null;

            //缓存数据
            var headTemp;

            //判断是否有表头
            if(data.title && toolbox.utils.isArray(data.title)){
                headTemp = data.title;
            }
            //是否有回调函数
            if(callback && toolbox.utils.isFunction(callback)){
                this.callback = callback;
            }

            //渲染DOM
            var thead = makeHead(headTemp,options);
            var tbody = makeBody(data.data,options);
            var table,child=[];
            if(thead) {
                this.thead = thead;
                child.push(thead);
            }
            if(tbody)
                child.push(tbody);
            table = toolbox.element('table',{},child).render();


            if(this.callback)
                bindCallBack(table,this.callback);

            parent = typeof parent == 'string'?document.getElementById(parent):parent;
            parent.innerHTML = "";
            parent.appendChild(table);

            this.options = options;
            this.parent = parent;

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
                throw new TypeError('期望传入表格的内容数组，实际传入'+data+",请使用正确的参数!");
                return this;
            }

            //渲染DOM
            var table,child=[];
            var options = this.options || null;
            var tbody = makeBody(data,options);
            if(this.thead)
                child.push(this.thead);
            if(tbody)
                child.push(tbody);
            table = toolbox.element('table',{},child).render();
            if(this.callback)
                bindCallBack(table,this.callback);
            this.parent.innerHTML = "";
            this.parent.appendChild(table);
            return this;
        }
    };

    //把makeTable的原型指向Table的原型
    //从而makeTable的构造器指向Table的构造器
    Table.prototype.makeTable.prototype = Table.prototype;

    toolbox.table = Table;
}(S3);