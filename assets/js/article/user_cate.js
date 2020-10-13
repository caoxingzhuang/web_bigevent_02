$(function () {
    // 文章列表展示
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl_cate', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var layer = layui.layer;
    // 显示添加文章分类列表
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    });

    var indexEdit = null;
    // 确认添加文章类别
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('添加成功');
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    });
    // 修改 提交
    $('tbody').on('click', '#btnedit', function () {
        var Id = $(this).attr('data-id');
        var form = layui.form;
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });
        // 获取id值
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
        // 发起修改请求
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {

                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('文章类别更新成功');
                    initArtCateList();
                    layer.close(indexEdit);
                }
            });
        });
    });

    // 删除
    $('tbody').on('click', '#btndelete', function () {
        var Id = $(this).attr('data-id');
        layer.confirm('确认删除么?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除成功欧');
                    initArtCateList();
                    layer.close(index);
                }

            })

            layer.close(index);
        });
    })
})