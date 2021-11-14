const app = getApp();

Page({
    data: {
        username: '',
        password: ''
    },
    onChange(event) {
      // event.detail 为当前输入的值
      console.log(event.detail);
    },
    login() {
        var that = this
        wx.login({
            success: res => {
                console.log(res)
                wx.request({
                    url: app.config.apiUrl + '/admin/wechat/bind',
                    method: 'POST',
                    data: {
                        code: res.code,
                        username: that.data.username,
                        password: that.data.password
                    },
                    success(res) {
                        // 返回值
                        console.log(res)
                        if (res.data.code == 200) {
                            wx.setStorageSync('token', res.data.data.token)
                            app.globalData.userInfo = res.data.data.umsAdmin;
                            wx.reLaunch({
                                url: '/pages/index/index',
                            });
                        } else {
                            
                        }
                    }
                })
            }
        })
    }


})