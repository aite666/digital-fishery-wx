// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    PageCur: 'home',
  },
  onLoad: function() {

  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})
