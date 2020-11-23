var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

const app = getApp()

Page({
    data: {
        goodsList: [],
    },
    onLoad: function(options) {
        this.getGoodsList(options.id);
    },
    getGoodsList: function(id) {
        let that = this;
        util.request(api.OrderGoods, {
            orderId: id
        }).then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    goodsList: res.data
                });
            }
        });
    }
})