var HTTP = require("../../../utils/request.js");
var util = require('../../../utils/util.js')
const app = getApp();

Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        page: 1,
        per_page: 5,
        total: 0,
        newsList: [],
    },
    lifetimes: {
        attached() {
            this.getNewsList()
        },
    },
    methods: {
        getNewsList() {
            var that = this
            let url = '/news/list?pageNum=' + that.data.page + '&per_page=' + that.data.per_page
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    console.log(res.data)
                    var list = res.data.list
                    for (let i=0; i<list.length; i++) {
                        list[i]['createDate'] = util.getDateStr(list[i]['createTime'])
                    }
                    that.setData({
                        newsList: list,
                        total: res.data.total
                    })
                }
            })
        },
        getAddNewsList() {
            var that = this
            let url = '/news/list?pageNum=' + that.data.page + '&per_page=' + that.data.per_page
            HTTP(url, 'get', {}).then((res) => {
                if (res) {
                    var list = res.data.list
                    for (let i=0; i<list.length; i++) {
                        list[i]['createDate'] = util.getDateStr(list[i]['createTime'])
                    }
                    var newsList = that.data.newsList.concat(list)
                    that.setData({
                        newsList: newsList
                    })
                }
            })
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
            if (that.data.total > that.data.newsList.length) {
                that.getAddNewsList()
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