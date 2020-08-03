define(['jqcookie'], function() {
    return {
        init: function() {
            // 检测是否登录
            if ($.cookie('username')) {
                // alert(1);
                $('.befor').css({
                    display: 'none',
                })
                $('.after').css({
                    display: 'block'
                })
                let uname = $.cookie('username');
                let regname = /(\d{3})(\d{4})(\d{4})/;
                uname = uname.replace(regname, '$1****$3');
                $('.after').find('span').html(uname);
            }
            $('.after a').on('click', function() {
                $('.befor').css({
                    display: 'block',
                })
                $('.after').css({
                    display: 'none'
                })
                $.cookie('username', '', {
                    expires: -1,
                    path: '/'
                });
            })
        }
    }
})