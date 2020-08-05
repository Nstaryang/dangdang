define(['autologin', 'jqcookie'], function(auto) {
    return {
        init: function() {
            auto.init();
            const $empty = $('.empty');
            const $shopping_wrap = $('.shopping-wrap')
            const $shopping_list = $('.shopping-list');
            const $table = $('.shopping-list table');
            const $allselect = $('input#allselect');
            const $del_box = $('.del_box');
            const $yes = $('.yes');
            const $no = $('.no');
            let arrbid = [];
            let arrnum = [];
            // 渲染
            if ($.cookie('cookiebid') && $.cookie('cookienum')) {
                $empty.css({
                    display: 'none',
                });
                $shopping_wrap.css({
                    display: 'block',
                });
                arrbid = $.cookie('cookiebid').split(',');
                arrnum = $.cookie('cookienum').split(',');
                $.ajax({
                    url: 'http://10.31.163.10/dangdang/php/list.php',
                    dataType: 'json'
                }).done(function(data) {
                    let str = '';
                    $.each(arrbid, function(index1, value1) {
                        $.each(data, function(index2, value2) {
                            if (value1 == value2.bid) {
                                str += `
                            <tr data-bid=${value2.bid}>
                                <td class="row1">
                                    <input type="checkbox" name="" id="select" checked>
                                </td>
                                <td class="row_img">
                                    <img src="${value2.url}" alt="">
                                </td>
                                <td class="row_name">
                                    <a href="#">${value2.title}</a>
                                </td>
                                <td class="row_price">
                                    ￥<span>${value2.nowprice}</span>
                                </td>
                                <td class="row_num">
                                    <a href="javascript:;" class="minus" data-bid=${value2.bid}>-</a>
                                    <input type="text" value="${arrnum[index1]}">
                                    <a href="javascript:;" class="add" data-bid=${value2.bid}>+</a>
                                </td>
                                <td class="row_sum">
                                    ￥<span>${(value2.nowprice*arrnum[index1]).toFixed(2)}</span>
                                </td>
                                <td class="row_del">
                                    <a href="javascript:;" class='del' data-bid=${value2.bid}>删除</a>
                                </td>
                            </tr>
                                `;
                            }
                        })
                    })
                    $table.html(str);
                    $('.total-left span i').html(arrbid.length)
                    $('.total span').html('￥' + getsum());
                })
            } else {
                $empty.css({
                    display: 'block',
                });
            }

            function getsum() {
                let sum = 0;
                const $sumlist = $('.row_sum span');
                $.each($sumlist, function(index, value) {
                    if ($table.find('input#select').eq(index).prop('checked')) {
                        sum += parseFloat(value.innerHTML);
                    }
                })
                return sum;
            }

            // 加减
            $table.on('click', 'a', function() {
                if ($(this).hasClass('add')) {
                    let index = $.inArray($(this).attr('data-bid'), arrbid);
                    let currtr = $table.find('tr').eq(index); //当前tr
                    $(this).prev().val(parseInt($(this).prev().val()) + 1);

                    // 计算总价
                    currtr.find('.row_sum span').html((currtr.find('.row_price span').html() * $(this).prev().val()).toFixed(2));
                    $('.total span').html('￥' + getsum().toFixed(2));
                    if (!currtr.find('#select').prop('checked')) {
                        currtr.find('#select').click();
                    }
                    arrnum[index] = $(this).prev().val();
                    $.cookie('cookienum', arrnum, {
                        expires: 7,
                        path: '/'
                    })

                }
                if ($(this).hasClass('minus')) {
                    let index = $.inArray($(this).attr('data-bid'), arrbid);
                    let currtr = $table.find('tr').eq(index); //当前tr
                    $(this).next().val(parseInt($(this).next().val()) - 1);
                    if ($(this).next().val() <= 1) {
                        $(this).next().val(1);
                    }
                    // 计算总价
                    currtr.find('.row_sum span').html((currtr.find('.row_price span').html() * $(this).next().val()).toFixed(2));
                    $('.total span').html('￥' + getsum().toFixed(2));
                    if (!currtr.find('#select').prop('checked')) {
                        currtr.find('#select').click();
                    }
                    arrnum[index] = $(this).next().val();
                    $.cookie('cookienum', arrnum, {
                        expires: 7,
                        path: '/'
                    })
                }

                // 删除

                if ($(this).hasClass('del')) {
                    $yes.off('click');
                    $no.off('click');
                    let index = $.inArray($(this).attr('data-bid'), arrbid); //当前点击元素所在tr的索引
                    let currtr = $table.find('tr').eq(index); //当前tr
                    //显示删除框
                    $del_box.css({
                        display: 'block',
                        left: $(this).offset().left - $del_box.width() / 2,
                        top: $(this).offset().top - $del_box.height() - 5,
                    });
                    // 确定
                    $yes.on('click', function() {
                        arrbid.splice(index, 1); //删除cookie
                        arrnum.splice(index, 1);
                        //同步cookie
                        $.cookie('cookiebid', arrbid, {
                            expires: 7,
                            path: '/'
                        });
                        $.cookie('cookienum', arrnum, {
                            expires: 7,
                            path: '/'
                        })
                        currtr.remove(); //删除tr
                        $del_box.css({ //隐藏删除框
                            display: 'none',
                        })
                        $('.total span').html('￥' + getsum().toFixed(2));
                        if ($table.find('tr').length === 0) {
                            console.log($table.find('tr').length);
                            $empty.css({
                                display: 'block',
                            });
                            $shopping_wrap.css({
                                display: 'none',
                            });
                        }
                    });
                    // 取消
                    $no.on('click', function() {
                        $del_box.css({ //隐藏删除框
                            display: 'none',
                        })
                    })

                }
            })

            function selectnum() {
                $('.total-left span i').html($table.find('input#select:checked').length)
            }
            // $table.off('click');
            // 单个选择按钮
            $table.on('click', '#select', function() {
                const $select = $table.find('input#select');
                if ($table.find('input#select:checked').length !== $select.length) {
                    $allselect.prop('checked', false)
                } else {
                    console.log((1));
                    $allselect.prop('checked', true)
                }
                selectnum();
                $('.total span').html('￥' + getsum().toFixed(2));
            })

            // 全选按钮
            $allselect.on('click', function() {
                $allselect.prop('checked', $(this).prop('checked'))
                console.log($table.find('input#select'));
                console.log($allselect.prop('checked'));
                $table.find('input#select').prop('checked', $(this).prop('checked'));
                selectnum();
                $('.total span').html('￥' + getsum().toFixed(2));
            })


            // 批量删除
            $('.del').on('click', function() {
                $yes.off('click');
                $no.off('click');
                const aTr = $table.find('tr');
                const $select = $table.find('input#select');

                $del_box.css({
                    display: 'block',
                    left: $(this).offset().left - $del_box.width() / 2,
                    top: $(this).offset().top - $del_box.height() - 5,
                });

                $yes.on('click', function() {
                    $.each($select, function(index, value) {
                        if ($(value).prop('checked')) {
                            aTr.eq(index).remove();
                            if (index > 1) {
                                arrbid.splice(index - 1, 1); //删除cookie
                                arrnum.splice(index - 1, 1);
                                //同步cookie
                                $.cookie('cookiebid', arrbid, {
                                    expires: 7,
                                    path: '/'
                                });
                                $.cookie('cookienum', arrnum, {
                                    expires: 7,
                                    path: '/'
                                })
                            } else {
                                arrbid.splice(index, 1); //删除cookie
                                arrnum.splice(index, 1);
                                //同步cookie
                                $.cookie('cookiebid', arrbid, {
                                    expires: 7,
                                    path: '/'
                                });
                                $.cookie('cookienum', arrnum, {
                                    expires: 7,
                                    path: '/'
                                })
                            }
                        }
                    })
                    selectnum();
                    if ($table.find('tr').length === 0) {
                        console.log($table.find('tr').length);
                        $empty.css({
                            display: 'block',
                        });
                        $shopping_wrap.css({
                            display: 'none',
                        });
                    }
                    $('.total span').html('￥' + getsum().toFixed(2));
                    $del_box.css({ //隐藏删除框
                        display: 'none',
                    })
                })

                $no.on('click', function() {
                    $del_box.css({ //隐藏删除框
                        display: 'none',
                    })
                })

            })
        }
    }
})