$(function () {
    // 定义时间过滤器
    template.defaults.imports.Formdate = function (date) {
        let dt = new Date(date);

        let y = zeroPad(dt.getFullYear());
        let m = zeroPad(dt.getMonth() + 1);
        let d = zeroPad(dt.getDate());

        let hh = zeroPad(dt.getHours());
        let mm = zeroPad(dt.getMinutes());
        let ss = zeroPad(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    function zeroPad(n) {
        return n > 9 ? n : '0' + n;
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }
    // 初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // 
                let str = template('tpl-table', res);
                $('tbody').html(str);
                // 分页 
                renderPage(res.total);
            }
        })
    }
    // 初始化分类
    initCate();
    var form = layui.form;
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                let htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                form.render();
            }

        })
    }
    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();

        q.cate_id = cate_id;
        q.state = state;

        initTable();
    });

    // 分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,   //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }
    //删除
    $('tbody').on('click', '#btn-delete', function () {
        var Id = $(this).attr('data-id');
        layer.confirm('真的要删除么?', function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message);
                    }
                    layui.layer.msg('文章删除成功啦');
                    initTable();
                    if ($('#btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                }

            })
            layer.close(index);
        });

    })
})