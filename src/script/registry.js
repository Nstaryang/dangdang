define(['jqcookie'], function() {
    return {
        init: function() {
            // 表单验证
            // 1.获取对象
            const $phone = $('#phone');
            const $password = $('#password');
            const $repass = $('#repass');
            const $yzm = $('#yzm');
            const $span = $('form p>span');
            const $em = $('form p>em');
            const $passlevel = $('.passlevel');
            const $form = $('form');
            let phonflag = false;
            let passwordflag = false;
            let repassflag = false;
            let yzmflag = false;

            // 验证手机号码
            $phone.on('focus', function() {
                console.log(1);
                $span.eq(0).html('手机号可用于登录、找回密码、接收订单通知等服务');
                $span.eq(0).css({
                    color: '#646464'
                })
                $(this).css({
                    backgroundColor: '#fff',
                    color: '#646464',
                    borderColor: '#e6e6e6'
                })
                $em.eq(0).html('');
            })
            $phone.on('blur', function() {
                let reg = /^1[345678]\d{9}/;
                if ($phone.val() !== '') {
                    if (reg.test($(this).val())) {
                        $.ajax({
                            url: 'http://10.31.163.10/dangdang/php/registry.php',
                            // url: 'http://10.31.163.10/dangdang/php/registry.php',
                            data: {
                                phone: $phone.val(),
                            }
                        }).done(function(result) {
                            if (!result) {
                                $span.eq(0).html('');
                                $em.eq(0).html('√');
                                $em.eq(0).css({
                                    color: 'green'
                                })
                                phonflag = true; // 手机验证通过
                            } else {
                                $span.eq(0).html('手机号码已注册');
                                $span.eq(0).css({
                                    color: 'red'
                                })
                                $em.eq(0).html('×');
                                $em.eq(0).css({
                                    color: 'red'
                                })
                                $(this).css({
                                    backgroundColor: '#fef0ef',
                                    color: '#ff4646',
                                    borderColor: '#ff4646'
                                })
                                phonflag = false;
                            }
                        })

                    } else {
                        $span.eq(0).html('手机格式不正确，请重新输入');
                        $span.eq(0).css({
                            color: 'red'
                        })
                        $em.eq(0).html('×');
                        $em.eq(0).css({
                            color: 'red'
                        })
                        $(this).css({
                            backgroundColor: '#fef0ef',
                            color: '#ff4646',
                            borderColor: '#ff4646'
                        })
                        phonflag = false;
                    }
                } else {
                    $span.eq(0).html('');
                    phonflag = false;
                }
            })


            // 密码验证
            $password.on('focus', function() {
                    $span.eq(1).html('密码为6-20个字符，可由英文、数字及符号组成');
                    $span.eq(1).css({
                        color: '#646464'
                    })
                    $(this).css({
                        backgroundColor: '#fff',
                        color: '#646464',
                        borderColor: '#e6e6e6'
                    })
                    $em.eq(1).html('');
                })
                //输入判断
            $password.on('input', function() {
                $span.eq(1).css({
                    display: 'none'
                })
                $passlevel.css({
                    display: 'block'
                })
                if ($password.val().length >= 6) {
                    $em.eq(1).html('√');
                    $em.eq(1).css({
                        color: 'green'
                    })
                }
                let numreg = /[0-9]/g;
                let letterreg = /[a-zA-Z]/g;
                let otherreg = /\W/g;
                let cnreg = /[\u4e00-\u9fa5]/g;
                let count = 0;

                if (numreg.test($password.val())) {
                    count++;
                }
                if (letterreg.test($password.val())) {
                    count++;
                }
                if (otherreg.test($password.val())) {
                    count++;
                }
                if (cnreg.test($password.val())) {
                    $span.eq(1).html('密码应由英文、数字及符号组成,请重新输入')
                    $span.eq(1).css({
                        color: 'red'
                    })
                    $em.eq(1).html('×');
                    $em.eq(1).css({
                        color: 'red'
                    })
                    $(this).css({
                        backgroundColor: '#fef0ef',
                        color: '#ff4646',
                        borderColor: '#ff4646'
                    })
                    $span.eq(1).css({
                        display: 'block'
                    })
                    $passlevel.css({
                        display: 'none'
                    })
                    passwordflag = false;
                }
                switch (count) {
                    case 0:
                        $span.eq(1).css({
                            display: 'block'
                        })
                        $span.eq(1).html('密码为6-20个字符，可由英文、数字及符号组成');
                        $passlevel.css({
                            display: 'none'
                        })
                        passwordflag = false;
                        break;
                    case 1:
                        $passlevel.find('i').eq(0).css({
                            backgroundColor: '#ff3600'
                        });
                        $passlevel.find('i').eq(1).css({
                            backgroundColor: '#d6d6d6'
                        });
                        $passlevel.find('i').eq(2).css({
                            backgroundColor: '#d6d6d6'
                        });
                        $passlevel.find('em').eq(0).html('密码过于简单');
                        passwordflag = false;
                        break;
                    case 2:
                        $passlevel.find('i').eq(1).css({
                            backgroundColor: '#ffc000'
                        });
                        $passlevel.find('i').eq(2).css({
                            backgroundColor: '#d6d6d6'
                        });
                        $passlevel.find('em').eq(0).html('试试字母、符号、数字的组合更安全');
                        passwordflag = true;
                        break;
                    case 3:
                        $passlevel.find('i').eq(2).css({
                            backgroundColor: '#71b300'
                        });
                        $passlevel.find('em').eq(0).html('密码设置安全，放心使用');
                        passwordflag = true;
                        break;

                }
            })
            $password.on('blur', function() {
                if ($password.val().length > 0) {
                    if ($password.val().length < 6 || $password.val().length > 20) {
                        $span.eq(1).html('密码为6-20个字符，请重新输入')
                        $span.eq(1).css({
                            color: 'red'
                        })
                        $em.eq(1).html('×');
                        $em.eq(1).css({
                            color: 'red'
                        })
                        $(this).css({
                            backgroundColor: '#fef0ef',
                            color: '#ff4646',
                            borderColor: '#ff4646'
                        })
                        $span.eq(1).css({
                            display: 'block'
                        })
                        $passlevel.css({
                            display: 'none'
                        })
                        passwordflag = false;
                    }
                } else {
                    $span.eq(1).html('');
                    passwordflag = false;
                }

            })

            // 确认密码
            $repass.on('focus', function() {
                $span.eq(2).html('请再次输入密码');
                $span.eq(2).css({
                    color: '#646464'
                })
                $(this).css({
                    backgroundColor: '#fff',
                    color: '#646464',
                    borderColor: '#e6e6e6'
                })
                $em.eq(2).html('');
            })
            $repass.on('blur', function() {
                    if ($repass.val() !== '') {
                        if ($repass.val() === $password.val()) {
                            $em.eq(2).html('√');
                            $em.eq(2).css({
                                color: 'green'
                            })
                            $span.eq(2).html('');
                            repassflag = true;
                        } else {
                            $span.eq(2).html('两次输入的密码不一致，请重新输入')
                            $span.eq(2).css({
                                color: 'red'
                            })
                            $em.eq(2).html('×');
                            $em.eq(2).css({
                                color: 'red'
                            })
                            $(this).css({
                                backgroundColor: '#fef0ef',
                                color: '#ff4646',
                                borderColor: '#ff4646'
                            })
                            repassflag = false;
                        }
                    } else {
                        $span.eq(2).html('');
                        repassflag = false;
                    }
                })
                // 随机验证码
            function ranyzm() {
                let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let str = '';
                for (let i = 0; i < 4; i++) {
                    let ranindex = parseInt(Math.random() * arr.length);
                    if (arr[ranindex].charCodeAt() > 65) {
                        str += Math.random() > 0.5 ? arr[ranindex].toLowerCase() : arr[ranindex];
                    } else {
                        str += arr[ranindex];
                    }
                }
                $('.yzmpic').html(str).css({
                    color: 'rgb(' + Math.ceil(Math.random() * 255) + ',' + Math.ceil(Math.random() * 255) + ',' + Math.ceil(Math.random() * 255) + ')'
                });
                $('.yzmpic').attr('data-aa', str);

            }
            ranyzm();
            $('.yzmpic').on('click', function() {
                ranyzm();
                return false;
            })
            $('.changepic').on('click', function() {
                ranyzm();
            })


            // 验证码验证
            $yzm.attr('maxlength', 4);
            $yzm.on('focus', function() {
                $span.eq(3).html('请填写图片中的字符，不区分大小写');
                $span.eq(3).css({
                    color: '#646464'
                })
                $(this).css({
                    backgroundColor: '#fff',
                    color: '#646464',
                    borderColor: '#e6e6e6'
                })
                $em.eq(3).html('');
            })
            $yzm.on('blur', function() {
                if ($yzm.val() === "") {
                    $span.eq(3).html('');
                }
            })
            $yzm.on('input', function() {
                $span.eq(3).html('');
                if ($yzm.val().length === 4) {
                    if ($yzm.val().toLowerCase() === $('.yzmpic').attr('data-aa').toLowerCase()) {
                        $em.eq(3).html('√');
                        $em.eq(3).css({
                            color: 'green'
                        })
                        $span.eq(3).html('');
                        yzmflag = true;
                    } else {
                        $span.eq(3).html('图形验证码输入错误，请重新输入')
                        $span.eq(3).css({
                            color: 'red'
                        })
                        $em.eq(3).html('×');
                        $em.eq(3).css({
                            color: 'red'
                        })
                        $(this).css({
                            backgroundColor: '#fef0ef',
                            color: '#ff4646',
                            borderColor: '#ff4646'
                        })
                        yzmflag = false;
                        ranyzm();
                    }
                } else {
                    $span.eq(3).html('请填写图片中的字符，不区分大小写');
                    $span.eq(3).css({
                        color: '#646464'
                    })
                    $(this).css({
                        backgroundColor: '#fff',
                        color: '#646464',
                        borderColor: '#e6e6e6'
                    })
                    $em.eq(3).html('');
                    yzmflag = false;
                }
            })

            $form.on('submit', function() {
                if ($phone.val() === '') {
                    $span.eq(0).html('手机号码不能为空')
                    $span.eq(0).css({
                        color: 'red'
                    })
                    $em.eq(0).html('×');
                    $em.eq(0).css({
                        color: 'red'
                    })
                    $phone.css({
                        backgroundColor: '#fef0ef',
                        borderColor: '#ff4646'
                    })
                    phonflag = false;
                }
                if ($password.val() === '') {
                    $span.eq(1).html('登陆密码不能为空')
                    $span.eq(1).css({
                        color: 'red'
                    })
                    $em.eq(1).html('×');
                    $em.eq(1).css({
                        color: 'red'
                    })
                    $password.css({
                        backgroundColor: '#fef0ef',
                        borderColor: '#ff4646'
                    })
                    passwordflag = false;
                }
                if ($repass.val() === '') {
                    $span.eq(2).html('密码不能为空')
                    $span.eq(2).css({
                        color: 'red'
                    })
                    $em.eq(2).html('×');
                    $em.eq(2).css({
                        color: 'red'
                    })
                    $repass.css({
                        backgroundColor: '#fef0ef',
                        borderColor: '#ff4646'
                    })
                    repassflag = false;
                }
                if ($yzm.val() === '') {
                    $span.eq(3).html('请输入图形验证码')
                    $span.eq(3).css({
                        color: 'red'
                    })
                    $em.eq(3).html('×');
                    $em.eq(3).css({
                        color: 'red'
                    })
                    $yzm.css({
                        backgroundColor: '#fef0ef',
                        borderColor: '#ff4646'
                    })
                    yzmflag = false;
                } else {
                    if (!yzmflag) {
                        $span.eq(3).html('图形验证码输入错误，请重新输入')
                        $span.eq(3).css({
                            color: 'red'
                        })
                        $em.eq(3).html('×');
                        $em.eq(3).css({
                            color: 'red'
                        })
                        $yzm.css({
                            backgroundColor: '#fef0ef',
                            color: '#ff4646',
                            borderColor: '#ff4646'
                        })
                        yzmflag = false;
                        ranyzm();
                    }
                }
                if (!phonflag || !passwordflag || !repassflag || !yzmflag) {
                    return false;
                }else{
                    alert(1);
                    $.cookie('username', $phone.val(), {
                        expires: 7,
                        path: '/'
                    })
                }
                
            })
        }
    }
})