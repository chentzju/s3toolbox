/**
 * Created by zjfh-chent on 2016/12/27.
 */
var TableScroll = (function ($,S3){
    if($ == null ||　S3 == null)
        throw "[Object Not Found] 该程序依赖于jQuery和S3，请加载相应的插件！";

    var TableScroll = function(container,data,options){
        options = $.extend({},TableScroll.default,options);
        return TableScroll.prototype.makeTable(container,data,options)
    };

    TableScroll.default = {
        width:"1200px",   //表宽
        height:"500px",   //表体的高度 不含表头 只在需要滚动的时候才有效
        colWidth:[],     //列宽  默认均分
        tableClass:"s3-table",   //表类
        rowClass:"s3-table-row"          //行样式类 偶数行类
    };

    TableScroll.prototype.makeTable = function(container,data,options){
        container = typeof container == 'string' ? document.getElementById(container) : container;
        if(container == null){
            throw("Element Not Found Error! makeTable(container...)  请选择正确的元素对象！");
            return this;
        }
        if(data == null || data.data == undefined || !S3.utils.isArray(data.data)){
            throw("Type Error! Expect Array! makeTable(container,data...) 请使用正确的数据格式！");
            return this;
        }

        this.options = options;

        var head =  makeHead(data.title,options);
        this.head = head;

        //container overflow:auto

        this.container = container;
        container.appendChild(head.render());
        container.appendChild(makeBody(data.data,options).render());
        container.style.overflow = "auto";
        return this;
    };
    TableScroll.prototype.makeTable.prototype = TableScroll.prototype;

    TableScroll.prototype.setBody = function(data,options){
        if(data == null || data == undefined || !S3.utils.isArray(data)){
            throw("Type Error! function setBody(data,options),Expect Array! receive "+data+"请使用正确的数据格式！");
            return this;
        }
        this.options = $.extend({},this.options,options);
        this.container.innerHTML = "";
        this.container.appendChild(this.head.render());
        this.container.appendChild(makeBody(data,this.options).render());
        this.container.style.overflow = "auto";
        return this;
    };

    var getColGroup = function(data, colWidth){
        if (data == undefined || !S3.utils.isArray(data))
            return [];

        colWidth = S3.utils.isArray(colWidth) ? colWidth : [];

        var colCount = data.length;
        var i,width;
        if (colWidth.length === 0) {
            for (i = 0; i < colCount; i++) {
                width = S3.number.div(100, colCount).toFixed(2);
                colWidth.push(width+"%");
            }
        }
        //生成列表
        var colList = [];
        for(i =0;i<colCount;i++){
            if(colWidth[i]){
                colList.push(S3.element("col", {'width':colWidth[i]}, []));
            }else{
                colList.push(S3.element("col", {}, []));
            }
        }
        return S3.element("colgroup",{},colList);
    };

    var makeHead = function (data,options) {
        if (data == undefined || !S3.utils.isArray(data))
            return S3.element('table',{},[]);
        //表头
        var trAry = [];
        data.forEach(function (title) {
            trAry.push(S3.element("td", {}, [title]))
        });
        var tr = S3.element("tr", {}, trAry);
        var colGroup = getColGroup(data,options.colWidth);
        var theadBody = S3.element("tbody", {}, [tr]);
        var bodyWidth = parseInt(options.width) - 17;
        return S3.element("table", {width:bodyWidth},  [colGroup,theadBody]);
    };
    var makeBody = function(data,options){
        options = options || this.options;
        if (data == undefined || !S3.utils.isArray(data) || data.length === 0)
            return S3.element('div',{},[]);

        //表体
        var tBodyAry = [],key;
        data.forEach(function(row,i){
            if(S3.utils.isPlainObject(row)){
                var trAry = [];
                for(key in row)
                    trAry.push(S3.element("td", {}, [row[key]]));

                //类名处理
                var classObj = {};
                if(i%2 == 0){
                    classObj = {'class':options.rowClass};
                }
                tBodyAry.push(S3.element("tr",classObj,trAry));
            }
        });

        var data0 = data[0];
        var colCount = [];
        for(key in data0){
            colCount.push(key);
        }

        //列宽
        var colGroup = getColGroup(colCount,options.colWidth);
        //表体
        var tbody = S3.element("tbody",{},tBodyAry);

        //生成表体的表
        var bodyWidth = parseInt(options.width) - 17;
        var bodyTable = S3.element("table", {'class':options.tableClass,'width':bodyWidth+"px"},[colGroup,tbody]);

        //设置样式
        var styleStr = 'overflow:auto;height:'+options.height+';width:'+options.width+';';

        return S3.element("div",{'style':styleStr},[bodyTable]);
    };

    return TableScroll;
})(jQuery,S3);