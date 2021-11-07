Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
    },
    data: {
        index: null,
        picker: ['测试区块1', '测试区块2', '测试区块3'],
        date: '2021-11-11',
        stepperWidth: '100px',
    },
    methods: {
        PickerChange(e) {
            console.log(e);
            this.setData({
                index: e.detail.value
            })
        },
        DateChange(e) {
            this.setData({
              date: e.detail.value
            })
          },
    }
})
