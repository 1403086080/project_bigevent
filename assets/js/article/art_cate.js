$(function () {
  initArticleCaseList()
  var layer = layui.layer;
  let index = null
  let indexEdit = null
  var form = layui.form
  // 为添加类别按钮绑定添加事件
  $("#btnAddCate").on("click", function () {
    index = layer.open({
      title: '添加文章分类',
      // 定义层类型
      type: 1,
      // 定义宽高
      area: ['500px', '250px'],
      // 文本内容(可以在里面写标签但是很麻烦,所以用模板写)
      content: $("#dialog-add").html()
    });
  })

  // 通过代理的方式,为动态新建的添加分类表单绑定submit事件
  $('body').on("submit", '#dialog-add-form', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: "/my/article/addcates",
      data: $("#dialog-add-form").serialize(),
      success: res => {
        // console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        // layer.msg(res.message)
        initArticleCaseList()
        console.log(index);
        // 根据索引关闭dealog对话框
        layer.close(index)
      }
    })
  })

  // 通过代理的方式,为动态新建的修改分类表单的编辑按钮绑定事件
  $('body').on("click", "#edit", function () {
    // 修改的弹出层
    indexEdit = layer.open({
      title: '修改文章分类',
      // 定义层类型
      type: 1,
      // 定义宽高
      area: ['500px', '250px'],
      // 文本内容(可以在里面写标签但是很麻烦,所以用模板写)
      content: $("#dialog-edit").html()
    });
    // 通过自定义属性获取id
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: res => {
        // console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        // layer.msg(res.message)
        // 快速赋值
        form.val('edit-form', res.data)
      }
    })

  })

  // 通过代理的方式,为动态新建的修改分类表单的提交按钮绑定事件
  $("body").on("submit", "#dialog-edit-form", function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: res => {
        // console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        // layer.msg(res.message)
        // 关闭对话框
        layer.close(indexEdit)
        // 刷新列表
        initArticleCaseList()
      }
    })
  })

  // 通过代理的方式,为动态新建的修改分类表单的删除按钮绑定事件
  $("body").on("click", "#delete-id", function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: "GET",
        url: '/my/article/deletecate/' + id,
        success: res => {
          // console.log(res);
          if (res.status !== 0) return layer.msg(res.message)
          // 关闭弹出层
          // layer.msg(res.message)
          // 刷新列表数据
          initArticleCaseList()
        }
      })
      layer.close(index);
    });
  })
})

// 获取文章分类的列表
function initArticleCaseList() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: res => {
      // console.log(res);
      // 3 调用模板
      let val = template("my-template", res)
      // 每次循环完都有一个返回值
      // console.log(val);
      // 4 渲染
      $("tbody").html(val)
    }
  })
}