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

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1、消除token字段
            localStorage.removeItem('token');
            //2、强制跳转到login页面
            location.href = '/login.html'
        }
    }
})