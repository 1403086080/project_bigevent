$(function () {
  getUser()
  // 193193
  // 点击按钮实现退出功能
  $("#loginout").on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function (index) {
      // 1清空本地存储中的token   
      localStorage.removeItem('token')
      // 2重新跳转到登录页面
      location.href = '../../login.html'
      // 这index是累计用户点了多少次退出,别管它就是(删不删都无所谓)
      layer.close(index);
    });
  })
})

// 获取用户的基本信息
function getUser() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token')
    // },
    success: res => {
      console.log(res);
      if (res.status !== 0) return layer.msg("获取用户信息失败")
      // 调用renderAvator函数渲染用户头像
      renderAvator(res.data)
    },
    // 全局配置了complete函数
  })
}

// 渲染用户头像
function renderAvator(user) {
  // 1 获取用户的名称
  let firststr = user.nickname || user.username
  // 2 设置欢迎的文本
  $(".welcome").html("欢迎" + firststr)
  // 3 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr('src', user.user_pic).show()
    $(".text-avator").hide()
  } else {
    // 3.2 渲染文本头像
    let val = firststr[0].toUpperCase()
    $(".layui-nav-img").hide()
    $(".text-avator").html(val)
  }
}