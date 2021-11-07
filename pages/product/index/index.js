Component({
  options: {
    addGlobalClass: true,
  },
  properties: {

  },
  data: {
    TabCur: 0,
    tabNav: ['区试巡查', '投放鱼苗', '使用农资', '鱼类出塘']
  },
  methods: {
    tabSelect(e) {
      console.log(e);
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    }
  }
})