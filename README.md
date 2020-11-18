### 海风小店，开源商城（微信小程序端）

+ 基于开源项目NideShop重建，精简了一些功能的同时完善了一些功能，并重新设计了UI
+ 测试数据来自上述开源项目
+ 服务端api基于Ｎode.js+ThinkJS+MySQL

### 服务器和后台管理本地部署教程
服务器：https://www.bilibili.com/video/av89567916  
后台管理：https://www.bilibili.com/video/av89568075

#### 本项目需要配合  
服务端： https://github.com/iamdarcy/hioshop-server  
管理后台：https://github.com/iamdarcy/hioshop-admin  

线上demo：http://hiolabs.com/demo/#/login  
用户名：hiolabs  
密码：hiolabs  

<a target="_blank" href="https://www.aliyun.com/minisite/goods?userCode=zm04niet"><img width="1400" src="https://images.gitee.com/uploads/images/2020/1118/090200_075dad37_1794996.jpeg"/></a>
阿里云主机优惠<a target="_blank" href="https://www.aliyun.com/minisite/goods?userCode=zm04niet">立即去看看</a>

### 项目截图

<img width="1400" src="https://images.gitee.com/uploads/images/2020/1118/090359_21c0304e_1794996.jpeg"/>

### 功能列表
+ 首页：搜索、Banner、公告、分类Icons、分类商品列表
+ 详情页：加入购物车、立即购买、选择规格
+ 搜索页：排序
+ 分类页：分页加载商品
+ 我的页面：订单（待付款，待发货，待收货），足迹，收货地址

### 最近更新 
- 3.26 更新详情  
U 将网络图标改成本地图标  
U 更新支付方式的UI  
F 修复轮播图的bug  
F 修复没有商品时的错误显示问题  
F 修复share.js的一个bug  
A 增加发货时的订阅消息  

- 12.14 新增生成分享图的功能  
<img width="1000" src="https://images.gitee.com/uploads/images/2020/1118/090429_8fc928b0_1794996.jpeg"/>

#### 完整的购物流程，商品加入购物车 --> 收货地址的选择 --> 下单支付 --> 确认收货

### 项目结构
```
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
```
### 本地开发

请在https://mp.weixin.qq.com/ 注册你的小程序，得到appid和secret，微信开发者工具中设置appid。  
在hiolabs-server的config.js中设置好appid和secret。  

- 项目地址  
微信小程序：https://github.com/iamdarcy/hioshop-miniprogram  
后台管理：https://github.com/iamdarcy/hioshop-admin  
服务端： https://github.com/iamdarcy/hioshop-server  

- 本项目会持续更新和维护，喜欢别忘了 Star，有问题可通过微信、QQ群联系我，谢谢您的关注。
<img width="1200" src="https://images.gitee.com/uploads/images/2020/1118/090924_294734ef_1794996.jpeg"/>


