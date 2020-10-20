# 微信小程序-水果商城

<div align=center><img align="center" src="http://voyz-image.test.upcdn.net/2018/11/06/e73d196b310001b803c4d7abe72a5a28.jpg" width="250px"/></div>

[![](https://img.shields.io/badge/Wechat--informational?style=social&logo=wechat)](https://i.loli.net/2020/09/19/jHmZskwtUTF9oOh.png)
[![](https://img.shields.io/badge/Github--informational?style=social&logo=github)](https://github.com/Voyzz)
[![](https://img.shields.io/badge/Gmail--informational?style=social&logo=gmail)](voyzshen@gmail.com)
[![](https://img.shields.io/badge/Blog--informational?style=social&logo=micro.blog)](http://blog.voyz.vip/)

![](https://img.shields.io/github/last-commit/Voyzz/Fruit-store-mp?style=for-the-badge)
![](https://img.shields.io/npm/l/react-native-swiper-hooks?style=for-the-badge)
![](https://img.shields.io/github/languages/top/Voyzz/Fruit-store-mp?style=for-the-badge)

# Hello, folks! <img src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif" width="30px">

   
> 📚 **Welcomes to provide your valuable comments or suggestions by 'Issues' or my contact information**    
>> ✨ 欢迎通过”issues“或我的联系方式，为我提供宝贵意见   
>  
> 👨🏻‍💻 **Powered by Voyz Shen**   
> ✨ Shanghai Jiao Tong University, Ctrip

## 目录
> - [安装](#install)
> - [介绍](#desc)
> - [版本](#versions)
> - [展示](#show)
> - [云开发环境配置](#cloud)

---

<span id='install'><span>
## 安装
```
git clone https://github.com/Voyzz/Fruit-store-mp
```

<span id='desc'><span>
## 介绍
- 接入微信支付
- 包含后台管理
- 已发布上线
- 前端采用原生小程序框架开发
- 后端采用小程序云开发
- 腾讯云云支持（数据库、CDN、云函数）
- 又拍云云支持（CDN）

<span id='versions'><span>
## 版本
> v1.0.1 | Oct 20, 2020
>> 开源云数据库结构  
>> 重写README

> v1.0.0 | Jan 8, 2018
>> 主页布局美化、bug修复

> v0.1.11 | Nov 6, 2018
>> 主页布局美化、bug修复

> v0.1.1 | Nov 2, 2018
>> 主页布局美化

> v0.1.0 | Oct 16, 2018
>> 添加后台，购物车

> v0.0.2 | Oct 16, 2018
>> 功能基本实现

<span id='show'><span>
## 展示
![Snip20190117_149.png](http://voyz-image.test.upcdn.net/2019/01/17/20774362b08b70bc676458a4375d9f71.png)

![Snip20190117_150.png](http://voyz-image.test.upcdn.net/2019/01/17/c4484768580d476848b24d21d01d7d9d.png)


<span id='cloud'><span>
## 云开发环境配置
![环境名称: voyz-cloud](https://i.loli.net/2020/10/20/CUBu8Mn7cKsY9lg.jpg)

`project.config.json`:

```
{  
	"cloudfunctionRoot": "cloudfunctions/"  
}  
```   
### 数据库
![集合名称](https://i.loli.net/2020/10/20/vfjQDgOA1hSypka.jpg)

|集合名称|字段名称|数据类型|描述|
|:--|:--|:--|:--|
|customer_inf||||
||-|-|-|
|fruit-board||||
||detail|String|商品描述|
||fruitId|String|商品ID|
||iLike|String|点赞数|
||imgUrl|String|商品图片|
||myClass|Int|自定义类|
||name| String |商品名称|
||onShow| Boolean |是否展示|
||price| String |商品价格|
||purchaseFreq| String |商品购买次数|
||service| String |售后信息描述|
||unit| String |单位|
|fruitStore|||
||name| String |用户名|
|order_master|||
|| payTime |String|支付时间|
|| fruitList |Array|商品信息列表|
|| ||[{ "支付测试",1,"0.01"},...]|
|| schoolName |String|学校信息|
|| addressItem |String|地址|
|| total |String|总价格|
|| openid |String|用户ID|
|| out_trade_no |String|订单号|
|| name |String|用户姓名|
|| phone |String|手机号码|
|| orderTime |String|订单生成时间|
|| orderSuccess | Boolean |订单生成成功|
|| paySuccess | Boolean |订单支付成功|
|| detail |Int|详情|
|| message |String|留言|
|| sending | Boolean |配送中|
|| finished | Boolean |已收货|
|| sendingTime |String|配送时间|
|| finishedTime |String|送达时间|
|send_form||||
||-|-|-|
|setting||||
|| offLine | Boolean |是否离线|
|| option | Boolean |当前状态|
*** 

### 存储
![云存储](https://i.loli.net/2020/10/20/twg8r5DpknGbe4S.jpg)
***


### 云函数
![云函数](https://i.loli.net/2020/10/20/Yz5lBJvCkobPwS3.jpg)