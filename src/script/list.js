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
            let sortType = 'z';
            const $btn_pre = $('.pre');
            const $btn_next = $('.next');
            $.ajax({
                // url: 'http://localhost/dangdang/php/list.php',
                url: 'http://10.31.163.10/dangdang/php/list.php',
                dataType: 'json'
            }).done(function(data) {
                reader(data);
                if (num <= 1) {
                    $btn_pre.css({
                        backgroundColor: '#ccc'
                    })
                }
                $('.curr').html(num);
            });

            // 综合排序
            $zonghe.on('click', function() {
                sortType = 'z';
                toReader();
                $(this).addClass('active').siblings('a').removeClass('active');
            });
            //升序
            $ascent.on('click', function() {
                sortType = 'u';
                toReader();
                $(this).addClass('active').siblings('a').removeClass('active');
            });
            //降序
            $descent.on('click', function() {
                sortType = 'd';
                toReader();
                $(this).addClass('active').siblings('a').removeClass('active');
            });

            //下一页
            $btn_next.on('click', function() {
                num++;
                toReader();
                $btn_pre.css({
                    backgroundColor: 'red'
                })
                if (num >= 3) {
                    num = 3
                    $btn_next.css({
                        backgroundColor: '#ccc'
                    });
                }
                $('.curr').html(num);
            });
            //上一页
            $btn_pre.on('click', function() {
                num--;
                toReader();
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
            })

            //重新渲染
            function toReader() {
                $.ajax({
                    type: 'post',
                    url: 'http://10.31.163.10/dangdang/php/list.php',
                    data: {
                        page: num,
                        sortType: sortType,
                    },
                    dataType: 'json'
                }).done(function(data) {
                    reader(data);
                })
            }
            // 渲染
            function reader(data) {
                let str = '';
                $.each(data, function(index, value) {
                    str += `
                    <li>
                        <a href='details.html?bid=${value.bid}'>
                        <img data-original="${value.url}" alt="${value.title}" title="${value.title}" class='lazy' width='200' height='200'>
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