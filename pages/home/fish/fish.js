const app = getApp();
var HTTP = require("../../../utils/request.js");

Page({
    data: {
        elements: [
        ],
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
        console.log(options.blockId)
        this.getProductCategoryList(options.blockId)
    },
    getProductCategoryList(blockId) {
        var that = this 
        let url = '/batch/listProductCategory?blockId=' + blockId
        HTTP(url, 'get', {}).then((res) => {
            if (res) {
                console.log(res.data) // 打印查看是否请求到接口数据
                let dataList = res.data
                    let elements = []
                    for (let i=0;i<dataList.length;i++) {
                        let color = 'blue'
                        let image = '鱼'
                        let fishName = dataList[i].productCategoryName
                        if (Object.keys(that.data.fishOptions).indexOf(fishName) > -1) {
                            color = that.data.fishOptions[fishName]
                            image = fishName
                        }
                        let data = {
                            name: fishName,
                            batchTotal: dataList[i].batchTotal.replaceAll(',', '+'),
                            batchCount: dataList[i].batchCount,
                            color: color,
                            image: image,
                        }
                        elements.push(data)
                    }
                    that.setData({
                        elements: elements,
                    })
            }
        })
    },

})