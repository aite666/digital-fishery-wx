const app = getApp();

Page({
    data: {
        username: '',
        password: '',
        tabNav: ['登陆', '注册'],
        TabCur: 0,
        enterpriseSelected: 0,
        enterpriseId: null,
        enterpriseList: [],
        registerUsername: '',
        nickName: '',
        email: '',
        registerPassword: '',
    },
    onLoad: function() {
        this.getEnterpriseList()
    },
    enterpriseChange(e) {
        let enterpriseId = this.data.enterpriseList[e.detail.value].id
        this.setData({
            enterpriseSelected: e.detail.value,
            enterpriseId: enterpriseId,
        })
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id
        })
    },
    getEnterpriseList() {
        var that = this
        let url = '/enterprise/list?pageNum=1&pageSize=100000'
        wx.request({
            url: app.config.apiUrl + url,
            method: 'get',
            success(res) {
                if (res.data.code == 200) {
                    console.log(res)
                    that.setData({
                        enterpriseList: res.data.data.list,
                    })
                }
            }
        })
    },
    login() {
        var that = this
        if (!that.data.username) {
            wx.showToast({
                title: '用户名须不为空',
                icon: 'error',
                duration: 1500
            })
            return
        }
        if (!that.data.password) {
            wx.showToast({
                title: '密码须不为空',
                icon: 'error',
                duration: 1500
            })
            return
        }
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
                        } else if (res.data.status > 400) {
                            wx.showToast({
                                title: "登陆失败，请联系管理员",
                                icon: 'none',
                                duration: 3000
                            })
                        } else {
                            wx.showToast({
                                title: res.data.message,
                                icon: 'none',
                                duration: 3000
                            })
                        }
                    }
                })
            }
        })
    },
    register() {
        var that = this
        if (!that.data.registerUsername) {
            wx.showToast({
                title: '用户名须不为空',
                icon: 'error',
                duration: 1500
            })
            return
        }
        if (!that.data.registerPassword) {
            wx.showToast({
                title: '密码须不为空',
                icon: 'error',
                duration: 1500
            })
            return
        }
        let registerUser =  {
            username: that.data.registerUsername,
            nickName: that.data.nickName,
            email: that.data.email,
            password: that.data.registerPassword,
            enterpriseId: that.data.enterpriseId,
            status: 0
        }
        wx.request({
            url: app.config.apiUrl + '/admin/register',
            method: 'POST',
            data: registerUser,
            success(res) {
                // 返回值
                console.log(res)
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '注册成功，请等待管理员确认',
                        icon: 'none',
                        duration: 3000
                    })
                } else {
                    wx.showToast({
                        title: '注册失败，' + res.data.message,
                        icon: 'none',
                        duration: 3000
                    })
                }
            }
        })
    }
})