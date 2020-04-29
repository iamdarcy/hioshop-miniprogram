var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var timer = require('../../utils/wxTimer.js');
var api = require('../../config/api.js');
const user = require('../../services/user.js');
Page({
    data: {
        id: 0,
        goods: {},
        gallery: [],
        galleryImages:[],
        specificationList: [],
        productList: [],
        cartGoodsCount: 0,
        checkedSpecPrice: 0,
        number: 1,
        checkedSpecText: '',
        tmpSpecText: '请选择规格和数量',
        openAttr: false,
        soldout: false,
        disabled: '',
        alone_text: '单独购买',
        userId: 0,
        priceChecked: false,
        goodsNumber: 0,
        loading: 0,
        current: 0,
        showShareDialog:0,
        userInfo:{},
        autoplay:true
    },
    hideDialog: function (e) {
        let that = this;
        that.setData({
            showShareDialog: false,
        });
    },
    shareTo:function(){
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo == '') {
            util.loginNow();
            return false;
        } else {
            this.setData({
                showShareDialog: !this.data.showShareDialog,
            });
        }
    },
    createShareImage: function () {
        let id = this.data.id;
        wx.navigateTo({
            url: '/pages/share/index?goodsid=' + id
        })
    },
    previewImage: function (e) {
        let current = e.currentTarget.dataset.src;
        let that = this;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: that.data.galleryImages // 需要预览的图片http链接列表  
        })
    },
    bindchange: function(e) {
        let current = e.detail.current;
        this.setData({
            current: current
        })
    },
    inputNumber(event) {
        let number = event.detail.value;
        this.setData({
            number: number
        });
    },
    goIndex: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    onShareAppMessage: function(res) {
        let id = this.data.id;
        let name = this.data.goods.name;
        let image = this.data.goods.list_pic_url;
        let userId = this.data.userId;
        return {
            title: name,
            path: '/pages/goods/goods?id=' + id + '&&userId=' + userId,
            imageUrl: image
        }
    },
    onUnload: function() {},
    handleTap: function(event) { //阻止冒泡 
    },
    getGoodsInfo: function() {
        let that = this;
        util.request(api.GoodsDetail, {
            id: that.data.id
        }).then(function(res) {
            if (res.errno === 0) {
                let _specificationList = res.data.specificationList;
                // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
                if (_specificationList.valueList.length == 1) {
                    _specificationList.valueList[0].checked = true
                    that.setData({
                        checkedSpecText: '已选择：' + _specificationList.valueList[0].value,
                        tmpSpecText: '已选择：' + _specificationList.valueList[0].value,
                    });
                } else {
                    that.setData({
                        checkedSpecText: '请选择规格和数量'
                    });
                }
                let galleryImages = [];
                for (const item of res.data.gallery) {
                    galleryImages.push(item.img_url);
                }
                that.setData({
                    goods: res.data.info,
                    goodsNumber: res.data.info.goods_number,
                    gallery: res.data.gallery,
                    specificationList: res.data.specificationList,
                    productList: res.data.productList,
                    checkedSpecPrice: res.data.info.retail_price,
                    galleryImages: galleryImages,
                    loading:1
                });
                WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);
                wx.setStorageSync('goodsImage', res.data.info.https_pic_url);
            }
            else{
                util.showErrorToast(res.errmsg)
            }
        });
    },
    clickSkuValue: function(event) {
        // goods_specification中的id 要和product中的goods_specification_ids要一样
        let that = this;
        let specNameId = event.currentTarget.dataset.nameId;
        let specValueId = event.currentTarget.dataset.valueId;
        let index = event.currentTarget.dataset.index;
        //判断是否可以点击
        let _specificationList = this.data.specificationList;
        if (_specificationList.specification_id == specNameId) {
            for (let j = 0; j < _specificationList.valueList.length; j++) {
                if (_specificationList.valueList[j].id == specValueId) {
                    //如果已经选中，则反选
                    if (_specificationList.valueList[j].checked) {
                        _specificationList.valueList[j].checked = false;
                    } else {
                        _specificationList.valueList[j].checked = true;
                    }
                } else {
                    _specificationList.valueList[j].checked = false;
                }
            }
        }
        this.setData({
            'specificationList': _specificationList
        });
        //重新计算spec改变后的信息
        this.changeSpecInfo();

        //重新计算哪些值不可以点击
    },
    //获取选中的规格信息
    getCheckedSpecValue: function() {
        let checkedValues = [];
        let _specificationList = this.data.specificationList;
        let _checkedObj = {
            nameId: _specificationList.specification_id,
            valueId: 0,
            valueText: ''
        };
        for (let j = 0; j < _specificationList.valueList.length; j++) {
            if (_specificationList.valueList[j].checked) {
                _checkedObj.valueId = _specificationList.valueList[j].id;
                _checkedObj.valueText = _specificationList.valueList[j].value;
            }
        }
        checkedValues.push(_checkedObj);
        return checkedValues;
    },
    //根据已选的值，计算其它值的状态
    setSpecValueStatus: function() {

    },
    //判断规格是否选择完整
    isCheckedAllSpec: function() {
        return !this.getCheckedSpecValue().some(function(v) {
            if (v.valueId == 0) {
                return true;
            }
        });
    },
    getCheckedSpecKey: function() {
        let checkedValue = this.getCheckedSpecValue().map(function(v) {
            return v.valueId;
        });
        return checkedValue.join('_');
    },
    changeSpecInfo: function() {
        let checkedNameValue = this.getCheckedSpecValue();
        this.setData({
            disabled: '',
            number: 1
        });
        //设置选择的信息
        let checkedValue = checkedNameValue.filter(function(v) {
            if (v.valueId != 0) {
                return true;
            } else {
                return false;
            }
        }).map(function(v) {
            return v.valueText;
        });
        if (checkedValue.length > 0) {
            this.setData({
                tmpSpecText: '已选择：' + checkedValue.join('　'),
                priceChecked: true

            });
        } else {
            this.setData({
                tmpSpecText: '请选择规格和数量',
                priceChecked: false
            });
        }

        if (this.isCheckedAllSpec()) {
            this.setData({
                checkedSpecText: this.data.tmpSpecText
            });

            // 点击规格的按钮后
            // 验证库存
            let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProductArray || checkedProductArray.length <= 0) {
                this.setData({
                    soldout: true
                });
                // console.error('规格所对应货品不存在');
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '规格所对应货品不存在',
                });
                return;
            }
            let checkedProduct = checkedProductArray[0];
            if (checkedProduct.goods_number < this.data.number) {
                //找不到对应的product信息，提示没有库存
                this.setData({
                    checkedSpecPrice: checkedProduct.retail_price,
                    goodsNumber: checkedProduct.goods_number,
                    soldout: true
                });
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '库存不足',
                });
                return false;
            }
            if (checkedProduct.goods_number > 0) {
                this.setData({
                    checkedSpecPrice: checkedProduct.retail_price,
                    goodsNumber: checkedProduct.goods_number,
                    soldout: false
                });

                var checkedSpecPrice = checkedProduct.retail_price;

            } else {
                this.setData({
                    checkedSpecPrice: this.data.goods.retail_price,
                    soldout: true
                });
            }
        } else {
            this.setData({
                checkedSpecText: '请选择规格和数量',
                checkedSpecPrice: this.data.goods.retail_price,
                soldout: false
            });
        }
    },
    getCheckedProductItem: function(key) {
        return this.data.productList.filter(function(v) {
            if (v.goods_specification_ids == key) {
                return true;
            } else {
                return false;
            }
        });
    },
    onLoad: function(options) {
        let id = 0;
        var scene = decodeURIComponent(options.scene);
        if (scene != 'undefined') {
            id = scene;
        } else {
            id = options.id;
        }
        this.setData({
            id: id, // 这个是商品id
            valueId: id,
        });
    },
    onShow: function() {
        let userInfo = wx.getStorageSync('userInfo');
        let info = wx.getSystemInfoSync();
        let sysHeight = info.windowHeight - 100;
        let userId = userInfo.id;
        if (userId > 0) {
            this.setData({
                userId: userId,
                userInfo: userInfo,
            });
        }
        this.setData({
            priceChecked: false,
            sysHeight: sysHeight
        })
        this.getGoodsInfo();
        this.getCartCount();
    },
    onHide:function(){
        this.setData({
            autoplay:false
        })
    },
    getCartCount: function() {
        let that = this;
        util.request(api.CartGoodsCount).then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    cartGoodsCount: res.data.cartTotal.goodsCount
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getGoodsInfo();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    openCartPage: function() {
        wx.switchTab({
            url: '/pages/cart/cart',
        });
    },
    goIndexPage: function() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    },
    switchAttrPop: function() {
        if (this.data.openAttr == false) {
            this.setData({
                openAttr: !this.data.openAttr
            });
        }
    },
    closeAttr: function() {
        this.setData({
            openAttr: false,
            alone_text: '单独购买'
        });
    },
    goMarketing: function(e) {
        let that = this;
        that.setData({
            showDialog: !this.data.showDialog
        });
    },
    addToCart: function() {
        // 判断是否登录，如果没有登录，则登录
        util.loginNow();
        var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        let productLength = this.data.productList.length;
        if (userInfo == '') {
            return false;
        }
        if (this.data.openAttr == false && productLength != 1) {
            //打开规格选择窗口
            this.setData({
                openAttr: !that.data.openAttr
            });
            this.setData({
                alone_text: '加入购物车'
            })
        } else {

            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '请选择规格',
                });
                return false;
            }

            //根据选中的规格，判断是否有对应的sku信息
            let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProductArray || checkedProductArray.length <= 0) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '库存不足',
                });
                return false;
            }
            let checkedProduct = checkedProductArray[0];
            //验证库存
            if (checkedProduct.goods_number < this.data.number) {
                //要买的数量比库存多
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '库存不足',
                });
                return false;
            }
            util.request(api.CartAdd, {
                    addType: 0,
                    goodsId: this.data.id,
                    number: this.data.number,
                    productId: checkedProduct.id
                }, "POST")
                .then(function(res) {
                    let _res = res;
                    if (_res.errno == 0) {
                        wx.showToast({
                            title: '添加成功',
                        });
                        if (productLength != 1 || that.data.openAttr == true) {
                            that.setData({
                                openAttr: !that.data.openAttr,
                                cartGoodsCount: _res.data.cartTotal.goodsCount
                            });
                        } else {
                            that.setData({
                                cartGoodsCount: _res.data.cartTotal.goodsCount
                            });
                        }
                    } else {
                        wx.showToast({
                            image: '/images/icon/icon_error.png',
                            title: _res.errmsg,
                        });
                    }

                });
        }
    },
    fastToCart: function() {
        // 判断是否登录，如果没有登录，则登录
        util.loginNow();
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo == '') {
            return false;
        }
        var that = this;
        if (this.data.openAttr === false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr
            });
            that.setData({
                alone_text: '加入购物车'
            })
        } else {
            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '请选择规格',
                });
                return false;
            }
            //根据选中的规格，判断是否有对应的sku信息
            let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProductArray || checkedProductArray.length <= 0) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '库存不足',
                });
                return false;
            }
            let checkedProduct = checkedProductArray[0];
            //验证库存
            if (checkedProduct.goods_number < this.data.number) {
                //要买的数量比库存多
                wx.showToast({
                    image: '/images/icon/icon_error.png',
                    title: '库存不足',
                });
                return false;
            }
            //添加到购物车
            util.request(api.CartAdd, {
                    addType: 1, // 0：正常加入购物车，1:立即购买，2:再来一单
                    goodsId: this.data.id,
                    number: this.data.number,
                    productId: checkedProduct.id,
                }, "POST")
                .then(function(res) {
                    let _res = res;
                    if (_res.errno == 0) {
                        let id = that.data.id;
                        wx.navigateTo({
                            url: '/pages/order-check/index?addtype=1'
                        });
                    } else {
                        wx.showToast({
                            image: '/images/icon/icon_error.png',
                            title: _res.errmsg,
                        });
                    }
                });
        }
    },
    cutNumber: function() {
        this.setData({
            number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
        });
        this.setData({
            disabled: ''
        });
    },
    addNumber: function() {
        this.setData({
            number: Number(this.data.number) + 1
        });
        let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
        let checkedProduct = checkedProductArray;
        var check_number = this.data.number + 1;
        if (checkedProduct.goods_number < check_number) {
            this.setData({
                disabled: true
            });
        }
    }
})