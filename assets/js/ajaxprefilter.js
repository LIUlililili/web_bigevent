$.ajaxprefilter(function(option) {
    console.log(option.url)
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url
})