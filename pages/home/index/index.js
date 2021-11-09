const app = getApp();
var wxCharts = require("../../../utils/wxcharts.js");

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {},
    data: {
        blockSelected: 0,
        blockList: ['测试区块1', '测试区块2', '测试区块3'],
        lineChart: null,
        lineChart2: null,
        lineChart3: null,
        lineChartDict: null,
        batchCount: 0,
        deviceCount: 0,
        fishCount: 0,
    },
    ready() {
        // this.initCanvas('lineCanvas')
        // this.initCanvas('lineCanvas2')
        // this.initCanvas('lineCanvas3')
        this.initData()
        this.initCanvas1()
        this.initCanvas2()
        this.initCanvas3()
    },
    attached() {
        console.log("success")
        let that = this;
        wx.showLoading({
            title: '数据加载中',
            mask: true,
        })
        let i = 0;
        numDH();

        function numDH() {
            if (i < 2) {
                setTimeout(function () {
                    that.setData({
                        batchCount: i,
                        deviceCount: i,
                        fishCount: i
                    })
                    i++
                    numDH();
                }, 2)
            } else {
                that.setData({
                    batchCount: that.coutNum(3),
                    deviceCount: that.coutNum(4),
                    fishCount: that.coutNum(5)
                })
            }
        }
        wx.hideLoading()
    },
    methods: {
        onLoad() {
            console.log(111);
        },
        initData() {
            console.log('initData');
            wx.request({
                url: app.config.apiUrl + 'qrCode/1',
                method: 'get',
                success(res) {
                    if (res) {
                        console.log(res.data) // 打印查看是否请求到接口数据
                    } else {
                        console.log('没有数据')
                    }
                }
            })
        },
        coutNum(e) {
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
            this.setData({
                blockSelected: e.detail.value
            })
        },
    }
})