const app = getApp();
var HTTP = require("../../../utils/request.js");

Page({
    data: {
        batchList: [],
        deviceOptions: {
            '采集设备': 'green',
            '视频设备': 'purple',
        },
    },
    onLoad: function (options) {
        this.getDeviceList(options.blockId)
    },
    getDeviceList(blockId) {
        var that = this
        let url = '/device/list?blockId=' + blockId + '&pageNum=1&pageSize=10000000'
        HTTP(url, 'get', {}).then((res) => {
            if (res) {
                console.log(res.data) // 打印查看是否请求到接口数据
                let dataList = res.data.list
                let deviceList = []
                for (let i = 0; i < dataList.length; i++) {
                    let data = dataList[i]
                    let color = 'blue'
                    let image = '设备'
                    let statusStr = '在线'
                    let statusColor = 'green'
                    let deviceName = dataList[i].deviceName
                    let deviceType = dataList[i].deviceType
                    if (Object.keys(that.data.deviceOptions).indexOf(deviceType) > -1) {
                        color = that.data.deviceOptions[deviceType]
                        image = deviceType
                    }
                    if (data.status == 0) {
                        statusStr = '离线'
                        statusColor = 'grey'
                        color = 'grey'
                    }
                    data['imageColor'] = color
                    data['imageName'] = image
                    data['statusStr'] = statusStr
                    data['statusColor'] = statusColor
                    deviceList.push(data)
                }
                that.setData({
                    deviceList: deviceList,
                })
            }
        })
    }
})