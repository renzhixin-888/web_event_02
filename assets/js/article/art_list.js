$(function () {
    // 美化时间过滤器
    template.defaults.imports.meihua = function (date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = buling(dt.getMonth() + 1);
        var d = buling(dt.getDate());

        var h = buling(dt.getHours());
        var f = buling(dt.getMinutes());
        var s = buling(dt.getSeconds());

        return y + '-' + m + '-' + d + '  ' + h + ':' + f + ':' + s
    }
    // 时间补零
    function buling(n) {
        return n > 10 ? n : '0' + n;
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    var q = {
        pagenum: 1,  //是	int	页码值
        pagesize: 2, //是	int	每页显示多少条数据
        cate_id: '', //否	string	文章分类的 Id
        state: '',   //否	string	文章的状态，可选值有：已发布、草稿
    }

    initTable();
    // 1. 初始化文章列表
    function initTable() {
        // 发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                //判断是否获取文章列表成功
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }

                layer.msg('获取文章列表成功')
                // 模板引擎
                var str = template('tpl-table', res)
                // 将获取好的模板引擎渲染到表格
                $('tbody').html(str)

                // 获取完后，渲染分页
                renderPage(res.total)
            }
        })
    }

    initCate();
    // 2. 初始化文章分类
    function initCate() {
        // 发起AJAX请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //  
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                layer.msg('获取文章类别成功！')
                // 调用模板引擎
                var str = template('tpl-cate', res)
                $('[name="cate_id"]').html(str);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    // 3. 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();

        // 将获取到的数据重新赋值给q
        q.state = state;
        q.cate_id = cate_id;
        // 渲染页面
        initTable();
    })

    // 4. 分页
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum,   //当前默认页码
            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 调用jump回调，分页初始化时，页面发生改变
            jump: function (obj, first) {
                // console.log(obj.curr)
                // console.log(first);
                // 把最新的页码值赋值给q
                q.pagenum = obj.curr;
                // initTable();
                // 这里不能直接调用 initTable() 方法
                // 会造成死循环，每次循环都调用 jump
                // 造成死循环的原因： ①：点击时触发 jump
                // ②：调用 laypage.render 时触发jump


                // 把最新的页码数据给q
                q.pagesize = obj.limit;

                if (!first) {
                    initTable();
                }
            }
        });

    }

    // 5.删除按钮
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('确定要删除么?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您！删除文章列表成功')
                    // 页面汇总按钮个数等于1，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;

                    initTable();
                }
            })

            layer.close(index);
        });

    })
})