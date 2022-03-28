$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    $('#btnChoosePic').on('click', function() {
        $('#file').click();
    })

    //TODO:销毁默认的图片，把img的src指向新的被选中的图片
    $('#file').on('change', function(e) {
        var filesList = e.target.files;
        if (filesList === 0) return layui.layer.msg('请选择图片')

        var file = e.target.files[0];
        //  console.log(file)
        // var imgURL = URL.createObjectURL(file)
        let binaryData = [];
        binaryData.push(file);
        var imgURL = window.URL.createObjectURL(new Blob(binaryData));

        //  console.log(imgURL)
        $('#image').cropper('destroy').attr('src', imgURL).cropper(options)
    })


    $('#btnUploadImg').on('click', function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('上传头像失败!')
                layui.layer.msg('上传头像成功!');

                window.parent.getUserInfo();
            }
        })




    })


})