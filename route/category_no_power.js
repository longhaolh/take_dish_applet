// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/category_no_power_handler')
const expressJoi = require("@escook/express-joi");
const {query_shop_schema,query_assort_schema} = require('../schema/category')
// 查询店铺信息
router.get('/queryShop',expressJoi(query_shop_schema),handler.queryShop)
// 查询类目信息
router.get('/queryAssort',expressJoi(query_assort_schema),handler.queryAssort)
module.exports = router