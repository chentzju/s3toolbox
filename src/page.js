
+function(toolBox){

    var Page = (function(){
        /**
         * 按钮
         * @param buttonLabel
         * @param pageNumber
         * @param pageCount
         * @param callback
         * @returns {*|jQuery|HTMLElement}
         */
        function renderButton(buttonLabel, pageNumber, pageCount,callback,container) {

            var buttonNode = document.createElement('li');
            buttonNode.innerHTML = buttonLabel;
            buttonNode.setAttribute('class','pgNext');

            var destPage = 1;
            switch (buttonLabel) {
                case "最前":
                    destPage = 1;
                    break;
                case "上一页":
                    destPage = pageNumber - 1;
                    break;
                case "下一页":
                    destPage = pageNumber + 1;
                    break;
                case "最后":
                    destPage = pageCount;
                    break;
            }

            // disable and 'grey' out buttons if not needed.
            var ctext;
            if (buttonLabel == "最前" || buttonLabel == "上一页") {
                if(pageNumber <= 1){
                    ctext =  buttonNode.getAttribute('class');
                    ctext = ctext + " pgEmpty";
                    buttonNode.setAttribute('class',ctext);
                }else{
                    toolBox.event.addHandler(buttonNode,'click',function(){
                        callback(destPage);
                        renderPage(destPage, pageCount,callback,container)
                    },false);
                }
            }
            else {
                if(pageNumber >= pageCount){
                    ctext =  buttonNode.getAttribute('class');
                    ctext = ctext + " pgEmpty";
                    buttonNode.setAttribute('class',ctext);
                }else{
                    toolBox.event.addHandler(buttonNode,'click',function(){
                        callback(destPage);
                        renderPage(destPage, pageCount,callback,container)
                    },false);
                }
            }

            return buttonNode;
        }
        /**
         * 生成页码的代码
         * @param currentNumber
         * @param pageCount
         * @param callback
         * @returns {*|jQuery|HTMLElement}
         */
        function renderPage(currentNumber, pageCount,callback,container){

            var pageNode = document.createElement('ul');
            pageNode.setAttribute('class','pages');

            // add previous and next buttons
            pageNode.appendChild(renderButton('最前', currentNumber, pageCount, callback,container));
            pageNode.appendChild(renderButton('上一页', currentNumber, pageCount, callback,container));

            var startPoint = 1;
            var endPoint =9;
            if (currentNumber > 4) {
                startPoint = currentNumber - 4;
                endPoint = currentNumber + 4;
            }
            if (endPoint > pageCount) {
                startPoint = pageCount - 8;
                endPoint = pageCount;
            }
            if (startPoint < 1) {
                startPoint = 1;
            }

            for (var page = startPoint; page <= endPoint; page++) {
                var listButton = document.createElement('li');
                listButton.innerHTML = page;
                listButton.setAttribute('class','page-number');
                var ctxt;
                if(page === currentNumber){
                    ctxt= listButton.getAttribute('class');
                    ctxt = ctxt + ' pgCurrent';
                    listButton.setAttribute('class',ctxt);
                }else{
                    toolBox.event.addHandler(listButton,'click',function() {
                        var evt = toolBox.event.getEvent(event);
                        var target = toolBox.event.getTarget(evt);
                        var num = target.innerHTML;
                        callback(parseInt(num));
                        renderPage(parseInt(num), pageCount,callback,container);
                    },false);
                }
                pageNode.appendChild(listButton);
            }
            // render in the next and last buttons before returning the whole rendered control back.
            pageNode.appendChild(renderButton('下一页', currentNumber, pageCount, callback,container));
            pageNode.appendChild(renderButton('最后', currentNumber, pageCount, callback,container));

            if(container){
                container.innerHTML = "";
                container.appendChild(pageNode);
            }
            return pageNode;
        }


        //page plugin start
        var options = {
            currentpage: 1,
            pagecount: 10
        };
        var callbackfunc = function(clickpage){
            return clickpage;
        };

        /**
         * 页码组件
         * @param container
         * @param callback
         * @param option
         * @returns {*}
         * @constructor
         */
        var Page = function(container,callback,option){
            if(!container || !callback)
                return null;
            callbackfunc = callback || callbackfunc;
            if(option){
                for(var key in option){
                    options[key] = option[key];
                }
            }
            return new Page.prototype.init(container,callbackfunc,options);
        };

        Page.prototype = {
            constructor:Page,
            init:function(container,callback,options){
                this.container = container;
                renderPage(parseInt(options.currentpage), parseInt(options.pagecount), callback,container);
                return this;
            },
            setPage:function(current){
                this.container.innerHTML = "";
                this.container.appendChild(renderPage(current, parseInt(options.pagecount), callbackfunc));
                return this;
            }

        };

        Page.prototype.init.prototype = Page.prototype;
        return Page;
    })();

    toolBox.page = Page;
}(S3);