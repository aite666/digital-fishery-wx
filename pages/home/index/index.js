const app = getApp();
var wxCharts = require("../../../utils/wxcharts.js");
var HTTP = require("../../../utils/request.js");
var util = require('../../../utils/util.js')

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {},
    data: {
        blockSelected: 0,
        blockId: 0,
        blockList: [],
        temperature: 0,
        weather: '',
        humidity: 0,
        batchCount: 0,
        deviceCount: 0,
        fishCount: 0,
        chartDict: {},
        nodeChartList: [],
        colorOptions: {
            '溶解氧': ['purple', '#6739b6'],
            '水温': ['blue', '#7cb5ec'],
            'PH': ['orange', '#f37b1d'],
            '温度': ['olive', '#8dc63f'],
            '湿度': ['green', '#39b54a'],
            '其他': ['cyan', '#1cbbb4'],
        },
        windowWidth: 325
    },
    attached() {
        try {
            var res = wx.getSystemInfoSync();
            this.data.windowWidth = res.windowWidth + 10;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        this.getBlockList()
        this.getWeather()
        // let that = this;
        // wx.showLoading({
        //     title: '数据加载中',
        //     mask: true,
        // })
        // let i = 0;
        // numDH();

        // function numDH() {
        //     if (i < 2) {
        //         setTimeout(function () {
        //             that.setData({
        //                 batchCount: i,
        //                 deviceCount: i,
        //                 fishCount: i
        //             })
        //             i++
        //             numDH();
        //         }, 2)
        //     } else {
        //         that.setData({
        //             batchCount: that.countNum(3),
        //             deviceCount: that.countNum(4),
        //             fishCount: that.countNum(5)
        //         })
        //     }
        // }
        // wx.hideLoading()
    },
    methods: {
        getBlockList() {
            var that = this
            let url = '/block/list?pageNum=1&pageSize=100000'
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data) // 打印查看是否请求到接口数据
                    let blockList = res.data.list
                    that.setData({
                        blockList: blockList,
                        blockId: blockList[0].id
                    })
                    that.getStats(blockList[0].id)
                    // 这里将blockList放入全局缓存里面
                    wx.setStorageSync('blockList', blockList)
                    that.getDeviceHistoryData(blockList[0].id)
                }
            })
        },
        getWeather() {
            var that = this
            const amapApi = 'https://restapi.amap.com/v3/weather/weatherInfo'
            const amapKey = 'c1b0fc3e2561e58f94074ab68ee341f2'
            let url = amapApi + '?key=' + amapKey + '&extensions=base&city=330523'
            wx.request({
                url: url,
                method: 'get',
                success(res) {
                    if (res) {
                        console.log(res.data) // 打印查看是否请求到接口数据
                        let data = res.data.lives[0]
                        that.setData({
                            weather: data.weather,
                            humidity: data.humidity,
                            temperature: data.temperature,
                        })
                    }
                }
            })
        },
        getStats(blockId) {
            wx.showLoading({
                title: '数据加载中',
                mask: true,
            })
            this.getProductCategoryList(blockId)
            this.getDeviceNum(blockId)
            // this.getDeviceHistoryData(blockId)
        },
        getProductCategoryList(blockId) {
            var that = this
            let url = '/batch/listProductCategory?blockId=' + blockId
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data) // 打印查看是否请求到接口数据
                    let productCategoryNum = 0;
                    let batchNum = 0;
                    for (let item of res.data) {
                        productCategoryNum += 1;
                        batchNum += item.batchCount;
                    }
                    that.setData({
                        fishCount: that.countNum(productCategoryNum),
                        batchCount: that.countNum(batchNum),
                    })
                }
            })
        },
        getDeviceNum(blockId) {
            var that = this
            let url = '/device/list?blockId=' + blockId + '&pageNum=1&pageSize=1000000'
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data) // 打印查看是否请求到接口数据
                    that.setData({
                        deviceCount: that.countNum(res.data.total)
                    })
                    wx.hideLoading()
                }
            })
        },
        countNum(e) {
            if (e > 1000 && e < 10000) {
                e = (e / 1000).toFixed(1) + 'k'
            }
            if (e > 10000) {
                e = (e / 10000).toFixed(1) + 'W'
            }
            return e
        },
        getDeviceHistoryData(blockId) {
            let params = {
                startTime: util.formatTime(new Date(new Date().getTime() - 3600 * 1000 * 24 * 30), "yyyy-MM-dd hh:mm:ss"),
                endTime: util.formatTime(new Date(), "yyyy-MM-dd hh:mm:ss"),
                blockId: blockId
            }
            let url = '/device/node/charts'
            HTTP(url, 'get', params).then((res) => {
                if (res) {
                    console.log(res.data) // 打印查看是否请求到接口数据
                    let deviceData = {};
                    for (let item of res.data) {
                        let deviceAddr = item.deviceAddr;
                        let deviceName = item.deviceName;
                        let nodeId = item.nodeId;
                        let blockId = item.blockId;
                        let blockName = item.blockName;
                        let data = item.data;
                        for (let subItem of data) {
                            let recordTime = subItem.recordTime;
                            let registerId = subItem.registerId;
                            let registerName = subItem.registerName;
                            let color = this.data.colorOptions['其他'][0]
                            if (Object.keys(this.data.colorOptions).indexOf(registerName) > -1) {
                                color = this.data.colorOptions[registerName][0]
                            }
                            let unit = subItem.unit;
                            let value = subItem.value;
                            let dataKey = deviceAddr + "#" + nodeId + "#" + registerId;
                            if (Object.keys(deviceData).indexOf(dataKey) > -1) {
                                deviceData[dataKey]["data"].push({
                                    time: recordTime,
                                    value: value,
                                })
                                deviceData[dataKey]['lastValue'] = value
                            } else {
                                deviceData[dataKey] = {
                                    dataKey: dataKey,
                                    deviceAddr: deviceAddr,
                                    deviceName: deviceName,
                                    nodeId: nodeId,
                                    registerId: registerId,
                                    registerName: registerName,
                                    blockId: blockId,
                                    blockName: blockName,
                                    unit: unit,
                                    lastValue: value,
                                    color: color,
                                    data: [{
                                        time: recordTime,
                                        value: value,
                                    }, ],
                                };
                            }
                        }
                    }
                    let nodeChartList = Object.values(deviceData);
                    this.setData({
                        nodeChartList: nodeChartList
                    })
                    setTimeout(() => {
                        this.initAllChart(nodeChartList)
                    }, 100)
                    
                }
            })
        },
        initAllChart(nodeChartList) {
            for (let i=0; i<nodeChartList.length; i++) {
                this.initCanvas(nodeChartList[i])
            }
        },
        initCanvas(data) {
            let categories = []
            let valueList = []
            // 这里超过maxNum个点的话就自动稀释
            let maxNum = 30
            if (data.data.length < maxNum) {
                for (let i=0; i<data.data.length; i++) {
                    let time = data.data[0]['time'].substring(5, 16)
                    categories.push(time)
                    valueList.push(data.data[0]['value'])
                }
            } else {
                let ratio = Math.ceil(data.data.length / maxNum);
                console.log('radio:' + ratio)
                for (let i=0; i<data.data.length; i++) {
                    if (i % ratio == 0) {
                        let time = data.data[0]['time'].substring(5, 16)
                        categories.push(time)
                        valueList.push(data.data[0]['value'])
                    }
                }
            }
            let canvasId = 'chart_' + data.dataKey
            let color = this.data.colorOptions['其他'][1]
            if (Object.keys(this.data.colorOptions).indexOf(data.registerName) > -1) {
                color = this.data.colorOptions[data.registerName][1]
            }
            console.log(data.registerName + color)
            var that = this
            this.data.chartDict[canvasId] = new wxCharts({
                canvasId: canvasId,
                type: 'line',
                categories: categories,
                animation: false,
                // background: '#f5f5f5',
                series: [{
                    name: data.registerName,
                    data: valueList,
                    color: color,
                    format: function (val, name) {
                        return val.toFixed(2) + data.unit;
                    }
                }],
                xAxis: {
                    disableGrid: true,
                },
                yAxis: {
                    title: data.registerName + ' (' + data.unit + ')',
                    format: function (val) {
                        return val.toFixed(2);
                    },
                    min: 0
                },
                width: that.data.windowWidth,
                height: 180,
                dataLabel: false,
                dataPointShape: true,
                // enableScroll: true,
                extra: {
                    lineStyle: 'curve'
                }
            }, this);
        },
        touchHandler: function (e) {
            let canvasId = e.target.dataset.key
            let lineChart = this.data.chartDict[canvasId]
            // lineChart.scrollStart(e);
            lineChart.showToolTip(e, {
                // background: '#7cb5ec',
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data
                }
            }); 
        },
        // moveHandler(e) {
        //     let canvasId = e.target.dataset.key
        //     let lineChart = this.data.chartDict[canvasId]
        //     lineChart.scroll(e);
        // },
        // touchEndHandler: function (e) {
        //     let canvasId = e.target.dataset.key
        //     let lineChart = this.data.chartDict[canvasId]
        //     lineChart.scrollEnd(e);
        //     lineChart.showToolTip(e, {
        //         // background: '#7cb5ec',
        //         format: function (item, category) {
        //             console.log(item)
        //             return category + ' ' + item.name + ':' + item.data
        //         }
        //     });      
        // },
        blockPickerChange(e) {
            console.log(e);
            let blockId = this.data.blockList[e.detail.value].id
            this.setData({
                blockSelected: e.detail.value,
                blockId: blockId,
            })
            this.getStats(blockId)
            for (let i=0; i< this.data.nodeChartList.length; i++) {
                let canvasId = 'chart_' + this.data.nodeChartList[i].dataKey
                this.data.chartDict[canvasId].context.clearRect(0, 0, this.data.windowWidth, 180)
            }
            this.setData({
                nodeChartList: []
            })
            setTimeout(() => {
                this.getDeviceHistoryData(blockId)
            },500)
        },
    }
})