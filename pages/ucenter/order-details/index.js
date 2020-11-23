var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var timer = require('../../../utils/wxTimer.js');
var remaintimer = require('../../../utils/remainTime.js');
const pay = require('../../../services/pay.js');
const app = getApp()

// TODO 拼团订单不能退款
Page({
    data: {
        orderId: 0,
        orderInfo: {},
        orderGoods: [],
        handleOption: {},
        textCode: {},
        goodsCount: 0,
        addressId: 0,
        postscript: '',
        hasPay: 0,
        success: 0,
        imageUrl: '',
        wxTimerList: {},
        express: {},
        onPosting: 0,
        userInfo:{}
    },
    reOrderAgain: function () {
        let orderId = this.data.orderId
        wx.redirectTo({
            url: '/pages/order-check/index?addtype=2&orderFrom=' + orderId
        })
    },
    copyText: function (e) {
        let data = e.currentTarget.dataset.text;
        wx.setClipboardData({
            data: data,
            success(res) {
                wx.getClipboardData({
                    success(res) {}
                })
            }
        })
    },
    toGoodsList: function (e) {
        let orderId = this.data.orderId;
        wx.navigateTo({
            url: '/pages/ucenter/goods-list/index?id=' + orderId,
        });
    },
    toExpressInfo: function (e) {
        let orderId = this.data.orderId;
        wx.navigateTo({
            url: '/pages/ucenter/express-info/index?id=' + orderId,
        });
    },
    toRefundSelect: function (e) {
        wx.navigateTo({
            url: '/pages/refund-select/index',
        });
    },
    payOrder: function (e) {
        let that = this;
        pay.payOrder(parseInt(that.data.orderId)).then(res => {
            that.getOrderDetail();
        }).catch(res => {
            util.showErrorToast(res.errmsg);
        });
    },
    toSelectAddress: function () {
        let orderId = this.data.orderId;
        wx.navigateTo({
            url: '/pages/ucenter/address-select/index?id=' + orderId,
        });
    },
    onLoad: function () {

    },
    onShow: function () {
        var orderId = wx.getStorageSync('orderId');
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            orderId: orderId,
            userInfo:userInfo
        });
        wx.showLoading({
            title: '加载中...',
        })
        this.getOrderDetail();
        this.getExpressInfo();
    },
    onUnload: function () {
        let oCancel = this.data.handleOption.cancel;
        if (oCancel == true) {
            let orderTimerID = this.data.wxTimerList.orderTimer.wxIntId;
            clearInterval(orderTimerID);
        }
    },
    onHide: function () {
        let oCancel = this.data.handleOption.cancel;
        if (oCancel == true) {
            let orderTimerID = this.data.wxTimerList.orderTimer.wxIntId;
            clearInterval(orderTimerID);
        }
    },
    orderTimer: function (endTime) {
        let that = this;
        var orderTimerID = '';
        let wxTimer2 = new timer({
            endTime: endTime,
            name: 'orderTimer',
            id: orderTimerID,
            complete: function () {
                that.letOrderCancel();
            },
        })
        wxTimer2.start(that);
    },
    bindinputMemo(event) {
        let postscript = event.detail.value;
        this.setData({
            postscript: postscript
        });
    },
    getExpressInfo: function () {
        this.setData({
            onPosting: 0
        })
        let that = this;
        util.request(api.OrderExpressInfo, {
            orderId: that.data.orderId
        }).then(function (res) {
            if (res.errno === 0) {
                let express = res.data;
                express.traces = JSON.parse(res.data.traces);
                that.setData({
                    onPosting: 1,
                    express: express
                });
            }
        });
    },
    getOrderDetail: function () {
        let that = this;
        util.request(api.OrderDetail, {
            orderId: that.data.orderId
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    orderInfo: res.data.orderInfo,
                    orderGoods: res.data.orderGoods,
                    handleOption: res.data.handleOption,
                    textCode: res.data.textCode,
                    goodsCount: res.data.goodsCount
                });
                let receive = res.data.textCode.receive;
                if (receive == true) {
                    let confirm_remainTime = res.data.orderInfo.confirm_remainTime;
                    remaintimer.reTime(confirm_remainTime, 'c_remainTime', that);
                }
                let oCancel = res.data.handleOption.cancel;
                let payTime = 0;
                if (oCancel == true) {
                    payTime = res.data.orderInfo.final_pay_time
                    that.orderTimer(payTime);
                }
            }
        });
        wx.hideLoading();
    },
    letOrderCancel: function () {
        let that = this;
        util.request(api.OrderCancel, {
            orderId: that.data.orderId
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                that.getOrderDetail();
            } else {
                util.showErrorToast(res.errmsg);
            }
        });
    },
    // “删除”点击效果
    deleteOrder: function () {
        let that = this;
        wx.showModal({
            title: '',
            content: '确定要删除此订单？',
            success: function (res) {
                if (res.confirm) {
                    util.request(api.OrderDelete, {
                        orderId: that.data.orderId
                    }, 'POST').then(function (res) {
                        if (res.errno === 0) {
                            wx.showToast({
                                title: '删除订单成功'
                            });
                            wx.removeStorageSync('orderId');
                            wx.setStorageSync('doRefresh', 1);
                            wx.navigateBack();
                        } else {
                            util.showErrorToast(res.errmsg);
                        }
                    });
                }
            }
        });
    },
    // “确认收货”点击效果
    confirmOrder: function () {
        let that = this;
        wx.showModal({
            title: '',
            content: '收到货了？确认收货？',
            success: function (res) {
                if (res.confirm) {
                    util.request(api.OrderConfirm, {
                        orderId: that.data.orderId
                    }, 'POST').then(function (res) {
                        if (res.errno === 0) {
                            wx.showToast({
                                title: '确认收货成功！'
                            });
                            wx.setStorageSync('doRefresh', 1);
                            that.getOrderDetail();
                        } else {
                            util.showErrorToast(res.errmsg);
                        }
                    });
                }
            }
        });
    },
    // “取消订单”点击效果
    cancelOrder: function (e) {
        let that = this;
        wx.showModal({
            title: '',
            content: '确定要取消此订单？',
            success: function (res) {
                if (res.confirm) {
                    util.request(api.OrderCancel, {
                        orderId: that.data.orderId
                    }, 'POST').then(function (res) {
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
                            wx.setStorageSync('doRefresh', 1);
                            let orderTimerID = that.data.wxTimerList.orderTimer.wxIntId;
                            clearInterval(orderTimerID);
                            that.getOrderDetail();
                        } else {
                            util.showErrorToast(res.errmsg);
                        }
                    });
                }
            }
        });
    },
})