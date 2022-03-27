$.ajaxPrefilter(function(option) {
    // console.log(option.url)
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token' || '')
        }
    }
    //设置访问权限
    option.complete = function(res) {

        if (res.responseJSON.status !== 0 || res.responseJSON.message !== "获取用户基本信息成功！") {
            //1、消除token字段
            localStorage.removeItem('token');
            //2、强制跳转到login页面
            location.href = '/login.html'
        }
    }
})