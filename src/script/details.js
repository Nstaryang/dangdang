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
            });
            // 点击立即购买
            $('.buy').on('click', function() {
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
            })


            // 三级联动
            // 获取数据
            const $site = $(".site")
            const $prov = $('.prov');
            const $city = $('.city');
            const $county = $('.county');
            const $prov_list = $('.prov_list');
            const $city_list = $('.city_list');
            const $county_list = $('.county_list');
            let provstr = '';
            let citystr = '';
            let countystr = '';
            $.ajax({
                url: 'city.json',
                dataType: 'json'
            }).done(function(data) {
                $site.on('click', function() {
                    $('.site_box').css({
                        display: 'block',
                    });
                    // 渲染省
                    reader_prov(data);
                    // 渲染城市
                    reader_city(data);
                    // 渲染县区
                    reader_county(data);
                });

                // prov点击事件
                $prov.on('click', function() {
                    reader_prov(data);
                    $prov_list.addClass('show').siblings('ul').removeClass('show');
                });
                // city点击事件
                $city.on('click', function() {
                    reader_city(data);
                    $city_list.addClass('show').siblings('ul').removeClass('show');
                });
                //county点击事件
                $county.on('click', function() {
                    reader_county(data);
                    $county_list.addClass('show').siblings('ul').removeClass('show');
                });
            })

            // 渲染省
            function reader_prov(data) {
                $.each(data, function(index, value) {
                    provstr += '<li data-index="' + index + '">' + value.name + '</li>'
                });
                $prov_list.html(provstr);
                provstr = '';
            }

            // 渲染城市
            function reader_city(data) {
                $.each(data[$prov.attr('data-index')].city, function(index, value) {
                    citystr += '<li data-index="' + index + '">' + value.name + '</li>'
                });
                $city_list.html(citystr);
                citystr = '';
            }

            // 渲染县区
            function reader_county(data) {
                $.each(data[$prov.attr('data-index')].city[$city.attr('data-index')].districtAndCounty, function(index, value) {
                    countystr += '<li data-index="' + index + '">' + value + '</li>'
                });
                $county_list.html(countystr);
                countystr = '';
            }

            // 选择省
            $prov_list.on('click', 'li', function() {
                $prov.html($(this).html());
                $prov.attr({
                    'data-index': $(this).attr('data-index')
                })
                $city.html('请选择');
                $county.hide();
                $city.click();
            });
            //选择城市
            $city_list.on('click', 'li', function() {
                $city.html($(this).html());
                $city.attr({
                    'data-index': $(this).attr('data-index')
                })
                $county.html('请选择');
                $county.show();
                $county.click();
            });
            // 选择县区
            $county_list.on('click', 'li', function(ev) {
                ev = ev || window.event;
                $county.html($(this).html());
                $county.attr({
                    'data-index': $(this).attr('data-index')
                })

                if ($prov.html() && $city.html() && $county.html()) {
                    let str = '';
                    if ($prov.html() === $city.html()) {
                        str += $prov.html() + $county.html();
                    } else {
                        str += $prov.html() + $city.html() + $county.html();
                    }
                    $('.site span').html(str);
                    $('.site_box').css({
                        display: 'none'
                    });
                    // 取消事件冒泡
                    ev.stopPropagation();
                }

            });

            //关闭三级联动框
            $('.close').on('click', function(ev) {
                ev = ev || window.event;
                $('.site_box').css({
                    display: 'none'
                });
                // 取消事件冒泡
                ev.stopPropagation();
            });
        }
    }
})