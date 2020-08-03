define([], function() {
    return {
        init: function slideshow(obj) {
            let count = 0;
            //节流
            var throttle = function(func, delay) {
                let prev = 0;
                return function() {
                    let context = this;
                    let args = arguments;
                    let now = Date.now();
                    if (now - prev >= delay) {
                        func.apply(context, args);
                        prev = now;
                    }
                }
            };
            //左箭头
            function roll_pre() {
                count--;
                tabswitch();
            }
            //右箭头
            function roll_next() {
                count++;
                tabswitch();
            }

            function tabswitch() {
                if (count < 0) {
                    let leftvalue = (obj.img.children().length - 1) * (obj.img.children(1).width());
                    obj.img.css('left', -leftvalue + 'px');
                    count = obj.img.children().length - 2;
                }
                obj.img.animate({
                    left: -obj.img.children(1).width() * count,
                }, function() {
                    if (count >= obj.img.children().length - 1) {
                        obj.img.css('left', '0px');
                        count = 0;
                    }
                })
                if (count >= obj.img.children().length - 1) {
                    obj.btn.eq(0).addClass(obj.btnClass).siblings('li').removeClass(obj.btnClass);
                } else {
                    obj.btn.eq(count).addClass(obj.btnClass).siblings('li').removeClass(obj.btnClass);
                }
            }

            //左右点击事件
            obj.right.on('click', throttle(roll_next, 500));
            obj.left.on('click', throttle(roll_pre, 500));
            //tab切换
            function tab() {
                $(this).addClass(obj.btnClass).siblings('li').removeClass(obj.btnClass);
                count = $(this).index();
                console.log(count);
                obj.img.animate({
                    left: -obj.img.children(1).width() * count,
                })

            }

            //小圆圈移入事件
            obj.btn.on('mouseover', throttle(tab, 310))
        }
    }
})