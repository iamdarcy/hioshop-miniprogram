var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        orderList: [],
        allOrderList: [],
        allPage: 1,
        allCount: 0,
        size: 8,
        showType: 9,
        hasOrder: 0,
        showTips: 0,
        status: {}
    },
    toOrderDetails: function(e) {
        let orderId = e.currentTarget.dataset.id;
        wx.setStorageSync('orderId', orderId)
        wx.navigateTo({
            url: '/pages/ucenter/order-details/index',
        })
    },
    payOrder: function(e) {
        let orderId = e.currentTarget.dataset.orderid;
        let that = this;
        pay.payOrder(parseInt(orderId)).then(res => {
            let showType = wx.getStorageSync('showType');
            that.setData({
                showType: showType,
                orderList: [],
                allOrderList: [],
                allPage: 1,
                allCount: 0,
                size: 8
            });
            that.getOrderList();
            that.getOrderInfo();
        }).catch(res => {
            util.showErrorToast(res.errmsg);
        });
    },
    getOrderInfo: function(e) {
        let that = this;
        util.request(api.OrderCountInfo).then(function(res) {
            if (res.errno === 0) {
                let status = res.data;
                that.setData({
                    status: status
                });
            }
        });
    },
    getOrderList() {
        let that = this;
        util.request(api.OrderList, {
            showType: that.data.showType,
            size: that.data.size,
            page: that.data.allPage,
        }).then(function(res) {
            if (res.errno === 0) {
                let count = res.data.count;
                that.setData({
                    allCount: count,
                    allOrderList: that.data.allOrderList.concat(res.data.data),
                    allPage: res.data.currentPage,
                    orderList: that.data.allOrderList.concat(res.data.data)
                });
                let hasOrderData = that.data.allOrderList.concat(res.data.data);
                if (count == 0) {
                    that.setData({
                        hasOrder: 1
                    });
                }
            }
        });
    },
    toIndexPage: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    onLoad: function() {},
    onShow: function() {
        let showType = wx.getStorageSync('showType');
        let nowShowType = this.data.showType;
        let doRefresh = wx.getStorageSync('doRefresh');
        if (nowShowType != showType || doRefresh == 1) {
            this.setData({
                showType: showType,
                orderList: [],
                allOrderList: [],
                allPage: 1,
                allCount: 0,
                size: 8
            });
            this.getOrderList();
            wx.removeStorageSync('doRefresh');
        }
        this.getOrderInfo();
    },
    switchTab: function(event) {
        let showType = event.currentTarget.dataset.index;
        wx.setStorageSync('showType', showType);
        this.setData({
            showType: showType,
            orderList: [],
            allOrderList: [],
            allPage: 1,
            allCount: 0,
            size: 8
        });
        this.getOrderInfo();
        this.getOrderList();
    },
    // “取消订单”点击效果
    cancelOrder: function(e) {
        let that = this;
        let orderId = e.currentTarget.dataset.index;
        wx.showModal({
            title: '',
            content: '确定要取消此订单？',
            success: function(res) {
                if (res.confirm) {
                    util.request(api.OrderCancel, {
                        orderId: orderId
                    }, 'POST').then(function(res) {
                        if (res.errno === 0) {
                            wx.showToast({
                                title: '取消订单成功'
                            });
                            that.setData({
                                orderList: [],
                                allOrderList: [],
                                allPage: 1,
                                allCount: 0,
                                size: 8
                            });
                            that.getOrderList();
                        } else {
                            util.showErrorToast(res.errmsg);
                        }
                    });
                }
            }
        });
    },
    onReachBottom: function() {
        let that = this;
        if (that.data.allCount / that.data.size < that.data.allPage) {
            that.setData({
                showTips: 1
            });
            return false;
        }
        that.setData({
            'allPage': that.data.allPage + 1
        });
        that.getOrderList();
    }
})