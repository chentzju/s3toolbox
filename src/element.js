/**
 * Created by zjfh-chent on 2016/8/23.
 */
+function(toolbox){

    /**
     * 处理属性设置
     * @param node
     * @param key
     * @param value
     */
    function setAttr(node,key,value){
        switch(key){
            case 'style':
                node.style.cssText = value;
                break;
            case 'value':
                var tagName = node.tagName || '';
                tagName = tagName.toLowerCase();
                if(tagName === 'input' || tagName === 'textarea'){
                    node.value = value;
                }else{
                    node.setAttribute(key,value);
                }
                break;
            default:
                node.setAttribute(key,value);
                break;
        }
    }

    /**
     * 虚拟DOM对象
     * @param {String} tagName  对象的标签名
     * @param {Object} props   对象的属性
     * @param {Array<Element|String>}  元素的子元素 可以是文字，也可以是Element对象
     */
    function Element (tagName, props, children) {
        var utils = toolbox.utils;
        if (!(this instanceof Element)) {
            if (!utils.isArray(children) && children != null) {
                children = Array.prototype.slice.call(arguments, 2)
                    .filter(
                        function(value){
                            return !!value;
                        })
            }
            return new Element(tagName, props, children)
        }

        if (utils.isArray(props)) {
            children = props;
            props = {}
        }

        this.tagName = tagName;
        this.props = props || {};
        this.children = children || [];
        this.key = props
            ? props.key
            : void 666;

        var count = 0;

        utils.forEach(this.children, function (child, i) {
            if (child instanceof Element) {
                count += child.count
            } else {
                children[i] = '' + child
            }
            count++
        });

        this.count = count
    }

    /**
     * 渲染DOM树
     * @returns {Element}
     */
    Element.prototype.render = function () {
        var el = document.createElement(this.tagName)
        var props = this.props;

        for (var propName in props) {
            var propValue = props[propName]
            setAttr(el, propName, propValue)
        }

        toolbox.utils.forEach(this.children, function (child) {
            var childEl = (child instanceof Element)
                ? child.render()
                : document.createTextNode(child)
            el.appendChild(childEl)
        });
        return el
    };

    toolbox.element = function(tagName,props,children){
        return new Element(tagName,props,children);
    }
}(S3);
