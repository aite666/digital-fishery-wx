const app = getApp();
var wxCharts = require("../../../utils/wxcharts.js");
var HTTP = require("../../../utils/request.js");

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
        lineChart: null,
        lineChart2: null,
        lineChart3: null,
        lineChartDict: null,
    },
    attached() {
        this.getBlockList()
        this.getWeather()
        this.initCanvas1()
        this.initCanvas2()
        this.initCanvas3()
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
        initCanvas(canvasId) {
            var windowWidth = 325;
            try {
                var res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth + 10;
            } catch (e) {
                console.error('getSystemInfoSync failed!');
            }
            console.log(windowWidth)
            var simulationData = this.createSimulationData();
            if (!this.lineChartDict) {
                this.lineChartDict = {
                    'lineCanvas': null,
                    'lineCanvas2': null,
                    'lineCanvas3': null,
                }
            }
            console.log(this.lineChartDict)
            this.lineChartDict[canvasId] = new wxCharts({
                canvasId: canvasId,
                type: 'line',
                categories: simulationData.categories,
                animation: true,
                // background: '#f5f5f5',
                series: [{
                    name: '成交量1',
                    data: simulationData.data,
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }, {
                    name: '成交量2',
                    data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }],
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    title: '成交金额 (万元)',
                    format: function (val) {
                        return val.toFixed(2);
                    },
                    min: 0
                },
                width: windowWidth,
                height: 150,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                    lineStyle: 'curve'
                }
            }, this);
        },
        initCanvas1() {
            var windowWidth = 325;
            try {
                var res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth + 10;
            } catch (e) {
                console.error('getSystemInfoSync failed!');
            }
            var simulationData = this.createSimulationData();
            this.lineChart = new wxCharts({
                canvasId: 'lineCanvas',
                type: 'line',
                categories: simulationData.categories,
                animation: true,
                // background: '#f5f5f5',
                series: [{
                    name: '成交量1',
                    data: simulationData.data,
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }, {
                    name: '成交量2',
                    data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }],
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    title: '成交金额 (万元)',
                    format: function (val) {
                        return val.toFixed(2);
                    },
                    min: 0
                },
                width: windowWidth,
                height: 150,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                    lineStyle: 'curve'
                }
            }, this);
        },
        initCanvas2() {
            var windowWidth = 325;
            try {
                var res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth + 10;
            } catch (e) {
                console.error('getSystemInfoSync failed!');
            }
            var simulationData = this.createSimulationData();
            this.lineChart2 = new wxCharts({
                canvasId: 'lineCanvas2',
                type: 'line',
                categories: simulationData.categories,
                animation: true,
                // background: '#f5f5f5',
                series: [{
                    name: '成交量1',
                    data: simulationData.data,
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }, {
                    name: '成交量2',
                    data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }],
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    title: '成交金额 (万元)',
                    format: function (val) {
                        return val.toFixed(2);
                    },
                    min: 0
                },
                width: windowWidth,
                height: 150,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                    lineStyle: 'curve'
                }
            }, this);
        },
        initCanvas3() {
            var windowWidth = 325;
            try {
                var res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth + 10;
            } catch (e) {
                console.error('getSystemInfoSync failed!');
            }
            var simulationData = this.createSimulationData();
            this.lineChart3 = new wxCharts({
                canvasId: 'lineCanvas3',
                type: 'line',
                categories: simulationData.categories,
                animation: true,
                // background: '#f5f5f5',
                series: [{
                    name: '成交量1',
                    data: simulationData.data,
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }, {
                    name: '成交量2',
                    data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                    format: function (val, name) {
                        return val.toFixed(2) + '万';
                    }
                }],
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    title: '成交金额 (万元)',
                    format: function (val) {
                        return val.toFixed(2);
                    },
                    min: 0
                },
                width: windowWidth,
                height: 150,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                    lineStyle: 'curve'
                }
            }, this);
        },
        createSimulationData: function () {
            var categories = [];
            var data = [];
            for (var i = 0; i < 10; i++) {
                categories.push('2016-' + (i + 1));
                data.push(Math.random() * (20 - 10) + 10);
            }
            // data[4] = null;
            return {
                categories: categories,
                data: data
            }
        },
        touchHandler: function (e) {
            // console.log(this.lineChartDict)
            // let lineChart = this.lineChartDict['lineCanvas']
            // console.log(lineChart.getCurrentDataIndex(e));
            console.log(this.lineChart.getCurrentDataIndex(e))
            this.lineChart.showToolTip(e, {
                // background: '#7cb5ec',
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data
                }
            });
        },
        touchHandler2: function (e) {
            // console.log(this.lineChartDict)
            // let lineChart = this.lineChartDict['lineCanvas2']
            // console.log(lineChart.getCurrentDataIndex(e));
            console.log(this.lineChart2.getCurrentDataIndex(e))
            this.lineChart2.showToolTip(e, {
                // background: '#7cb5ec',
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data
                }
            });
        },
        touchHandler3: function (e) {
            // console.log(this.lineChartDict)
            // let lineChart = this.lineChartDict['lineCanvas3']
            // console.log(lineChart)
            // console.log(lineChart.getCurrentDataIndex(e));
            console.log(this.lineChart3.getCurrentDataIndex(e))
            this.lineChart3.showToolTip(e, {
                // background: '#7cb5ec',
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data
                }
            });
        },
        blockPickerChange(e) {
            console.log(e);
            let blockId = this.data.blockList[e.detail.value].id
            this.setData({
                blockSelected: e.detail.value,
                blockId: blockId,
            })
            this.getStats(blockId)
        },
    }
})