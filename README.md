## 基于jQuery的目录树导航组件

catalog是一个基于jQuery的目录树导航组件，可以根据页面的内容自动生成一个目录树导航栏，导航栏上的每一个标签
都对应页面中的一个内容区块。通过点击导航栏上的标签，页面可以自动跳转到对应的位置。而页面滚动时，导航栏将会
动态指示页面当前所处位置。

catalog的另外一个特性就是，即便页面内容有改动，组件也提供了方法去同步这些变化，而不会失效。有时候因为一些
原因，页面的滚动元素不是window，而是其他的DOM，不用担心，catalog也考虑到了这种情况，您只需要将滚动元素的
css selector传入进来，导航栏依旧可以正常工作。

### 依赖文件

catalog依赖jQuery
>jQuery CDN地址
http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
最新版jQuery下载地址
http://jquery.com/download/

### 组件引用
组件支持前端CMD规范以及AMD规范，也可以在页面中直接通过script标签引用。

### 组件Catalog方法入参说明
1. catalog通过传入一个对象字面量初始化组件，对象参数配置说明：

        eg:$(".toc").Catalog({
            container: ".contain",
            animation: false,
            data: [
                {title: 'h3',item: 'form'},
                {title: 'h4',item: '.item1'},
                {title: 'h5',item: '.item2'}
            ],
            callBack: function () {
                //do something
            }
        });

    * container: String 内容区的容器selector
    * listen: String，当页面滚动元素不是window时，传入滚动元素的selector
    * data: Array 目录层级结构结构，data的元素个数即为目录的层数，元素所在数组的
    序列即为对应目录所在层级。title是css selector，其所指向的DOM的内容将会作为标题被展示在导航栏中，item所指向的DOM则是导航所对应的内容
    * animation: Boolean 是否启用展开折叠动画
    * callBack: Function 导航栏全部初始化完成后执行的回调函数 

2. refresh: 刷新导航栏视图

        eg: $(".toc").Catalog("refresh");
    
3. destroy: 销毁目录树导航组件

        eg: $(".toc").Catalog("destroy");
        
### 组件方法
1. on(type, callBack) 绑定导航栏事件
    
    type: 事件类型，导航栏提供的所有事件见下表
    callBack: 事件触发的回调函数

        eg: $(".toc").Catalog().on('click', function () {
                //do something
            });
    
    * click: 导航栏点击事件
    * active: 导航栏指示游标改变
    
    