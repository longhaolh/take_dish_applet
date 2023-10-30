// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/shop_power_handler')
const expressJoi = require("@escook/express-joi");
const {
    add_shop_schema,
    delete_dish_schema,
    update_dish_schema
} = require('../schema/shop')
// 添加店铺信息
router.post('/addShop', expressJoi(add_shop_schema), handler.addShop)

module.exports = router