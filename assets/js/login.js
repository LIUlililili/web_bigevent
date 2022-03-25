$(function() {
    $(link_reg).on('click', function() {
        $('.login').hide();
        $('.reg').show();

    })
    $(link_login).on('click', function() {
        $('.login').show();
        $('.reg').hide();

    })

    var form = layui.form;
    var layer = layui.layer;
    form.verify({
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                var pwd = $('.reg [name=password]').val();
                if (pwd !== value) return '两次密码不一致';
            }
        })
        //注册表单的提交
    $('.reg-form').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('.reg-form [name=username]').val(),
            password: $('.reg-form [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                console.log(res)
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录！');
            $('#link_login').click();
        })
    })

    //登陆表单的提交事件
    $('#form-login').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('登录成功');
                localStorage.setItem('token', res.token)
                location.href = 'http://127.0.0.1:5500/index.html';

            }
        })
    })

})