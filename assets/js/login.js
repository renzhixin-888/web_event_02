$(function () {
    // 1.去注册
    $("#link_reg").on('click', function () {
        $(".login_box").hide();
        $(".reg_box").show();
    })
    // 2.去登录
    $("#link_login").on('click', function () {
        $(".login_box").show();
        $(".reg_box").hide();
    })

    // 3.从layui 中获取form
    var form = layui.form;
    form.verify({
        // 自定义检测规则
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位，且不能输入空格'],
        repwd: function (value) {
            var pwd = $('.reg_box input[name="password"]').val();
            if (pwd !== value) {
                return "两次输入的密码不一致";
            }
        }
    })
    // 4.注册表单
    var layer = layui.layer;
    $("#form_reg").on('submit', function (e) {
        // 1.阻止表单默认行为
        e.preventDefault();
        // 2.发起Ajax请求
        $.ajax({
            method: "POST",
            url: "http://ajax.frontend.itheima.net/api/reguser",
            data: {
                username: $('.reg_box [name="username"]').val(),
                password: $('.reg_box [name="password"]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 否则注册成功
                layer.msg("恭喜您，注册成功")
                // 手动切换登录表单
                $("#link_login").click();
                // 重置form表单
                $("#form_reg")[0].reset();
            }
        })
    })
    // 5.注册
    $("#form_login").on('submit', function (e) {
        // 1.阻止表单默认行为
        e.preventDefault();
        // 2.发起Ajax请求
        $.ajax({
            method: "POST",
            url: "http://ajax.frontend.itheima.net/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }
                // 否则注册成功
                layer.msg("恭喜您，登录成功")
                // 保存token
                localStorage.setItem("token", res.token);
                // 页面的跳转
                location.href = "/index.html";
            }
        })
    })
})