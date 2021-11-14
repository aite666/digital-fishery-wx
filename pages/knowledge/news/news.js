var WxParse = require('../../../wxParse/wxParse.js');
var HTTP = require("../../../utils/request.js");
var util = require('../../../utils/util.js')

Page({
    data: {
        newsDetail: null
    },
    onLoad: function (options) {
        console.log(options.newsId)
        this.initNews(options.newsId)
    },
    initNews(newsId) {
        var that = this
        let url = '/news/' + newsId
        HTTP(url, 'get', {}).then((res) => {
            if (res) {
                console.log(res.data)
                var newsDetail = res.data
                newsDetail['newsDate'] = util.getDateStr(newsDetail['newsTime'])
                that.setData({
                    newsDetail: newsDetail
                })
                var article = newsDetail.richContent
                WxParse.wxParse('article', 'html', article, that, 5);
            }
        })
    }
})
