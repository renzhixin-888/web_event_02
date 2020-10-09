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
$image.cropper(options)


// 上传图片的按钮隐藏
$('#file').hide();
// 2. 图片上传
$('#btnChooseImage').on('click', function () {
    $('#file').click()
})

// 3.修改图片
var layer = layui.layer;
$('#file').on('change', function (e) {
    // 获取到用户点击的图片
    console.log(e.target.files)
    var file = e.target.files;
    if (file.length === 0) {
        return layer.msg('请输入用户的头像');
    }
    var file = e.target.files[0];

    // 声明变量用来赋值用户上传的图片的路径
    var newImgURL = URL.createObjectURL(file);

    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
})


// 4.上传头像
$('#btnUpload').on('click', function () {
    // 4.1获取base64 类型的头像
    var dataURL = $image

        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')
    console.log(dataURL)
    console.log(typeof dataURL)

    // 发送AJAX请求
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL, 
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }

            layer.msg('恭喜您! 头像上传成功');

            // 渲染到左侧和上侧头像区
            window.parent.getUserInfo();
        }
    })
})
getUserInfo();
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }

            // 若成功渲染用户信息
            // randerAvatar(res.data);
            // 渲染用户头像

            $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', res.data.user_pic)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        }
    })
}
