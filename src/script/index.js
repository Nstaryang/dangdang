define(['dropmenu', 'banner', 'autologin', 'jqlazy'], function(dp, slide, auto) {
    return {
        init: function() {
            dp.init();
            auto.init();
            //轮播图
            const $banner_btn = $('.banner ol li');
            const $banner_img = $('.banner ul li');
            const $banner = $('.banner');
            let banner_timer;
            let index = 0;
            $banner_btn.on('mouseover', function() {
                $(this).addClass('active').siblings('li').removeClass('active');
                $banner_img.eq($(this).index()).addClass('show-img').siblings('li').removeClass('show-img');
                index = $(this).index();
            });
            //自动播放
            function auto_roll() {
                banner_timer = setInterval(() => {
                    index++;
                    if (index > 11) {
                        index = 0;
                    }
                    $banner_btn.eq(index).addClass('active').siblings('li').removeClass('active');
                    $banner_img.eq(index).addClass('show-img').siblings('li').removeClass('show-img');
                }, 3000);
            }
            auto_roll();
            $banner.on('mouseover', function() {
                clearTimeout(banner_timer);
            })
            $banner.on('mouseout', function() {
                auto_roll();
            })
            const $btn_pre = $('.roll-box .btn-pre');
            const $btn_next = $('.roll-box .btn-next');
            const $roll_ul = $('.roll-box ul');
            const $book_btn = $('.roll-box ol li');
            //轮播图
            slide.init({
                    left: $btn_pre,
                    right: $btn_next,
                    img: $roll_ul,
                    btn: $book_btn,
                    btnClass: "book-active"
                })
                //新书预售轮播图
            slide.init({
                left: $('.roll-box2 .btn-pre'),
                right: $('.roll-box2 .btn-next'),
                img: $('.roll-box2 ul'),
                btn: $('.roll-box2 ol li'),
                btnClass: "book-active"
            });
            // 新书热卖榜--tab切换
            $('.hotrank ol li').on('mouseover', function() {
                $(this).addClass('active').siblings('li').removeClass('active');
                $('.hotrank ul li').eq($(this).index()).show().siblings('li').hide();
            });
            //独家特供
            $('.book_tegong header li').on('mouseover', function() {
                $(this).addClass('active').siblings('li').removeClass('active');
                $('.book_tegong .tab-content li').eq($(this).index()).show().siblings('li').hide();
            });

            //图书畅销榜
            $('.sell_rank .tab-aa li').on('mouseover', function() {
                $(this).addClass('active').siblings('li').removeClass('active');
                $('.sell_rank .tab-content li').eq($(this).index()).show().siblings('li').hide();
            });

            //二级导航
            const $cartul = $('.aside-menu ul');
            const $cartlist = $('.aside-menu ul li').not('.last');
            const $cartitems = $('.aside-menu .submenu');
            $cartlist.on('mouseenter', function() {
                let listtop = $(this).offset().top;
                let ultop = $cartul.offset().top;
                let itemheight = $cartitems.eq($(this).index()).height();
                if (listtop - ultop < itemheight) {
                    $cartlist.removeClass('relative');
                    $cartul.addClass('relative');
                    if ($(window).scrollTop() < ultop) {
                        $cartitems.eq($(this).index()).css({
                            top: 0
                        })
                    } else {
                        $cartitems.eq($(this).index()).css({
                            top: ($(window).scrollTop() - ultop + 5)
                        })
                    }

                } else {

                    if (listtop + $(this).height() - $(window).scrollTop() > itemheight) {
                        $(this).addClass('relative');
                        $cartul.removeClass('relative');
                        $cartitems.eq($(this).index()).css({
                            bottom: 0
                        })
                    } else {
                        $cartlist.removeClass('relative');
                        $cartul.addClass('relative');
                        $cartitems.eq($(this).index()).css({
                            top: ($(window).scrollTop() - ultop + 5)
                        })
                    }
                }
            });
            // 新书上架
            $online = $('.roll-box ul');
            $.ajax({
                url: 'http://10.31.163.10/dangdang/php/list.php',
                dataType: 'json'
            }).done(function(data) {
                let firstLi = null;
                for (let i = 0; i < 4; i++) {
                    let str = '';
                    $.each(data, function(index, value) {
                        if (index >= i * 8) {
                            str += `
                            <div>
                            <a href='details.html?bid=${value.bid}'>
                            <img data-original="${value.url}" alt="" class="lazy" width='150' height='150'>
                            </a>
                            <p class="title"><a href='details.html?bid=${value.bid}'>${value.title}</a></p>
                            <p class="author">${value.author}</p>
                            <p class="price">
                                <span class="curr">￥${value.nowprice}</span>
                                <span class="pre">￥${value.preprice}</span>
                            </p>
                        </div>  
                            `;
                            if ((index + 1) % 8 === 0 && index > 0) {
                                let cLi = document.createElement('li');
                                $(cLi).addClass('online_list');
                                $(cLi).html(str);
                                if (i === 0) {
                                    firstLi = $(cLi).clone(true);
                                }
                                $(cLi).appendTo($online);
                                return false;
                            }
                            if (index >= 29) {
                                str += `
                                    <div></div>
                                    <div></div>
                                `;
                                let cLi = document.createElement('li');
                                $(cLi).addClass('online_list');
                                $(cLi).html(str);
                                if (i === 0) {
                                    firstLi = $(cLi).clone(true);
                                }
                                $(cLi).appendTo($online);
                            }
                        }
                    })

                }
                $(firstLi).appendTo($online);
                $(function() {
                    $("img.lazy").lazyload({ effect: "fadeIn" });
                });
            })
            const $list = $(".book_tegong .tab-content li");
            console.log($list);
            // 渲染独家特供
            $.ajax({
                url: 'http://10.31.163.10/dangdang/php/list.php',
                dataType: 'json'
            }).done(function(data) {
                let len = $list.length;
                console.log(data);
                console.log(len);
                for (let i = 0; i < len; i++) {
                    let str = '';
                    $.each(data, function(index, value) {
                        str += `
                        <div>
                        <a href='details.html?bid=${value.bid}'>
                            <img data-original="${value.url}" alt="" class="lazy" width='150' height='150'>
                        </a>
                        <p class="title"><a href='details.html?bid=${value.bid}'>${value.title}</a></p>
                        <p class="author">${value.author}</p>
                        <p class="price">
                            <span class="curr">￥${value.nowprice}</span>
                            <span class="pre">￥${value.preprice}</span>
                        </p>
                    </div>
                        `;
                        if ((index + 1) >= 10) {
                            $list.eq(i).html(str);
                            return false;
                        }
                    })
                }
                $(function() {
                    $("img.lazy").lazyload({ effect: "fadeIn" });
                });
            })
        }
    }
})