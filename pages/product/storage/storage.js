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
        blockId: null,
        blockList: [],
        recordDate: util.formatDate(new Date()),
        stepperWidth: '100px',
        storageTypeList: [],
        multiArray: [],
        multiIndex: [null, null],
        storageNameList: [],
        storageNameSelected: 0,
        storageNameId: null,
        storageQuantity: 0,
        quantity: 0,
        unit: "克",
        remark: "",
    },
    lifetimes: {
        attached: function () {
            console.log('attached')
            let blockList = wx.getStorageSync('blockList')
            this.setData({
                blockList: blockList,
            })
            let storageTypeList = wx.getStorageSync('storageTypeList')
            console.log(storageTypeList)
            if (storageTypeList) {
                this.getMultiArray(storageTypeList)
                this.setData({
                    storageTypeList: storageTypeList,
                })
            } else {
                this.getStorageTypeList()
            }
        },
    },
    methods: {
        blockPickerChange(e) {
            let blockId = this.data.blockList[e.detail.value].id
            this.setData({
                blockSelected: e.detail.value,
                blockId: blockId,
            })
        },
        storageNamePickerChange(e) {
            let storageNameId = this.data.storageNameList[e.detail.value].id
            let storageQuantity = this.data.storageNameList[e.detail.value].quantity
            let unit = this.data.storageNameList[e.detail.value].unit
            this.setData({
                storageNameSelected: e.detail.value,
                storageNameId: storageNameId,
                storageQuantity: storageQuantity,
                unit: unit,
            })
        },
        quantityChange(e) {
            this.setData({
                quantity: e.detail
            })
        },
        recordDateChange(e) {
            this.setData({
                recordDate: e.detail.value
            })
        },
        remarkInput(e) {
            this.setData({
                remark: e.detail.value
            })
        },
        getStorageTypeList() {
            var that = this
            let url = '/productCategory/list/withChildren'
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data)
                    var dataList = res.data
                    var storageTypeList = []
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i]["name"] == "养殖鱼类") {
                            continue;
                        }
                        storageTypeList.push(dataList[i])
                    }
                    that.setData({
                        storageTypeList: storageTypeList,
                    })
                    that.getMultiArray(storageTypeList)
                    // 这里将storageTypeList放入全局缓存里面
                    wx.setStorageSync('storageTypeList', storageTypeList)
                }
            })
        },
        getMultiArray(storageTypeList) {
            let multiArray = [[], []]
            if (storageTypeList.length > 0) {
                for (let i = 0; i < storageTypeList.length; i++) {
                    multiArray[0].push(storageTypeList[i].name)
                }
                if (storageTypeList[0].children.length > 0) {
                    for (let i = 0; i < storageTypeList[0].children.length; i++) {
                        multiArray[1].push(storageTypeList[0].children[i].name)
                    }
                }
            }
            console.log(multiArray)
            this.setData({
                multiArray: multiArray,
            })
        },
        MultiChange(e) {
            console.log(e.detail.value)
            var multiIndex = e.detail.value
            var storageType = this.data.storageTypeList[multiIndex[0]]
            if (storageType.children.length > 0) {
                if (multiIndex[1] == null) {
                    multiIndex[1] = 0
                }
                storageType = storageType.children[multiIndex[1]]
            } else {
                multiIndex[1] = null
            }
            this.setData({
                multiIndex: multiIndex,
                storageNameSelected: 0,
                storageNameId: null,
            })
            if (storageType) {
                this.getStorageNameList(storageType.id)
            }
        },
        MultiColumnChange(e) {
            let data = {
                multiArray: this.data.multiArray,
                multiIndex: this.data.multiIndex
            };
            data.multiIndex[e.detail.column] = e.detail.value;
            switch (e.detail.column) {
                case 0:
                    data.multiArray[1] = []
                    var index = data.multiIndex[0]
                    var storageTypeList = this.data.storageTypeList
                    if (storageTypeList[index].children.length > 0) {
                        for (let i = 0; i < storageTypeList[index].children.length; i++) {
                            data.multiArray[1].push(storageTypeList[index].children[i].name)
                        }
                        data.multiIndex[1] = 0;
                    }
                    data.multiIndex[1] = null;
                    break;
            }
            this.setData(data);
        },
        getStorageNameList(storageId) {
            var that = this
            let url = '/storage/list?pageNum=1&pageSize=1000000&productCategoryId=' + storageId
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data)
                    that.setData({
                        storageNameList: res.data.list
                    })
                }
            })
        },
        onSubmit() {
            var that = this
            wx.showModal({
                title: '使用农资',
                content: '确定要提交数据吗？',
                cancelText: '取消',
                confirmText: '确定',
                success: res => {
                    if (res.confirm) {
                        var url = '/storageRecord/create'
                        var storageUseDetail = {
                            'storageId': that.data.storageNameId,
                            'blockId': that.data.blockId,
                            'productCategoryId': null,
                            'recordTime': that.data.recordDate + ' 00:00:00',
                            'type': 2,
                            'status': 1,
                            'quantity': that.data.quantity,
                        }
                        HTTP(url, 'post', storageUseDetail).then((res) => {
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
                blockId: null,
                recordDate: util.formatDate(new Date()),
                stepperWidth: '100px',
                multiIndex: [null, null],
                storageNameList: [],
                storageNameSelected: 0,
                storageNameId: null,
                storageQuantity: 0,
                quantity: 0,
                unit: "克",
                remark: "",
            })
        }
    }
})