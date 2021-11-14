const app = getApp();
var HTTP = require("../../../utils/request.js");

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    userInfo: null,
    nickName: null,
    email: null,
    alertNum: 120,
  },
  attached() {
    console.log("success")
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo,
      nickName: app.globalData.userInfo.nickName,
      email: app.globalData.userInfo.email,
    })
  },
  methods: {
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    nickNameInput(e) {
      this.setData({
        nickName: e.detail.value
      })
    },
    emailInput(e) {
      this.setData({
        email: e.detail.value
      })
    },
    onSubmit() {
      var that = this
      let url = '/admin/update/' + this.data.userInfo.id
      this.data.userInfo.nickName = this.data.nickName
      this.data.userInfo.email = this.data.email
      HTTP(url, 'post', this.data.userInfo).then((res) => {
        console.log(res)
        if (res.code == 200) {
          app.globalData.userInfo = this.data.userInfo
          that.setData({
            userInfo: that.data.userInfo
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
        }
      })
      this.setData({
        modalName: null
      })
    }
  }
})