$(function () {
    // 1.指定验证规则
    // form 是从layui中提取出来的
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            "密码是6~12位之间的"
        ],
        // 旧密码和新密码不能相同
        samePwd: function (value) {
            // value:新密码的值
            if (value === $('[name = "oldPwd"]').val()) {
                return '新密码不能和旧密码相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    // 2.表单提交
    // 2.1 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 快速获取表单的数据
            data:$(this).serialize(),
            success: function (res) {
                // console.log(res)
                // 看是否获取成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                // 若成功,则修改,并且重置表格
                layui.layer.msg(res.message)

                $('.layui-form')[0].reset();
            }
        })
    })
}) 