Component({
    options: {
        addGlobalClass: true,
    },
    properties: {

    },
    data: {

    },
    methods: {
        isCard(e) {
            this.setData({
                isCard: e.detail.value
            })
        },
    }
})