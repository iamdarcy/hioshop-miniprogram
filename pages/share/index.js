var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()
const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
Page({
    data: {
        painting: {},
        shareImage: '',
        goodsUrl: '',
        goods: {},
    },
    getQrcode: function(id) {
        let that = this;
        util.request(api.GetBase64, {
            goodsId: id
        }, 'POST').then(function(res) {
            if (res.errno === 0) {
                that.getQrcodeJpg(res.data);
            }
        });
    },
    getQrcodeJpg(code) {
        let that = this;
        let num = Math.floor(Math.random() * 50);
        let promise = new Promise((resolve, reject) => {
            const filePath = wx.env.USER_DATA_PATH + '/temp_image' + num + '.jpeg';
            const buffer = wx.base64ToArrayBuffer(code);
            wx.getFileSystemManager().writeFile({
                filePath,
                data: buffer,
                encoding: 'binary',
                success() {
                    that.getGoodsInfo(filePath);
                },
                fail() {
                    reject(new Error('ERROR_BASE64SRC_WRITE'));
                },
            });
        });
    },
    onLoad(options) {
        wx.showLoading({
            title: '图片生成中',
        })
        let goodsid = options.goodsid;
        let goodsUrl = wx.getStorageSync('goodsImage');
        this.setData({
            goodsid: goodsid,
            goodsUrl: goodsUrl
        })
        this.getQrcode(goodsid);
    },
    onShow: function() {
    },
    getGoodsInfo: function (qrcodeUrl) {
        let that = this;
        let id = that.data.goodsid;
        util.request(api.GoodsShare, {
            id: id
        }).then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    goods: res.data,
                });
                that.eventDraw(qrcodeUrl);
            }
        });
    },
    eventDraw(qrcodeUrl) {
        let that = this;
        let goodsUrl = that.data.goodsUrl;
        let goods = that.data.goods;
        that.setData({
            painting: {
                width: 375,
                height: 667,
                background:'#fff',
                clear: true,
                views: [
                    {
                        type: 'rect',
                        top: 0,
                        left: 0,
                        width: 375,
                        height: 667,
                        background:'#fff'
                    },
                    {
                        type: 'rect',
                        top: 40,
                        left: 40,
                        width: 305,
                        height: 305,
                        background: '#f1f1f1'
                    },
                    {
                        type: 'image',
                        url: goodsUrl,
                        top: 35,
                        left: 35,
                        width: 305,
                        height: 305,
                    },
                    {
                        type: 'text',
                        content: goods.name,
                        fontSize: 18,
                        lineHeight: 22,
                        color: '#383549',
                        textAlign: 'left',
                        top: 360,
                        left: 35,
                        width: 305,
                        MaxLineNumber: 2,
                        breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'text',
                        content: '¥',
                        fontSize: 18,
                        lineHeight: 16,
                        color: '#e93237',
                        textAlign: 'left',
                        top: 420,
                        left: 35,
                        width: 40,
                        MaxLineNumber: 1,
                        // breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'text',
                        content: goods.retail_price,
                        fontSize: 30,
                        lineHeight: 30,
                        color: '#e93237',
                        textAlign: 'left',
                        top: 410,
                        left: 50,
                        width: 200,
                        MaxLineNumber: 1,
                        // breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'image',
                        url: qrcodeUrl,
                        top: 470,
                        left: 127.5,
                        width: 120,
                        height: 120
                    },
                    {
                        type: 'text',
                        content: '长按识别小程序',
                        fontSize: 16,
                        color: '#383549',
                        textAlign: 'center',
                        top: 610,
                        left: 187.5,
                        lineHeight: 20,
                        MaxLineNumber: 1,
                        breakWord: true,
                        width: 200
                    }
                ]
            }
        })
    },
    eventSave() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.shareImage,
            success(res) {
                wx.showToast({
                    title: '保存图片成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
    eventGetImage(event) {
        wx.hideLoading()
        const {
            tempFilePath,
            errMsg
        } = event.detail
        if (errMsg === 'canvasdrawer:ok') {
            this.setData({
                shareImage: tempFilePath
            })
        }
    }
})