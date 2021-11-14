var HTTP = require("../../../utils/request.js");
var config = require('../../js/config.js')
var util = require('../../../utils/util.js')
const app = getApp();

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {},
    data: {
        blockSelected: 0,
        blockId: 0,
        blockList: [],
        fishSelected: 0,
        fishId: 0,
        fishList: [],
        unitSelected: 0,
        unit: null,
        unitList: ['公斤', '尾'],
        origin: null,
        farmDate: util.formatDate(new Date()),
        stepperWidth: '100px',
        quantity: 0,
        unitPrice: 0,
        amount: 0,
    },
    lifetimes: {
        attached: function () {
            console.log('attached')
            let blockList = wx.getStorageSync('blockList')
            this.setData({
                blockList: blockList,
            })
            let fishList = wx.getStorageSync('fishList')
            if (fishList) {
                this.setData({
                    fishList: fishList,
                })
            } else {
                this.getFishList()
            }
        },
    },
    methods: {
        getFishList() {
            var that = this
            let url = '/productCategory/list/withParentName?parentName=养殖鱼类'
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data) // 打印查看是否请求到接口数据
                    let fishList = res.data
                    that.setData({
                        fishList: fishList,
                    })
                    // 这里将fishList放入全局缓存里面
                    wx.setStorageSync('fishList', fishList)
                }
            })
        },
        blockPickerChange(e) {
            let blockId = this.data.blockList[e.detail.value].id
            this.setData({
                blockSelected: e.detail.value,
                blockId: blockId,
            })
        },
        fishPickerChange(e) {
            let fishId = this.data.fishList[e.detail.value].id
            this.setData({
                fishSelected: e.detail.value,
                fishId: fishId,
            })
        },
        unitPickerChange(e) {
            let unit = this.data.unitList[e.detail.value]
            this.setData({
                unitSelected: e.detail.value,
                unit: unit,
            })
        },
        originInput(e) {
            this.setData({
                origin: e.detail.value
            })
        },
        farmDateChange(e) {
            this.setData({
                farmDate: e.detail.value
            })
        },
        quantityChange(e) {
            this.setData({
                quantity: e.detail
            })
        },
        unitPriceChange(e) {
            this.setData({
                unitPrice: e.detail
            })
        },
        amountChange(e) {
            this.setData({
                amount: e.detail
            })
        },
        onSubmit() {
            var that = this
            wx.showModal({
                title: '投放鱼苗',
                content: '确定要提交数据吗？',
                cancelText: '取消',
                confirmText: '确定',
                success: res => {
                    if (res.confirm) {
                        var url = '/batch/create'
                        var batchDetail = {
                            'blockId': that.data.blockId,
                            'productCategoryId': that.data.fishId,
                            'farmTime': that.data.farmDate + ' 00:00:00',
                            'origin': that.data.origin,
                            'quantity': that.data.quantity,
                            'unitPrice': that.data.unitPrice,
                            'amount': that.data.amount,
                            'status': 1,
                            'unit': that.data.unit,
                        }
                        HTTP(url, 'post', batchDetail).then((res) => {
                            console.log(res)
                            if (res.code == 200) {
                                wx.showToast({
                                    title: '提交成功',
                                    icon: 'success',
                                    duration: 1500
                                })
                                that.resetForm()
                            } else {
                                wx.showToast({
                                    title: '提交失败',
                                    icon: 'error',
                                    duration: 1500
                                })
                            }
                        })
                    }
                }
            })
        },
        resetForm() {
            this.setData({
                blockSelected: 0,
                blockId: 0,
                fishSelected: 0,
                fishId: 0,
                unitSelected: 0,
                unit: null,
                origin: null,
                farmDate: util.formatDate(new Date()),
                quantity: 0,
                unitPrice: 0,
                amount: 0,
            })
        }
    }
})