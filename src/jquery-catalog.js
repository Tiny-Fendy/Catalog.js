/**
 *
 * Created by fengdi(fengdi@tuniu.com)
 * Time: 2016-07-01
 *
 * */

;(function (root,fn) {

    if (typeof define === "function" && define.cmd) {

        define(function () {

            fn(jQuery, window);

        });

    } else if (typeof define === "function" && define.amd) {

        define(['catalog'],fn(jQuery,window));

    } else {

        window.tocify = fn(jQuery, window);

    }

}(this, function ($, window) {

    var defaults = {
        container: 'body',
        data: [
            {
                item: "",
                title: ""
            }
        ]
    };

    //目录树导航构造函数
    function catalog(element, options) {
        $(element).data('cat', this);
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    catalog.prototype = {

        init: function () {
            var self = this;

            //初始化变量
            self.$index = 0;
            self.$top = [];
            self.defend = true;
            self.containTop = self.element.offset().top;

            self.containerInit();
            self.createElement();
            self.bindEvent(self.containTop);
            self.winScroll(self.containTop);
        },

        //导航栏初始化
        containerInit: function () {
            var self = this,
                $width = parseInt(self.element.parent().css('width')),
                $left = parseInt(self.element.parent().css("padding-left")),
                $right = parseInt(self.element.parent().css("padding-right"));

            self.element.css('width', $width - $left - $right + "px").html("");

            if (self.element.prop("class").indexOf("tocify") === -1) {
                self.element.addClass("tocify");
            }
        },

        //生成目录树
        createElement: function () {
            var self = this;

            self.dataParse(self.options.container, self.options.data, self.element,
                function ($ele) {
                    $ele.append("<ul class='tocify-header nav nav-list'></ul>");
                    return $ele.children("ul").last();
                },
                function ($ul, $index, $dom, $cur) {
                    $ul.append("<li class='tocify-item' data-selector='" + $cur.item + "' data-id='" + $index + "'>" +
                        "<a>" + $dom.children($cur.title).text() + "</a></li>");
                    $dom.attr("data-hash", $index);
                    self.$top[$index] = $dom.offset().top;
                    self.$index++;
                }
            );
        },

        dataParse: function ($container, $array, $ele, fn1, fn2) {
            var self = this,
                $localArray = JSON.parse(JSON.stringify($array)),
                $cur = $localArray.shift(),
                $ul;

            $ul = fn1.call(self, $ele) || $ele;
            $($container).find($cur.item).each(function (i, d) {
                var $index = self.$index;

                fn2.call(self, $ul, $index, $(d), $cur);

                if ($localArray.length > 0) {
                    self.dataParse(d, $localArray, $ul, fn1, fn2);
                }
            });
        },

        //目录树事件绑定
        bindEvent: function (top) {
            var self = this;

            self.scrollEvent(self.element.offset().top);

            //点击跳到对应位置
            self.element.off("click").on("click", 'li', function () {
                var dom = $(this),
                    selector = dom.data("selector") + "[data-hash='" + dom.data("id") + "']",
                    bindDom = $(self.options.container).find(selector);

                self.defend = false;
                self.changeActive(dom);
                self.scrollSmooth(bindDom.offset().top - 15, $(window).scrollTop(), top);
            });
        },

        //目录树游标移动
        changeActive: function (dom) {
            var self = this;

            self.element.find("li").removeClass("active");
            dom.addClass("active");

            $.each(self.element.find("ul").splice(1, self.element.find("ul").length -1), function(i, e) {
                if ($(e).find(".active").length === 0 && $(e).prev("li").prop("class").indexOf("active") === -1){
                    $(e).slideUp("ease");
                } else {
                    $(e).slideDown("ease");
                }
            });
        },

        scrollSmooth: function (target, flag, top) {
            var self = this,
                interval,
                distance = target - flag;

            if (distance != 0 ) {
                self.defend = false;
                interval = setInterval(function () {
                    if ((distance > 0 && target - flag < distance/20) || (distance < 0 && target - flag > distance/20)) {
                        window.scroll(0, target);
                        clearInterval(interval);
                        self.defend = true;
                    } else {
                        flag += distance/20;
                        window.scroll(0, flag);

                        if (top - flag < 15) {
                            self.element.css({
                                "position": "fixed",
                                "top": "15px"
                            });
                        }
                    }
                },10);
            }
        },

        //滚动执行事件
        winScroll: function (containTop) {
            var self = this;

            $(window).scroll(function () {
                self.defend ? self.scrollEvent(containTop) : false;
            });
        },

        scrollEvent: function (containTop) {
            //目录树固定
            var self = this,
                winTop = $(window).scrollTop(),
                scrollTop = containTop - winTop;

            if (scrollTop < 15) {
                self.element.css({
                    "position": "fixed",
                    "top": "15px"
                });
            } else if (scrollTop > 15) {
                self.element.css({
                    "position": "relative",
                    "top": "0"
                });
            }

            //方法一：遍历查找对应的目录
            self.$top.forEach(function (e, i) {
                if (i> 0 && self.$top[i + 1] > winTop + 15 && e <= winTop + 15 ) {
                    self.changeActive($(self.element).find("li[data-id='" + i + "']"));
                    return false;
                } else if (i === 0 && self.$top[0] >= winTop + 15 ) {
                    self.changeActive($(self.element).find("li[data-id='0']"));
                    return false;
                }
            });

            //方法二：遍历节点计算高度
            /*self.dataParse(self.options.container, self.options.data, self.element, function () {
                },
                function ($ul, $index, $dom, $cur) {
                    var id = $dom.data("hash");
                    if ($dom.offset().top - winTop <= 50 && $dom.offset().top - winTop >= -50) {
                        self.changeActive($ul.find("li[data-id='" + id + "']"));
                    }
                }
            );*/
        }
    };

    $.fn['catalog'] = function (data) {

        var self;

        if (typeof data === "object") {

            return this.each(function () {
                new catalog(this, data);
            });

        } else if (data === "refresh") {
            self = $(this).data("cat");

            //数据初始化
            self.$index = 0;
            self.$top = [];
            self.defend = true;
            self.containTop = self.element.offset().top;

            //重新生成节点
            self.containerInit();
            self.createElement();

        } else if (data === "destroy") {
            self = $(this).data("cat");

            $(window).off("scroll");
            self.element.html("").removeClass("tocify");
        }

    };
}));