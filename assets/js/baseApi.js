// 注意:每次调用 $.get $.post $.ajax 的时候
// 会先隐式调用 ajaxprefilter 这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
  // 在发起真正的ajax请求之前,统一拼接请求的根路径
  option.url = 'http://www.liulongbin.top:3007' + option.url
  // console.log(option);

  // 统一为有权限的接口,设置headers请求头
  // 如果不是有权限的网页打印option则没有headers
  // 判断用户访问的是不是有权限的接口  
  if (option.url.indexOf('/my') !== -1) {
    option.headers = {
      // 设置空字符串是防止别人直接强访问网页
      Authorization: localStorage.getItem('token') || ""
    }
  }

  // 全局统一挂载complete
  // 不论成功还是失败,最终都会调用complete回调函数
  option.complete = res => {
    // res是服务器响应回头的成功/失败的消息
    // 在回调函数中可以使用res.responseJSON拿到服务器响应回来的数据
    // console.log(res);
    if (res.responseJSON.status === 1 || res.responseJSON.message === "身份认证失败！") {
      // 1 强制清空token
      localStorage.removeItem('token')
      // 2 强制跳转到登录页面
      location.href = '../../login.html'
    }
  }
})