Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        page: 1,
        per_page: 5,
        count: 5,
        totalcount: 15,
        list: [1, 2, 3, 4, 5],
    },
    lifetimes: {
        attached() {
            this.getList()
        },
    },
    methods: {
        isCard(e) {
            this.setData({
                isCard: e.detail.value
            })
        },
        getList() {
            console.log('getList')
        },
        scrollHandler() {
            console.log('scrollHandler')
            var that = this;
            var page = that.data.page
            var per_page = that.data.per_page
            page = page + 1
            wx.showLoading({
                title: '正在加载中',
                mask: true
            })
            that.setData({
                page: page
            })
            console.log(page);
            if (that.data.totalcount > that.data.list.length) {
                for (let i=1;i<per_page + 1;i++) {
                    that.data.list.push((page - 1)*per_page + i)
                }
                that.data.count = that.data.list.length
                console.log(that.data.list)
                that.setData({
                    list: that.data.list
                })
            } else {
                that.setData({
                    page: page - 1
                })
            }
            setTimeout(function(){
                wx.hideLoading()
            }, 500)
        },
    }
})