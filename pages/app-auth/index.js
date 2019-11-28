const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
//获取应用实例
const app = getApp()

Page({
    data: {
        
    },
    onLoad: function (options) {
        
    },
    onShow: function () {
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo != '') {
            wx.navigateBack();
        };
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        user.loginByWeixin().then(res => {
            app.globalData.userInfo = res.data.userInfo;
            app.globalData.token = res.data.token;
            let is_new = res.data.is_new;//服务器返回的数据；
            if (is_new == 0) {
                util.showErrorToast('您已经是老用户啦！');
                wx.navigateBack();
            }
            else if (is_new == 1) {
                wx.navigateBack();
            }

        }).catch((err) => { });
    },
    goBack:function(){
        wx.navigateBack();
    }
})