$(function () {
    getUserInfo();
    
    // 提取layer
    var layer = layui.layer;
    // 给退出设置点击事件
    $('#btnLogout').on('click', function () {
        // 框架询问
        layer.confirm('是否确定要离开', { icon: 3, title: '提示' }, function (index) {
            // 删除本地存储
            localStorage.removeItem('token');
            // 跳转页面
            location.href = "/login.html";
            // 关闭资讯
            layer.close(index);
        })
    })
})
// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res)
            // 若获取不成功，返回后台传输过来的信息
            if (res.status !== 0) {
                return layui.msg(res.message)
            }

            // 若成功则渲染页面
            randerAvatar(res.data)
        }
    })
}

// 渲染页面
function randerAvatar(user) {
    // 1.渲染用户的名称
    var name = user.nickname || user.username;
    // 获取左侧欢迎用户
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);

    // 2.渲染头像
    if (user.user_pic !== null) {
        // 则为图片头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        // 则为文本头像
        $('.layui-nav-img').hide();
        // 文本为名称的第一个元素
        var first = name[0].toUpperCase();
        $('.user-avatar').show().html();
    }
}