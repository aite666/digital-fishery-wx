const app = getApp();
var HTTP = require("../../../utils/request.js");

Page({
    data: {
        inspectionList: []
    },
    onLoad: function (options) {
        this.getInspectionList()
    },
    onReady: function () {

    },
    getInspectionList() {
        let adminId = app.globalData.userInfo.id
        let url = '/inspection/list?adminId=' + adminId + '&pageNum=1&pageSize=10000000'
        HTTP(url, 'get', {}).then((res) => {
            if (res) {
                let inspectionList = []
                for (let i = 0; i < res.data.list.length; i++) {
                    let item = res.data.list[i]
                    inspectionList.push({
                        blockName: item.blockName,
                        productData: item.productData,
                        environmentData: item.environmentData,
                        characterDescription: item.characterDescription,
                        image: item.images ? item.images.split(',')[0] : '',
                        inspectionDate: item.inspectionTime.substring(5,10)
                    })
                }
                this.setData({
                    inspectionList : inspectionList
                })
            }
        })
    }
})