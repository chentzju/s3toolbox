/**
 * Forms Manager管理表单的读写
 */
+function (toolBox) {

        /**
         * 清理form
         * @param form
         */
       var clearForm = function (form){
            form.reset();
        };

        /**
         * 将form表单中的数据封装成JSON对象。
         * @param form
         * @return {}
         */
       var form2json = function(form){
            var obj = {};
            var a = $(form).serializeArray();
            $.each(a,function(){
                if(obj[this.name]!==undefined){
                    if(!obj[this.name].push){
                        obj[this.name] = [obj[this.name]];
                    }
                    obj[this.name].push(this.value||'');
                }else{
                    obj[this.name]=this.value||'';
                }
            });
            return obj;
        };


        /**
         * 将数据导入表单
         * @param form
         * @param jsonObj
         */
        var json2form = function(form,jsonObj,pre){
            var key,value,name,eles,match;

            pre = pre || '';

            //遍历对象
            for(key in jsonObj){
                name = pre + key;
                value = jsonObj[key];

                //如果还是对象，那就要递归  基本用不到
                if(toolBox.utils.isPlainObject(value)){
                    json2form(form,value,key+'.');
                }else{
                    //查找form中 名字与name匹配的元素
                    eles = [];
                    match = form.elements;
                    for(var i = 0 ;i<match.length;i++){
                        if(match[i].getAttribute('name') === name){
                            eles.push(match[i]);
                        }
                    }
                    //返回的匹配都是数组，直接计算即可
                    eles.forEach(function(elex){
                        //select
                        if(elex.tagName.toLowerCase() === "select") {
                            if(elex.type === "select-multiple"){
                                for(var i = 0;i<elex.options.length;i++){
                                    value.forEach(function (x) {
                                        if(elex.options[i].value === x)
                                            elex.options[i].selected = true;
                                    });
                                }
                            }else{
                                for (var i = 0; i < elex.options.length; i++) {
                                    if (elex.options[i].value === value) {
                                        elex.selectedIndex = i;
                                    }
                                }
                            }
                        }
                        //checkbox
                        else if(elex.type === "checkbox"){
                            elex.checked = (elex.value === value || value.some(function(x){ return elex.value === x})) ? true:false;
                        }
                        // radio
                        else if (elex.type !== "radio") {
                            elex.value = value;
                        } else {
                            elex.checked = (elex.value === value);
                        }
                    });
                }
            }
        };

    var form = {
        clearForm:clearForm,
        json2form:json2form,
        form2json:form2json
    };

    toolBox.form = form ;
}(S3);
