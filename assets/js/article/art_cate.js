$(function () {
    // 1. 初始化文章类别
    initArtCateList();
    function initArtCateList() {
        // 发起ajax请求，获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                // 获取数据成功后将数据渲染到页面
                var str = template('tpl-table', res)
                // 渲染到页面
                $('tbody').html(str)
            }
        })
    }

    // 2. 为添加按钮添加事件
    $('#btnAddCate').on('click', function () {
        // 点击添加后跳出弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            // 内容区域使用模板字符串渲染
            content: $('#dialog-add').html()
        });

    })

    // 3. 绑定完事件后进行添加数据，并渲染到页面
    var indexAdd = null;
    // 监听表单提交事件，因为表单是动态生成的所以需要添加事件委托
    $("body").on('submit', '#form-add', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                // 判断是否添加数据成功
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 若成功则弹出返回的信息
                layui.layer.msg(res.message)
                // 并将添加的数据渲染到页面
                initArtCateList();
                // 添加完成后自动关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 4.修改展示表单
    var indexEdit = null;
    var form = layui.form;
    // 给表单确认修改按钮 添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 跟添加的布局相似
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        // 获取自定义属性Id ,发送AJAX请求渲染数据
        var Id = $(this).attr('data-id');
        // console.log(Id)
        // 发起ajax请求,获取修改的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                // console.log(res)
                // 给form-edit 赋值
                form.val("form-edit", res.data)
            }
        })

        // 5.修改 - 提交
        // 监听表单的提交事件
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    // console.log(res)
                    // 判断是否修改成功
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 若获取成功，渲染页面
                    initArtCateList();
                    layer.msg("恭喜您，修改信息成功")
                    layer.close(indexEdit)
                }

            })
        })








    })


    // 6.删除操作
    // 给删除按钮添加点击操作，用事件委托（因为删除按钮是动态生成的）
    $('tbody').on('click', '.btn-delete', function () {
        // 获取动态生成的表格中的删除的自定义属性
        var Id = $(this).attr('data-id');
        // 显示询问框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发起AJAX请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    // console.log(res)
                    // 判断是否删除成功
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    // 渲染页面
                    initArtCateList();
                    layer.msg("恭喜您,删除信息成功")
                    layer.close(index);
                }
            })
        });
    })






})