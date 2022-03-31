$(function() {
    //定义layer来接收layui.layer
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义一个查询参数对象q存放需要上传给服务器的参数对象
    var q = {
        pagenum: 1, //当前页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //所选分类id
        state: '' //所选文章状态
    }
    initTable();
    //定义一个表格渲染函数，因为不管是什么操作后都需要表格的结果
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                // console.log(res)
                // layer.msg('获取文章列表数据成功！')
                //TODO:在页面渲染获取到的表格
                var htmlStr = template('art-list', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    //美化时间的函数
    template.defaults.imports.dataFormat = function(date) {
            var dt = new Date(date);
            var Y = dt.getFullYear();
            var M = padZero(dt.getMonth() + 1);
            var D = padZero(dt.getDate());
            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getMinutes());
            var ss = padZero(dt.getSeconds());

            return Y + '-' + M + '-' + D + '-' + hh + '-' + mm + '-' + ss;

        }
        //补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initCate();
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //根据选择的分类和状态重新渲染表格数据
    $('#search-cate').on('submit', function(e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    })


    //定义一个分页的渲染函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //存放的容器，注意，是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            curr: q.pagenum, //当前页面，起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    //文章的删除按钮的功能
    $('body').on('click', '.btn-del', function() {
        var len = $('.btn-del').length;
        var id = $(this).attr('data-id');
        layer.confirm('is not?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')
                        //注意：当页面数据全部删除，page指向会指向前一页，但是pagenum没有变，所以渲染不出表格，表格数据为空
                        //要实现pagenum-1的功能，
                        //但是如果当前已经是第一页了，那就不能减一
                        //首先，我们需要先获取当前页面有几条数据，按钮的个数length
                    if (len === 1)
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    initTable();
                }
            })
            layer.close(index);
        });

    })

})