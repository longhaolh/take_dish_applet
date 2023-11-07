// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/shop_no_power_handler')
const expressJoi = require("@escook/express-joi");

// 查询所有店铺信息
router.post('/getAllShop', handler.getAllShop)
// 查询店铺信息
router.get('/queryShop', handler.queryShop)
module.exports = router