// const ApiRootUrl = 'http://localhost:8360/api/';
const ApiRootUrl = 'https://www.hiolabs.com/api/';

module.exports = {
    // 登录
    AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录
    // 首页
    IndexUrl: ApiRootUrl + 'index/appInfo', //首页数据接口
    // 分类
    CatalogList: ApiRootUrl + 'catalog/index', //分类目录全部分类数据接口
    CatalogCurrent: ApiRootUrl + 'catalog/current', //分类目录当前分类数据接口
    GetCurrentList: ApiRootUrl + 'catalog/currentlist',
    // 购物车
    CartAdd: ApiRootUrl + 'cart/add', // 添加商品到购物车
    CartList: ApiRootUrl + 'cart/index', //获取购物车的数据
    CartUpdate: ApiRootUrl + 'cart/update', // 更新购物车的商品
    CartDelete: ApiRootUrl + 'cart/delete', // 删除购物车的商品
    CartChecked: ApiRootUrl + 'cart/checked', // 选择或取消选择商品
    CartGoodsCount: ApiRootUrl + 'cart/goodsCount', // 获取购物车商品件数
    CartCheckout: ApiRootUrl + 'cart/checkout', // 下单前信息确认
    // 商品
    GoodsCount: ApiRootUrl + 'goods/count', //统计商品总数
    GoodsDetail: ApiRootUrl + 'goods/detail', //获得商品的详情
    GoodsList: ApiRootUrl + 'goods/list', //获得商品列表
    GoodsShare: ApiRootUrl + 'goods/goodsShare', //获得商品的详情
    SaveUserId: ApiRootUrl + 'goods/saveUserId',
    // 收货地址
    AddressDetail: ApiRootUrl + 'address/addressDetail', //收货地址详情
    DeleteAddress: ApiRootUrl + 'address/deleteAddress', //保存收货地址
    SaveAddress: ApiRootUrl + 'address/saveAddress', //保存收货地址
    GetAddresses: ApiRootUrl + 'address/getAddresses',
    RegionList: ApiRootUrl + 'region/list', //获取区域列表
    PayPrepayId: ApiRootUrl + 'pay/preWeixinPay', //获取微信统一下单prepay_id
    OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
    OrderList: ApiRootUrl + 'order/list', //订单列表
    OrderDetail: ApiRootUrl + 'order/detail', //订单详情
    OrderDelete: ApiRootUrl + 'order/delete', //订单删除
    OrderCancel: ApiRootUrl + 'order/cancel', //取消订单
    OrderConfirm: ApiRootUrl + 'order/confirm', //物流详情
    OrderCount: ApiRootUrl + 'order/count', // 获取订单数
    OrderCountInfo: ApiRootUrl + 'order/orderCount', // 我的页面获取订单数状态
    OrderExpressInfo: ApiRootUrl + 'order/express', //物流信息
    OrderGoods: ApiRootUrl + 'order/orderGoods', // 获取checkout页面的商品列表
    // 足迹
    FootprintList: ApiRootUrl + 'footprint/list', //足迹列表
    FootprintDelete: ApiRootUrl + 'footprint/delete', //删除足迹
    // 搜索
    SearchIndex: ApiRootUrl + 'search/index', //搜索页面数据
    SearchHelper: ApiRootUrl + 'search/helper', //搜索帮助
    SearchClearHistory: ApiRootUrl + 'search/clearHistory', //搜索帮助
    ShowSettings: ApiRootUrl + 'settings/showSettings',
    SaveSettings: ApiRootUrl + 'settings/save',
    SettingsDetail: ApiRootUrl + 'settings/userDetail',
    GetBase64: ApiRootUrl + 'qrcode/getBase64', //获取商品详情二维码

};