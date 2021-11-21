const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {

  },
  lifetimes:{
    ready:function(){
      this.CustomBar = app.globalData.CustomBar
    },
  },
  data: {
    TabCur: 0,
    CustomBar: 80,
    tabNav: ['区试巡查', '投放鱼苗', '使用农资', '鱼类出塘']
  },
  methods: {
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    }
  }
})