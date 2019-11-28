海鸥开源商城（微信小程序端）
基于开源项目NideShop重建，精简了一些功能的同时完善了一些功能，并重新设计了UI
测试数据来自上述开源项目
服务端api基于Ｎode.js+ThinkJS+MySQL

本项目需要配合服务端使用，GitHub: https://github.com/iamdarcy/hioshop-server

云服务器ECS-云主机优惠-2折上云

项目截图
首页

专题

分类

商品列表

商品详情

购物车

订单中心

##功能列表
首页：搜索、Banner、公告、分类Icons、分类商品列表
详情页：加入购物车、立即购买、选择规格
搜索页：排序
分类页：分页加载商品
我的页面：订单（待付款，待发货，待收货），足迹，收货地址

##完整的购物流程，商品加入购物车 --> 收货地址的选择 --> 下单支付 --> 确认收货

项目结构
├─config     
│  └─api　
├─images    
│  └─icon
│  └─nav
├─lib
│  └─wxParse　　　
├─pages
│  ├─app-auth
│  ├─cart
│  ├─category
│  ├─goods
│  ├─index
│  ├─order-check
│  ├─payResult
│  ├─search
│  └─ucenter
│      ├─address
│      ├─address-detail
│      ├─express-info
│      ├─footprint
│      ├─goods-list
│      ├─index
│      ├─order-details
│      ├─order-list
│      └─settings
├─services
└─utils

项目地址：https://github.com/iamdarcy/hioshop-mini-program
喜欢别忘了 Star，有问题可通过微信、QQ群联系我，谢谢您的关注。
