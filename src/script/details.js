define(['dropmenu', 'autologin', 'jqcookie'], function(dp, auto) {
    return {
        init: function() {
            dp.init();
            auto.init();
            const $picbox = $('.picbox')
            const $sf = $('.sf');
            const $spic = $('.spic');
            const $bf = $('.bf');
            const $bpic = $('.bpic');
            const $rolllist = $('.roll-box ul');
            const $title = $('.showinfo h1');
            const $intro = $('.intro span');
            const $author = $('.author a');
            const $nowprice = $('.nowprice span');
            const $preprice = $('.preprice span');
            const $btn_pre = $('.btn-pre');
            const $btn_next = $('.btn-next');
            // 渲染
            let bid = location.search.substring(1).split('=')[1];
            $.ajax({
                type: 'post',
                // url: 'http://localhost/dangdang/php/details.php',
                url: 'http://10.31.163.10/dangdang/php/details.php',
                data: {
                    bid: bid,
                },
                dataType: 'json'
            }).done(function(data) {
                $spic.attr('src', data.url);
                $bpic.attr('src', data.url);
                $title.html(data.title);
                $intro.html(data.intro);
                $author.html(data.author);
                $nowprice.html(data.nowprice);
                $preprice.html('￥' + data.preprice);
                let spicarr = data.spiclisturl.split(',')
                let bpicarr = data.bpiclisturl.split(',')
                let str = '';
                $.each(spicarr, function(index, value) {
                    str += `
            <li data-index=${index}>
              <img src="${value}" alt="">
            </li>
            `;
                })
                $rolllist.html(str);
                getlength();
            })

            // 放大镜效果
            $picbox.on('mouseover', function(ev) {
                ev = ev || window.ev;
                $sf.css({
                    visibility: 'visible'
                })
                $bf.css({
                    visibility: 'visible'
                });
                // 计算小放的宽高
                $sf.width($bf.width() / $bpic.width() * $spic.width());
                $sf.height($bf.height() / $bpic.height() * $spic.height());
                let bili = $bpic.width() / $spic.width();
                $picbox.on('mousemove', function(ev) {
                    ev = ev || window.event;
                    let positionx = ev.pageX - $picbox.offset().left - $sf.width() / 2;
                    let positiony = ev.pageY - $picbox.offset().top - $sf.height() / 2;
                    if (positionx <= 0) {
                        positionx = 0;
                    } else if (positionx > $picbox.width() - $sf.width()) {
                        positionx = $picbox.width() - $sf.width();
                    }
                    if (positiony <= 0) {
                        positiony = 0;
                    } else if (positiony > $picbox.height() - $sf.height()) {
                        positiony = $picbox.height() - $sf.height();
                    }

                    $sf.css({
                        left: positionx,
                        top: positiony
                    })
                    $bpic.css({
                        left: -bili * positionx,
                        top: -bili * positiony
                    })
                })
            })

            $picbox.on('mouseout', function() {
                $sf.css({
                    visibility: 'hidden'
                })
                $bf.css({
                    visibility: 'hidden'
                })
            })


            // 切换图片 事件委托
            $rolllist.on('click', 'li', function() {
                let reg = /(\_l\_)/g;
                let url = $(this).find('img').attr('src');
                url = url.replace(reg, '_u_');
                $spic.attr('src', url)
                $bpic.attr('src', url)
                console.log($rolllist.find('li'));
            });

            function getlength() {
                if ($rolllist.find('li').length < 6) {
                    $btn_pre.css({
                        color: '#eee',
                    })
                    $btn_next.css({
                        color: '#eee',
                    })
                }
            }
            $btn_pre.css({
                color: '#eee',
            });
            // 图片移动
            let num = 5;
            $btn_next.on('click', function() {
                let len = $rolllist.find('li').length;
                let picwidth = $rolllist.find('li').eq(0).width();

                if (len > num) {
                    num++;
                    console.log(num);
                    console.log(len);
                    $btn_pre.css({
                        color: '#000',
                    })
                    $rolllist.css({
                        left: -picwidth * (num - 5),
                    })
                    if (len === num) {
                        $btn_next.css({
                            color: '#eee',
                        })
                    }
                }

            })
            $btn_pre.on('click', function() {
                let len = $rolllist.find('li').length;
                let picwidth = $rolllist.find('li').eq(0).width();
                if (num > 5) {
                    num--;
                    $btn_next.css({
                        color: '#000',
                    })
                    if (num === 5) {
                        $btn_pre.css({
                            color: '#eee',
                        })
                    }
                    $rolllist.css({
                        left: -picwidth * (num - 5),
                    })
                }
            })

            // buy-num的加减
            const $buy_num = $('#buy-num');
            const $add = $('.add');
            const $minus = $('.minus');

            $add.on('click', function() {
                $buy_num.val(parseInt($buy_num.val()) + 1);
                return false;
            })
            $minus.on('click', function() {
                $buy_num.val(parseInt($buy_num.val()) - 1);
                if ($buy_num.val() <= 1) {
                    $buy_num.val(1);
                }
                return false;
            });
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
            $('.jioncart').on('click', function() {
                getcookie();
                if ($.inArray(bid, arrbid) === -1) {
                    arrbid.push(bid);
                    arrnum.push($buy_num.val());
                    console.log(arrbid);
                    console.log(arrnum);
                } else {
                    let index = $.inArray(bid, arrbid);
                    arrnum[index] = parseInt(arrnum[index]) + parseInt($buy_num.val());
                }
                $.cookie('cookiebid', arrbid, {
                    expires: 7,
                    path: '/'
                });
                $.cookie('cookienum', arrnum, {
                    expires: 7,
                    path: '/'
                })
                alert('成功加入购物车')
            })
        }




    }
})