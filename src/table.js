/**
 * Created by zjfh-chent on 2016/8/11.
 */
+function(toolbox){

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
        if(options &&　options.start && utils.isArray(options.start)){
            var start = options.start;
            start.forEach(function(item){
                startChild.push(el(item.tagName,item.props,item.child));
            });
        }
        startCol = el('th',null,startChild);

        //行的子元素
        rowchild.push(startCol);
        headdata.forEach(function(item){
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
        if(options &&　options.start && utils.isArray(options.start)){
            var start = options.start;
            start.forEach(function(item){
                startChild.push(el(item.tagName,item.props,item.child));
            });
        }
        startCol = el('td',null,startChild);

        //处理end
        var endCol,endChild = [];
        if(options &&　options.end && utils.isArray(options.end)){
            var end = options.end;
            end.forEach(function(item){
                endChild.push(el(item.tagName,item.props,item.child));
            });
        }
        endCol = el('td',null,endChild);


        //对每一行
        for(var i =0;i<bodydata.length;i++){
            var rowdata = bodydata[i],rowchild=[];

            if(startCol){
                rowchild.push(startCol);
            }
            for(var key in rowdata){
                rowchild.push(el('td',{name:key},[rowdata[key]]));
            }
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
     *
     * @param tableId  表格id
     * @param data
     * {
     *      title:['title1','title2',xxx,xxx],   //标题
     *      data:[{},{},{},{},{}]  //5行
     * }
     * @param callback  回调函数 //事件委托，参数为点击对象
     * @param options  结构：
     * {
     *      start:{
     *          tagName:'input',//必须是string
     *          props:{type:'checkbox',name:'checkboxname',class:'checkboxclass'},//必须是对象
     *          child:['内容']//必须是数组
     *      }
     *      end:{
     *          [
     *              {
     *                  tagName:'button',//必须是string
     *                  props:{name:'buttonname',class:'buttonclass'},//必须是对象
     *                  child:['按钮1']//必须是数组
     *              },
     *              {
     *                  tagName:'button',//必须是string
     *                  props:{name:'buttonname',class:'buttonclass'},//必须是对象
     *                  child:['按钮1']//必须是数组
     *              }
     *          ]
     *      }
     * }
     * @returns {Table.makeTable}
     * @constructor
     */
    var Table = function(tableId,data,callback,options){
        return new Table.prototype.makeTable(tableId,data,callback,options);
    };

    //缓存数据
    var tableTemp;
    var tableHead;
    var headTemp;
    var callbackTemp;
    var optionsTemp;

    Table.prototype = {
        constructor:Table,
        makeTable:function(tableId,data,callback,options){

            if(tableId == null || data == null || data.data == undefined || !toolbox.utils.isArray(data.data))
                return null;

            //判断是否有表头
            if(data.title && toolbox.utils.isArray(data.title)){
                headTemp = data.title;
            }
            //是否有回调函数
            if(callback && toolbox.utils.isFunction(callback)){
                callbackTemp = callback;
            }
            //是否有特殊属性
            if(toolbox.utils.isPlainObject(options)){
                optionsTemp = options;
            }

            //渲染DOM
            var thead = makeHead(headTemp,options);
            var tbody = makeBody(data.data,options);
            var table = typeof tableId === "string" ? document.getElementById(tableId) : tableId;
            if(thead) {
                tableHead = thead.render();
                table.appendChild(tableHead);
            }
            if(tbody)
                table.appendChild(tbody.render());
            if(callbackTemp)
                bindCallBack(table,callbackTemp);
            tableTemp = table;
            return this;
        },
        setHead:function(tableId,head,callback,options){
            if(tableId == null || head == null || !toolbox.utils.isArray(head))
                return null;
            //判断是否有表头
            if(head && toolbox.utils.isArray(head)){
                headTemp = head;
            }
            //是否有回调函数
            if(callback && toolbox.utils.isFunction(callback)){
                callbackTemp = callback;
            }
            //是否有特殊属性
            if(toolbox.utils.isPlainObject(options)){
                optionsTemp = options;
            }
            //渲染DOM
            var thead = makeHead(headTemp,options);
            var table = typeof tableId === "string" ? document.getElementById(tableId) : tableId;
            if(thead) {
                tableHead = thead.render();
                table.appendChild(tableHead);
            }
            if(callbackTemp)
                bindCallBack(table,callbackTemp);
            tableTemp = table;
            return this;
        },
        setData:function(data){
            if(!toolbox.utils.isArray)
                return this;
            //渲染DOM
            var table = tableTemp;
            table.innerHTML = "";
            var tbody = makeBody(data.data,optionsTemp);
            if(tableHead)
                table.appendChild(tableHead);
            if(tbody)
                table.appendChild(tbody.render());
            if(callbackTemp)
                bindCallBack(table,callbackTemp);
            return this;
        }
    };

    //把makeTable的原型指向Table的原型
    //从而makeTable的构造器指向Table的构造器
    Table.prototype.makeTable.prototype = Table.prototype;

    toolbox.table = Table;
}(S3);