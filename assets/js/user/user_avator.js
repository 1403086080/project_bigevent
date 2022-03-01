// base64的好处:减少不必要的图片请求 坏处:体积比src这种大30%,且路径很长
$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 打开上传文件
  $("#btnchoseavator").on("click", function () {
    $("#file").click()
    // console.log(1);
  })

  // 为文件选择框绑定change事件
  $("#file").on("change", function (e) {
    // console.log(e);
    // 1. 拿到用户选择的文件
    var file = e.target.files
    // file是一个伪数组
    console.log(file);
    // 判断用户有没有选择图片
    if (file.length <= 0) return layer.msg('请选择图片')
    // 2. 根据选择的文件，创建一个对应的 URL 地址：
    // 因为图片渲染靠的是URL地址
    let newfile = e.target.files[0]
    let newImgURL = URL.createObjectURL(newfile)
    console.log(newImgURL);
    // 3 先销毁旧的裁剪区域,再重新设置图片路径,之后再创建新的裁剪区域 
    $('#image')
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 上传图片事件
  $("#btnupload").on("click", function () {
    // 1 要拿到用户裁剪之后的头像
    if (file.length !== 0)
      var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2 调用接口,把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: res => {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        window.parent.getUser()
      }
    })

  })
})