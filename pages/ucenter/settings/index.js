var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
    data: {
        name: '',
        mobile: '',
        status: 0,
    },
    mobilechange(e) {
        let mobile = e.detail.value;
        this.setData({
            mobile: mobile,
            status: 0
        });
        if (util.testMobile(mobile)) {
            this.setData({
                mobile: mobile,
                status: 1
            });
        }
    },
    bindinputName(event) {
        let name = event.detail.value;
        let mobile = this.data.mobile;
        this.setData({
            name: name,
        });
        if (util.testMobile(mobile)) {
            this.setData({
                status: 1
            });
        }
    },
    getSettingsDetail() {
        let that = this;
        util.request(api.SettingsDetail).then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    name: res.data.name,
                    mobile: res.data.mobile,
                });
                if (res.data.name == '' || res.data.mobile == ''){
                    util.showErrorToast('请填写姓名和手机');
                }
            }
        });
    },
    onLoad: function(options) {
        this.getSettingsDetail();
    },
    saveInfo() {
        let name = this.data.name;
        let mobile = this.data.mobile;
        let status = this.data.status;
        if (name == '') {
            util.showErrorToast('请输入姓名');
            return false;
        }
        if (mobile == '') {
            util.showErrorToast('请输入手机号码');
            return false;
        }
        let that = this;
        util.request(api.SaveSettings, {
            name: name,
            mobile: mobile,
        }, 'POST').then(function(res) {
            if (res.errno === 0) {
                util.showErrorToast('保存成功');
                wx.navigateBack()
            }
        });
    },
})