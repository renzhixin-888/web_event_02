$(function () {
    var form = layui.form;
    // 1.定义验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度为1~6"
            }
        }
    })
    initUserInfo();
    // 2.初始化用户信息
    var layer = layui.layer;
    function initUserInfo() {
        // 先获取用户信息
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    // 若没有获取到
                    return layer.msg(res.message);
                }

                console.log(res)
                // 若获取到 则渲染页面
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.重置页面
    $('#btnRest').on('click', function (e) {
        // 阻止页面默认提交行为
        e.preventDefault();
        // 重新获取数据并渲染
        initUserInfo();
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 若成功
                console.log(res);
                layer.msg("恭喜您，修改信息成功");
                // 调用父框架的全局方法
                window.parent.getUserInfo();
            }
        })
    })
})