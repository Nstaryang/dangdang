define(['dropmenu', 'autologin'], function(dp, auto) {
    return {
        init: function() {
            //下拉菜单
            dp.init();
            auto.init();
            // 渲染
            const $listul = $('.list ul');
            $.ajax({
                // url: 'http://localhost/dangdang/php/list.php',
                url: 'http://10.31.163.10/dangdang/php/list.php',
                dataType: 'json'
            }).done(function(data) {
                let str = '';
                $.each(data, function(index, value) {
                    // <a href='http://localhost/dangdang/src/details.html?bid=${value.bid}'>
                    // <p><a href='http://localhost/dangdang/src/details.html?bid=${value.bid}'>${value.title}</a></p>
                    str += `
            <li>
                <a href='details.html?bid=${value.bid}'>
                <img src="${value.url}" alt="${value.title}">
                </a>
                <p>
                    <span>￥${value.nowprice}</span>
                    <span>定价:<i>￥${value.preprice}</i></span>
                </p>
                <p><a href='details.html?bid=${value.bid}'>${value.title}</a></p>
                <p>${value.intro}</p>
                <p>
                    <a href="cartlist.html" class='join' data-bid='${value.bid}'>加入购物车</a>
                    <a href="javascript:;">收藏</a>
                </p>
                
            </li>
            `;
                })
                $listul.html(str);
            })

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