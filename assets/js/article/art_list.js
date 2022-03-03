$(function () {
  var form = layui.form
  var laypage = layui.laypage;
  // 参数对象(用于获取文章的列表数据)
  let q = {
    pagenum: 1, // 页码值,默认请求第一页的数据
    pagesize: 3, // 每页显示几条数据,默认每页显示2条
    cate_id: '', // 文章分类的Id
    state: '' // 文件的发布状态
  }

  initCateList()
  // 获取文章列表数据的方法
  function initCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: res => {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        let val = template("my-template", res)
        $("tbody").html(val)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 格式化时间
  template.defaults.imports.dateFormat = function (val) {
    let dt = new Date(val)
    let y = dt.getFullYear()
    let m = zero(dt.getMonth() + 1)
    let d = zero(dt.getDate())

    let hh = zero(dt.getHours())
    let mm = zero(dt.getMinutes())
    let ss = zero(dt.getSeconds())
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  // 补0
  function zero(n) {
    return n > 9 ? n : '0' + n
  }
  initCate()
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        // console.log(res);
        if (res.status !== 0) return
        // 调用模板引擎渲染分类的可选项
        let val = template("my-select-template", res)
        $("[name=cate_id]").html(val)
        // 通知layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定submit事件
  $("#form-search").submit(function (e) {
    // 停止默认提交行为
    e.preventDefault()
    // 获取表单中选中项下拉框的值
    let cate_id = $("[name=cate_id]").val()
    let state = $("[name=state]").val()
    // 为查询参数q对象重新赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件,重新渲染表格的数据
    initCateList()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    //执行一个laypage实例(调用laypage.render方法来渲染分页的结构)
    laypage.render({
      elem: 'pagebox', // 分页容器的ID
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      // 下拉选择框选择请求多少条
      limits: [1, 3, 5, 10],
      // 自定义排版
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 分页发生切换的时候,触发jump回调
      // 触发jump回调的方式有2种
      // 1 点击页码的时候,会触发jump回调
      // 2 只要调用了 laypage.render()方法 , 就会触发jump回调(这才是死循环的原因)
      jump: function (obj, first) {
        // console.log(obj.curr);
        // console.log(first);
        // 把最新的页码值,赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数,赋值到q这个查询参数对象的pagesize属性中 
        q.pagesize = obj.limit //得到每页显示的条数
        // 此时不能直接调用重新获取数据的方法,会出现死循环(因为会大家互相调用)
        if (first) return
        // 通过first的值,来判断是通过哪种方式,触发的jump回调
        // 如果first的值为true,证明是方式2触发的
        // 为undefined则是方式1,切换分页时触发的
        initCateList()
      }
    });
  }


  // 通过代理的形式,为删除按钮绑定点击事件处理函数(删除)
  $("body").on("click", "#delete-id", function () {
    // 获取当前页面还有多少个删除按钮(通过所剩按钮多少来控制q.pagenum)
    let len = $(".btn-delete").length
    console.log(len);
    // 获取文章的id
    let id = $(this).attr("data-id")
    // 询问用户是否删除
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: res => {
          console.log(res);
          if (res.status !== 0) return
          // 当删除完成后,需要判断当前这一页中,是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值-1之后,
          // 再重新调用方法重新渲染表格
          layer.msg(res.message)
          console.log(len);
          // 如果length = 1,证明删除完毕以后,页面上就没有任何数据了
          if (len === 1) {
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          // 重新获取数据
          initCateList()
        }
      })

      layer.close(index);
    });
  })


  $("body").on("click", "#edit", function () {
    let id = $(this).attr("data-id")
    location.href = '/article/art_upload.html?id=' + id
  })



})

