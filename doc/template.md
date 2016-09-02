# template

S3ToolBox对原来我们熟悉的arttemplate进行了封装，精简了里面的一些不常用操作，保留原来的核心，封装在S3.template对象中，用
法与原来的arttemplate用法一致，只不过在S3命名空间下。

例如:
```javascript
<div id = "temp"></div>
<script type="text/html" id = "template">
    <div>
        <h6><%= data.title%></h6>
        <ul>
            <%
            var list = data.list;
            for(var i=0;i<list.length;i++){
            %>
            <li>
                <%= list[i]%>
            </li>
            <% } %>
        </ul>
    </div>
</script>
```

```
var template = document.getElementById('template');
var dataobj = {title:'haha',list:['111',"222","333"]};
var html = S3.template("template",{data:dataobj}); //模板id和数据对象
document.getElementById('temp').innerHTML =html;
```