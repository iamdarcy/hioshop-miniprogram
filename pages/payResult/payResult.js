var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({
    data: {
        status: 0,
        orderId: 0,
        is_over:0,
        productId:0,
        imageUrl:''
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            orderId: options.orderId,
            status: options.status
        })
    },
    toOrderListPage: function(event) {
        wx.switchTab({
            url: '/pages/ucenter/index/index',
        });
    },
    toIndex: function() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    payOrder() {
        pay.payOrder(parseInt(this.data.orderId)).then(res => {
            this.setData({
                status: true
            });
        }).catch(res => {
            util.showErrorToast(res.errmsg);
        });
    }
})