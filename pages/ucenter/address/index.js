var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        addresses: [],
        nowAddress: 0
    },
    goAddressDetail: function(e) {
        let id = e.currentTarget.dataset.addressid;
        wx.navigateTo({
            url: '/pages/ucenter/address-detail/index?id=' + id,
        })
    },
    getAddresses() {
        let that = this;
        util.request(api.GetAddresses).then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    addresses: res.data
                })
            }
        });
    },
    selectAddress:function(e) {
        let addressId = e.currentTarget.dataset.addressid
        wx.setStorageSync('addressId', addressId);
        wx.navigateBack();
    },
    onLoad: function(options) {
        let type = options.type;
        this.setData({
            type: type
        })
    },
    onUnload: function() {},
    onShow: function() {
        this.getAddresses();
        let addressId = wx.getStorageSync('addressId');
        if (addressId) {
            this.setData({
                nowAddress: wx.getStorageSync('addressId')
            });
        }
        else {
            this.setData({
                nowAddress: 0
            });
        }
    },
    addAddress: function() {
        wx.navigateTo({
            url: '/pages/ucenter/address-detail/index?id=' + 0,
        })
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        this.getAddresses();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    }
})