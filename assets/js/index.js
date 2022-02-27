// 193193
$(function () {
  // 从layui中获取form对象
  let form = layui.form
  // 从layui中导入msg提示消息对象
  let layer = layui.layer;
  // 点击去注册按钮
  $('#login-btn').on('click', function () {
    $('.login').hide()
    $('.register').show()
    $("#username").focus()
  })
  // 点击去登录按钮
  $('#register-btn').on('click', function () {
    $('.login').show()
    $('.register').hide()
  })
  // console.log(form);
  // 通过form.verify()函数自定义校验规则(它有2种定义规则的方法)
  form.verify({
    // 自定义一个叫做psd校验规则
    psd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致的规则
    repeatpsd: function (value) {
      // 通过形参value拿到的是确认密码框中的值
      // 还需要拿到密码框中的值
      // 然后进行一次等于的判断
      // 判断失败return一个消息即可
      let psd = $("#password").val()
      // console.log(value);
      // console.log(psd);
      if (value !== psd) {
        // console.log(1);
        // $("#repwd").val("")
        return '两次密码不一致'
      }
      // console.log('ok');
    }
  })
  // 监听注册表单的提交事件
  $("#formevent").on("submit", function (e) {
    // 阻止默认行为的提交
    e.preventDefault()
    // 发起ajaxPOST请求
    $.ajax({
      method: "POST",
      url: 'http://www.liulongbin.top:3007/api/reguser',
      data: {
        username: $("#username").val(),
        password: $("#password").val()
      },
      success: res => {
        console.log(res);
        if (res.status !== 0) {
          layer.msg(res.message);
          return
        }
        $("#username").val("");
        $("#password").val("");
        $("#repwd").val("");
        layer.msg('注册成功,请登录');
        // 模拟人的点击行为
        $("#register-btn").click()
      }
    })
  })
  // 监听登录表单登录事件
  $("#formlogin").submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      url: '/api/login',
      success: res => {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        // 将登录成功的token字符串,保存到localstore中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '../../index.html'
        layer.msg(res.message)
      }
    })
  })
})