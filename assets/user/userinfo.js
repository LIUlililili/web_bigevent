$(function() {
    //1、定义表单验证规则
    //1.1昵称规则是输入1~6为字符
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须是1~6位的字符'
            }
        }
    })

    function userInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                // console.log(res)
                form.val('userinfo', res.data);
            }
        })
    }

    userInfo();

    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        userInfo();
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('提交信息失败')
                }
                layer.msg('提交信息成功');
                window.parent.getUserInfo();
            }
        })
    })


})