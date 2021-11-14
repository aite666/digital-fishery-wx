const app = getApp();
var HTTP = require("../../../utils/request.js");

Page({
    data: {
        batchList: [],
        fishOptions: {
            '青鱼': 'green',
            '草鱼': 'olive',
            '鲢鱼': 'grey',
            '鳙鱼': 'cyan',
            '鲤鱼': 'purple',
            '鲫鱼': 'mauve',
            '鳊鱼': 'pink',
            '黑鱼': 'brown',
            '黄鱼': 'orange',
        },
    },
    onLoad: function (options) {
        this.getBatchList(options.blockId)
    },
    getBatchList(blockId) {
        var that = this
        let url = '/batch/list?blockId=' + blockId + '&pageNum=1&pageSize=10000000'
        HTTP(url, 'get', {}).then((res) => {
            if (res) {
                console.log(res.data) // 打印查看是否请求到接口数据
                let dataList = res.data.list
                let batchList = []
                for (let i = 0; i < dataList.length; i++) {
                    let data = dataList[i]
                    let color = 'blue'
                    let image = '鱼'
                    let fishName = dataList[i].productCategoryName
                    if (Object.keys(that.data.fishOptions).indexOf(fishName) > -1) {
                        color = that.data.fishOptions[fishName]
                        image = fishName
                    }
                    data['imageColor'] = color
                    data['imageName'] = image
                    data['farmDate'] = data['farmTime'].substring(5, 10)
                    batchList.push(data)
                }
                console.log(batchList)
                that.setData({
                    batchList: batchList,
                })
            }
        })
    }
})