$(function () {
  var form = layui.form
  var layer = layui.layer

  // 自定义规则
  form.verify({
    nickname: function (val) {
      if (val.length > 6) {
        return "用户昵称为1~6位"
      }
    }
  })

  // 初始化用户的基本信息(回填)
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: res => {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        // 调用form.val快速为表单赋值
        // 第一个参数为form表单起标签,第二个为需要填充的数据
        form.val("formUserInfo", res.data)
      }
    })
  }

  // 重置按钮(回填)
  $("#resetbtn").on("click", function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    // 重新调用接口查询用户信息
    initUserInfo()
  })
  // 提示用户不能修改登录账户名
  $("#jz").on('focus', function () {
    layer.msg("不能修改用户名")
  })

  // 监听修改表单提交事件
  $(".layui-form").on('submit', function (e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    // 发起修改请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: res => {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        // 调用父页面中的方法,重新渲染用户的头像和用户的信息
        window.parent.getUser()
      }
    })
  })



  initUserInfo()
})

