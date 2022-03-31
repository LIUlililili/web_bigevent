$(function() {
    initArtCate();
    var layer = layui.layer;
    var form = layui.form;
    //渲染页面的函数
    function initArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取分类信息失败');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })

    }
    // 添加文章分类的弹出层
    var indexAdd = null;
    $('#addArtCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $('#dalog-add').html()
            });
        })
        //提交添加的文章分类，并渲染到页面上
    $('body').on('submit', '#addForm', function(e) {
            e.preventDefault();
            debugger
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                // async: false,
                success: function(res) {
                    console.log(res)
                    console.log($(this).serialize())

                    if (res.status !== 0) {
                        return layer.msg('添加分类失败')
                    }


                    initArtCate();
                    layer.msg('添加分类成功');
                    layer.close(indexAdd);

                }
            })
        })
        //编辑按钮的实现
        //编辑按钮弹出层的实现,因为编辑按钮是后来渲染到页面上的，所以不能直接绑定事件，需要进行时间托管
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dalog-edit').html()
        });
        //已有数据的填充操作
        var id = $(this).attr('data-id');
        // console.log(id)
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res)
                form.val('form-edit', res.data)
            }
        })

    })

    //以事件代理的方式，为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('编辑分类上传失败！')
                }
                layer.close(indexEdit);
                layer.msg('编辑分类上传成功！')
                initArtCate();

            }
        })
    })

    //以事件代理的方式，为form-edit表单绑定delete事件
    $('body').on('click', '#btn-del', function() {
        var id_del = $(this).attr('data-id');
        // console.log(id_del);
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id_del,
                success: function(res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    initArtCate();
                }
            })

            layer.close(index);
        });


    })


})