$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    initEditor();



    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //实现选择封面图片的功能
    $('#btn-cover').on('click', function() {
        $('#coverFile').click();
    })
    $('#coverFile').on('change', function(e) {
        var file = e.target.files
        if (file.length === 0) {
            return layer.msg('请选择图片')
        }
        var newImgURL = URL.createObjectURL(file[0]);
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })

    //发布文章的功能
    //准备要上传的数据体
    var state = '已发布';

    $('#btn-save2').on('click', function() {
        state = '草稿';
    })
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // console.log($(this)[0])
        var fd = new FormData($(this)[0]);
        fd.append('state', state);
        // console.log(fd)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
            })

        publishArticle(fd);
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('上传文章失败！')
                }
                layer.msg('上传文章成功！')
                location.href = './art_list.html'
            }
        })
    }


})