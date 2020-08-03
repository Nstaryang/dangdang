define(['sha1', 'jqcookie'], function(s) {
    return {
        init: function() {
            const $username = $('#username');
            const $password = $('#password');
            const $submit = $('#submit');
            const $span = $('form p>span');
            const $autologin = $('#autologin');
            $submit.on('click', function() {
                // 自动登录
                console.log($autologin.prop('checked'));
                //账号验证
                if ($username.val() === '') {
                    $span.eq(0).html('请输入邮箱/昵称/手机号码');
                    $span.eq(0).css({
                        color: 'red'
                    })
                }
                if ($password.val() === '') {
                    $span.eq(1).html('请输入您的登录密码');
                    $span.eq(1).css({
                        color: 'red'
                    })
                }

                if ($username.val() !== '' && $password.val() !== '') {
                    $.ajax({
                        type: 'post',
                        url: 'http://10.31.163.10/dangdang/php/login.php',
                        data: {
                            username: $username.val(),
                            password: s.hex_sha1($password.val())
                        }
                    }).done(function(data) {
                        console.log(data);
                        if (!data) {
                            $span.eq(0).html('用户名或密码输入错误，请核对后重新输入');
                            $span.eq(0).css({
                                color: 'red'
                            })
                        } else {
                            if ($autologin.prop('checked')) {
                                $.cookie('autologin', [$username.val(), $password.val()], {
                                    expires: 7,
                                    path: '/'
                                });
                            } else {
                                $.cookie('autologin', [$username.val(), $password.val()], {
                                    expires: -1,
                                    path: '/'
                                });
                            }

                            $.cookie('username', $username.val(), {
                                expires: 7,
                                path: '/'
                            });
                            location.href = 'index123.html';
                        }
                    })
                }
                return false;
            })

            // 自动登录
            $autologin.on('click', function() {
                if ($autologin.prop('checked')) {
                    $(this).next().html('请勿在公用电脑上勾选此选项');
                } else {
                    $(this).next().html('七天自动登录');
                }
            })
            if ($.cookie('autologin')) {
                let uname = $.cookie('autologin').split(',')[0];
                let password = $.cookie('autologin').split(',')[1];
                $username.val(uname);
                $password.val(password);

                $autologin.prop('checked', true);
                $('#autologin').next('em').html('请勿在公用电脑上勾选此选项');
            }
        }
    }
})

// b14fde150b6c47f7ed186cd001883cf8ff6ba522
// b14fde150b6c47f7ed186cd001883cf8ff6ba522