// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/order_power_handler')
const expressJoi = require("@escook/express-joi");
const {
    add_dish_schema,

} = require('../schema/dish')
// 添加商品信息
router.post('/queryOrderList', expressJoi(add_dish_schema), handler.queryOrderList)


module.exports = router