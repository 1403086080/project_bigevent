$(function () {
  let form = layui.form
  let params = location.search.substr(1);
  // console.log(params)
  let arr = params.split('=');
  // console.log(arr)
  let id = arr[1];
  // console.log(id);
  getId()
  function getId() {
    $.ajax({
      method: "GET",
      url: "/my/article/" + id,
      success: res => {
        console.log(res);
        if (res.status !== 0) return
        form.val("form-upload-filter", res.data)
      }
    })
  }

  // $("#form-upload").submit(function (e) {
  //   e.preventDefault()
  //   let fd = new FormData($(this)[0])
  //   fd.append('id', +id)
  //   fd.append("content", "111")
  //   fd.append('state', art_state)
  //   fd.forEach((i, x) => {
  //     console.log(x, i);
  //   })
  //   $image
  //     .cropper('getCroppedCanvas', {
  //       // 创建一个 Canvas 画布
  //       width: 400,
  //       height: 280
  //     })
  //     .toBlob(function (blob) {
  //       // 将 Canvas 画布上的内容，转化为文件对象
  //       // 得到文件对象后，进行后续的操作
  //       // 5 将文件对象,存储到fd中
  //       fd.append("cover_img", blob)
  //       $.ajax({
  //         method: 'POST',
  //         url: '/my/article/edit',
  //         data: fd,
  //         contentType: false,
  //         processData: false,
  //         success: res => {
  //           console.log(res);
  //         }
  //       })
  //     })
  // })

  getCateList()
  // 定义加载分类的方法
  function getCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        // console.log(res);
        if (res.status !== 0) return
        let val = template("my-template", res)
        // 调用模板引擎,渲染分类的下拉菜单
        $("[name=cate_id]").html(val)
        // 让layui监听到动态添加的可选项,需要调用这个方法
        // 一定要记得
        form.render()
      }
    })
  }

  // 模拟人手点击文件上传
  $("#btn").on("click", function () {
    $("#filebtn").click()
  })

  // 监听用户是否选择了图片(更换图片)
  $("#filebtn").on("change", function (e) {
    // 1. 拿到用户选择的文件
    let file = e.target.files
    console.log(file);
    // 判断用户是否选择了文件
    if (file.length <= 0) return
    // 2. 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file[0])
    // 3. 先销毁旧的裁剪区域，再重新设置图片路径 ，之后再 创建新的裁剪区域 ：
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的发布状态(发给后端用)
  let art_state = '已发布'
  // 为存为草稿按钮,绑定点击事件处理函数
  $("#btnsave").on("click", function () {
    art_state = "草稿"
  })

  // 为表单绑定submit提交事件
  $("#form-add").on("submit", function (e) {
    // 1 阻止表单默认提交行为
    e.preventDefault()
    // 2 基于form表单,快速创建一个formdata对象
    let fd = new FormData($(this)[0])
    // 3 将文章的发布状态,存到fd中
    fd.append('state', art_state)
    // fd.forEach(function (i, x) {
    // console.log(i, x);
    // i为当前项,x为当前key value的值,不是index吗?
    // })
    // 4 将封面裁剪过后的图片,输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5 将文件对象,存储到fd中
        fd.append("cover_img", blob)
        // 6 发起ajax数据请求
        publishArticle(fd)
      })
  })
  // 发布新文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意: 如果向服务器提交的是formdata格式的数据
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: res => {
        // console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        let q1 = window.parent.document.getElementById("d1")
        $(q1).removeClass('layui-this')
        let q2 = window.parent.document.getElementById("d2")
        $(q2).addClass('layui-this')
        // 发布文章成功后,跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }



  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)
})
