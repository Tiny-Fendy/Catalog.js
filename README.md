基于jQuery的目录树导航组件

***

## 依赖文件 
jQuery CDN地址
>http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
最新版jQuery下载地址
>http://jquery.com/download/

## 组件引用
组件支持前端CMD规范以及AMD规范，也可以直接引用。

`$(".toc").catalog({
    container: ".contain",
    data: [
        {title: 'h3',item: 'form'},
        {title: 'h4',item: '.item1'},
        {title: 'h5',item: '.item2'}
    ]
});`

#### 参数说明
* container：String 内容区的容器selector
* data: Array 目录层级结构结构，data的元素个数即为目录的层数，元素所在数组的
序列即为对应目录所在层级。title是css selector，其所指向的DOM的内容将会作为标题被展示在导航栏中，item所指向的DOM则是导航所对应的内容

#### 组件方法说明
* catalog("refresh"), 刷新导航栏视图
* catalog("destroy"), 销毁目录树导航组件