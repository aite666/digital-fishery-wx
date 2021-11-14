var HTTP = require("../../../utils/request.js");
var config = require('../../js/config.js')
var util = require('../../../utils/util.js')
const app = getApp();

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
    },
    data: {
        blockSelected: 0,
        blockId: 0,
        blockList: [],
        imgList: [],
        productData: null,
        environmentData: null,
        characterDescription: null,
    },
    lifetimes: {
        attached: function () {
            console.log('attached')
            let blockList = wx.getStorageSync('blockList')
            console.log(blockList)
            this.setData({
                blockList: blockList
            })
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
        ChooseImage() {
            var that = this
            wx.chooseImage({
                count: 4, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], //从相册选择
                success: (res) => {
                    const tempFilePaths = res.tempFilePaths
                    console.log(tempFilePaths)
                    //上传图片
                    wx.uploadFile({
                        url: config.apiUrl + '/minio/upload',
                        method: 'POST',
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {},
                        header: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + wx.getStorageSync('token'),
                        },
                        success: function (res) {
                            //上传成功
                            console.log(res)
                            var data = JSON.parse(res.data)
                            if (data.code == 200) {
                                let imageUrlList = [data.data.url]
                                if (that.data.imgList.length != 0) {
                                    that.setData({
                                        imgList: that.data.imgList.concat(imageUrlList)
                                    })
                                } else {
                                    that.setData({
                                        imgList: imageUrlList
                                    })
                                }
                            } else {
                                wx.showToast({
                                    title: '上传失败',
                                    icon: 'error',
                                    duration: 1500
                                })
                            }
                        },
                        fail: function (res) {
                            wx.showToast({
                                title: '上传失败',
                                icon: 'error',
                                duration: 1500
                            })
                        },
                    })
                }
            });
        },
        ViewImage(e) {
            wx.previewImage({
                urls: this.data.imgList,
                current: e.currentTarget.dataset.url
            });
        },
        DelImg(e) {
            wx.showModal({
                title: '区试巡查',
                content: '确定要删除图片吗？',
                cancelText: '取消',
                confirmText: '确定',
                success: res => {
                    if (res.confirm) {
                        this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                        this.setData({
                            imgList: this.data.imgList
                        })
                    }
                }
            })
        },
        productDataInput(e) {
            this.setData({
                productData: e.detail.value
            })
        },
        environmentDataInput(e) {
            this.setData({
                environmentData: e.detail.value
            })
        },
        characterDescriptionInput(e) {
            this.setData({
                characterDescription: e.detail.value
            })
        },
        onSubmit() {
            var that = this
            wx.showModal({
                title: '区试巡查',
                content: '确定要提交数据吗？',
                cancelText: '取消',
                confirmText: '确定',
                success: res => {
                    if (res.confirm) {
                        var url = '/inspection/create'
                        var inspectionDetail = {
                            'blockId': that.data.blockId,
                            'inspectionTime': util.formatTime(new Date()),
                            'productData': that.data.productData,
                            'environmentData': that.data.environmentData,
                            'characterDescription': that.data.characterDescription,
                            'images': that.data.imgList.join(','),
                            'createUser':  app.globalData.userInfo.nickName,
                        }
                        HTTP(url, 'post', inspectionDetail).then((res) => {
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
                blockList: [],
                imgList: [],
                productData: null,
                environmentData: null,
                characterDescription: null,
            })
        }
    }
})