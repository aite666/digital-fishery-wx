const app = getApp();
var HTTP = require("../../../utils/request.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        alarmList: []
    },
    onLoad: function () {
        this.getAlarmList()
    },
    getAlarmList() {
        console.log(app.globalData.userInfo)
        let userId = app.globalData.userInfo.id
        let url = '/alarm/list?userId=' + userId + '&pageNum=1&pageSize=10000000'
        HTTP(url, 'get', {}).then((res) => {
            if (res) {
                let alarmList = []
                for (let i = 0; i < res.data.list.length; i++) {
                    alarmList.push({
                        description: res.data.list[i].description,
                        alarmTime: res.data.list[i].alarmTime
                    })
                }
                console.log(alarmList)
                this.setData({
                    alarmList : alarmList
                })
            }
        })
    }
})