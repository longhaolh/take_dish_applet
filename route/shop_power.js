// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/shop_power_handler')
const expressJoi = require("@escook/express-joi");
const {
    add_shop_schema,
    delete_shop_schema,
    update_shop_schema
} = require('../schema/shop')
// 添加店铺信息
router.post('/addShop', expressJoi(add_shop_schema), handler.addShop)
// 删除店铺信息
router.post('/shutdownShop', expressJoi(delete_shop_schema), handler.shutdownShop)
// 修改店铺信息
router.post('/updateShop', expressJoi(update_shop_schema), handler.updateShop)
// 查询店铺信息
router.get('/getAllShop', handler.getAllShop)
// 搜索店铺信息
router.get('/queryShop', handler.queryShop)
module.exports = router