var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');
const app = getApp()

Page({
    data: {
        checkedGoodsList: [],
        checkedAddress: {},
        goodsTotalPrice: 0.00, //商品总价
        freightPrice: 0.00, //快递费
        orderTotalPrice: 0.00, //订单总价
        actualPrice: 0.00, //实际需要支付的总价
        addressId: 0,
        goodsCount: 0,
        postscript: '',
    },
    toGoodsList: function (e) {
        let orderId = this.data.orderId;
        wx.navigateTo({
            url: '/pages/ucenter/goods-list/index?type=1',
        });
    },
    toSelectAddress: function () {
        wx.navigateTo({
            url: '/pages/ucenter/address/index?type=1',
        });
    },
    toAddAddress: function () {
        wx.navigateTo({
            url: '/pages/ucenter/address-add/index',
        })
    },
    bindinputMemo(event) {
        let postscript = event.detail.value;
        this.setData({
            postscript: postscript
        });
    },
    onLoad: function (options) {
        let addType = options.addtype;
        let orderFrom = options.orderFrom;
        if (addType != undefined) {
            this.setData({
                addType: addType
            })
        }
        if (orderFrom != undefined) {
            this.setData({
                orderFrom: orderFrom
            })
        }
    },
    onUnload: function () {
        wx.removeStorageSync('addressId');
    },
    onShow: function () {
        // 页面显示
        // TODO结算时，显示默认地址，而不是从storage中获取的地址值
        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId == 0 || addressId == '') {
                addressId = 0;
            }
            this.setData({
                'addressId': addressId
            });
        } catch (e) {
        }
        this.getCheckoutInfo();
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId == 0 || addressId == '') {
                addressId = 0;
            }
            this.setData({
                'addressId': addressId
            });
        } catch (e) {
            // Do something when catch error
        }
        this.getCheckoutInfo();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    getCheckoutInfo: function () {
        let that = this;
        let addressId = that.data.addressId;
        let orderFrom = that.data.orderFrom;
        let addType = that.data.addType;
        util.request(api.CartCheckout, {
            addressId: that.data.addressId,
            addType: addType,
            orderFrom: orderFrom,
            type: 0
        }).then(function (res) {
            if (res.errno === 0) {
                let addressId = 0;
                if (res.data.checkedAddress != 0) {
                    addressId = res.data.checkedAddress.id;
                }
                that.setData({
                    checkedGoodsList: res.data.checkedGoodsList,
                    checkedAddress: res.data.checkedAddress,
                    actualPrice: res.data.actualPrice,
                    addressId: addressId,
                    freightPrice: res.data.freightPrice,
                    goodsTotalPrice: res.data.goodsTotalPrice,
                    orderTotalPrice: res.data.orderTotalPrice,
                    goodsCount: res.data.goodsCount,
                    outStock: res.data.outStock
                });

                let goods = res.data.checkedGoodsList;
                wx.setStorageSync('addressId', addressId);
                if (res.data.outStock == 1) {
                    util.showErrorToast('有部分商品缺货或已下架');
                }
            }
        });
    },
    // TODO 有个bug，用户没选择地址，支付无法继续进行，在切换过token的情况下
    submitOrder: function (e) {
        let formId = e.detail.formId;
        if (this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        let addressId = this.data.addressId;
        let postscript = this.data.postscript;
        let freightPrice = this.data.freightPrice;
        let actualPrice = this.data.actualPrice;
        let goodsTotalPrice = this.data.goodsTotalPrice;
        util.request(api.OrderSubmit, {
            addressId: addressId,
            postscript: postscript,
            freightPrice: freightPrice,
            formId: formId,
            actualPrice: actualPrice,
        }, 'POST').then(res => {
            const orderId = res.data.orderInfo.id;
            if (res.errno === 0) {
                wx.removeStorageSync('orderId');
                wx.setStorageSync('addressId', 0);
                const orderId = res.data.orderInfo.id;
                pay.payOrder(parseInt(orderId)).then(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                    });
                }).catch(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                    });
                });
            } else {
                util.showErrorToast('下单失败');
            }
        });
    }
})