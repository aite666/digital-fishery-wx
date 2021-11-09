var WxParse = require('../../../wxParse/wxParse.js');

Page({
    data: {
    },
    onLoad: function (options) {
        this.initNews()
    },
    initNews() {
        var that = this
        var article = "<h1>现今的很多人</h1><p>可能对于七彩神仙鱼这个名字非常的陌生，但是如果把它放在面前，估计有很多人看过。这类鱼是具有极高观赏性，身体的色彩非常的漂亮，所以很多人都非常的喜爱这类鱼。那么，七彩神仙鱼寿命是几年？对于这个问题，我们来看看下面的详细介绍吧。</p>"
        WxParse.wxParse('article', 'html', article, that, 5);
    }
})
