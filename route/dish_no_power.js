// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/dish_no_power_handler')
const expressJoi = require("@escook/express-joi");
const {query_dish_schema} = require('../schema/dish')
// 查询餐品信息
router.get('/queryDish',expressJoi(query_dish_schema),handler.queryDish)
module.exports = router