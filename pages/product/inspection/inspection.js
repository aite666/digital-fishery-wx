Component({
    options: {
        addGlobalClass: true,
    },
    properties: {

    },
    data: {
        index: null,
        picker: ['测试区块1', '测试区块2', '测试区块3'],
        imgList: [],
        modalName: null,
    },
    methods: {
        PickerChange(e) {
            console.log(e);
            this.setData({
                index: e.detail.value
            })
        },
        ChooseImage() {
            wx.chooseImage({
                count: 4, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success: (res) => {
                    if (this.data.imgList.length != 0) {
                        this.setData({
                            imgList: this.data.imgList.concat(res.tempFilePaths)
                        })
                    } else {
                        this.setData({
                            imgList: res.tempFilePaths
                        })
                    }
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
                title: '召唤师',
                content: '确定要删除这段回忆吗？',
                cancelText: '再看看',
                confirmText: '再见',
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
        textareaAInput(e) {
            this.setData({
                textareaAValue: e.detail.value
            })
        },
    }
})