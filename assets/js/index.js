$(function() {
    getUserInfo()

    $('#loginOut').on('click', function() {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //1、去除token
            localStorage.removeItem('token');

            //2、跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token' || '')
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg
            }

            avatarRender(res.data);

        }

        // complete: function(res) {
        //     console.log(res)
        //     if (res.responseJSON.status !== 0 || res.responseJSON.message !== "获取用户基本信息成功！") {
        //         //1、消除token字段
        //         localStorage.removeItem('token');
        //         //2、强制跳转到login页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}


function avatarRender(userInfo) {
    //优先使用用户的nickname，如果没有nickname就使用username
    var uname = userInfo.nickname || userInfo.username;
    //渲染右上角和左侧欢迎栏用户名称
    $('.uname').html(uname);
    // console.log(uname)ssss
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname);
    //渲染用户头像
    //如果已经设置了头像,就用设置的头像
    if (userInfo.user_pic) {
        $('.user_avatar').hide();
        $('.layui-nav-img').attr('src', userInfo.user_pic).show();

    } else {
        $('.layui-nav-img').hide();
        var firstname = uname.slice(0, 1).toUpperCase();
        $('.user_avatar').html(firstname);
    }
}