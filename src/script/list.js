define(['dropmenu', 'autologin', 'jqlazy'], function(dp, auto) {
    return {
        init: function() {
            //下拉菜单
            dp.init();
            auto.init();
            // 渲染
            const $listul = $('.list ul');
            const $zonghe = $('.zonghe');
            const $ascent = $('.ascent');
            const $descent = $('.descent');
            let num = 1;
            const $btn_pre = $('.pre');
            const $btn_next = $('.next');
            $.ajax({
                // url: 'http://localhost/dangdang/php/list.php',
                url: 'http://10.31.163.10/dangdang/php/list.php',
                dataType: 'json'
            }).done(function(data) {
                reader(data, num);
                $zonghe.on('click', function() {
                    data = data.sort(function(obj1, obj2) {
                        return obj1.bid - obj2.bid;
                    });
                    $(this).addClass('active').siblings('a').removeClass('active');
                    reader(data, num);
                });
                //升序
                $ascent.on('click', function() {
                    data = data.sort(function(obj1, obj2) {
                        return obj1.nowprice - obj2.nowprice;
                    })
                    $(this).addClass('active').siblings('a').removeClass('active');
                    reader(data, num);
                });
                //降序
                $descent.on('click', function() {
                    data = data.sort(function(obj1, obj2) {
                        return obj2.nowprice - obj1.nowprice;
                    })
                    $(this).addClass('active').siblings('a').removeClass('active');
                    reader(data, num);
                });
                if (num <= 1) {
                    $btn_pre.css({
                        backgroundColor: '#ccc'
                    })
                }
                $('.curr').html(num);
                $('.total').html(Math.ceil(data.length / 10));
                //下一页
                $btn_next.on('click', function() {
                    num++;
                    $btn_pre.css({
                        backgroundColor: 'red'
                    })
                    if (num >= Math.ceil(data.length / 10)) {
                        num = Math.ceil(data.length / 10)
                        $btn_next.css({
                            backgroundColor: '#ccc'
                        });
                    }
                    $('.curr').html(num);
                    reader(data, num);
                });
                //上一页
                $btn_pre.on('click', function() {
                    num--;
                    $btn_next.css({
                        backgroundColor: 'red'
                    })
                    if (num <= 1) {
                        num = 1;
                        $btn_pre.css({
                            backgroundColor: '#ccc'
                        })
                    }
                    $('.curr').html(num);
                    reader(data, num);
                })
            })

            // 渲染
            function reader(data, i) {
                let str = '';
                $.each(data, function(index, value) {
                    // <a href='http://localhost/dangdang/src/details.html?bid=${value.bid}'>
                    // <p><a href='http://localhost/dangdang/src/details.html?bid=${value.bid}'>${value.title}</a></p>
                    if (index >= (i - 1) * 10) {
                        str += `
                    <li>
                        <a href='details.html?bid=${value.bid}'>
                        <img data-original="${value.url}" alt="${value.title}" class='lazy' width='200' height='200'>
                        </a>
                        <p>
                            <span>￥${value.nowprice}</span>
                            <span>定价:<i>￥${value.preprice}</i></span>
                        </p>
                        <p><a href='details.html?bid=${value.bid}' title='${value.title}'>${value.title}</a></p>
                        <p>${value.intro}</p>
                        <p>
                            <a href="cartlist.html" class='join' data-bid='${value.bid}'>加入购物车</a>
                            <a href="javascript:;">收藏</a>
                        </p>
                        
                    </li>
                    `;
                    }
                    if ((index + 1) >= 10 * i) {
                        return false;
                    }
                })
                $listul.html(str);
                $(function() {
                    $("img.lazy").lazyload({ effect: "fadeIn" });
                });
            }

            // 加入购物车
            // cookie的操作
            let arrbid = [];
            let arrnum = [];

            // 获取cookie
            // cookiebid / cookienum
            function getcookie() {
                if ($.cookie('cookiebid') && $.cookie('cookienum')) {
                    arrbid = $.cookie('cookiebid').split(',');
                    arrnum = $.cookie('cookienum').split(',');
                } else {
                    arrbid = [];
                    arrnum = [];
                }
            }

            getcookie();
            // 点击加入购物车
            $listul.on('click', '.join', function() {
                getcookie();
                let bid = $(this).attr('data-bid');
                console.log(bid);
                console.log(arrbid);
                console.log(arrnum);
                if ($.inArray(bid, arrbid) === -1) {
                    arrbid.push(bid);
                    arrnum.push(1);
                    console.log(arrbid);
                    console.log(arrnum);
                } else {
                    let index = $.inArray(bid, arrbid);
                    arrnum[index] = parseInt(arrnum[index]) + 1;
                }
                $.cookie('cookiebid', arrbid, {
                    expires: 7,
                    path: '/'
                });
                $.cookie('cookienum', arrnum, {
                    expires: 7,
                    path: '/'
                })
            });

        }
    }
})