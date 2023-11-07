// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/category_power_handler')
const expressJoi = require("@escook/express-joi");
const {
    add_assort_schema,
    add_shop_schema,
    update_shop_schema,
    delete_shop_schema,
    delete_assort_schema,
    update_assort_schema
} = require("../schema/category");


// 添加餐品分类
router.post('/addAssort', expressJoi(add_assort_schema), handler.addAssort)
// 删除餐品分类
router.post('/deleteCategory', expressJoi(delete_assort_schema), handler.deleteCategory)
// 修改餐品分类
router.post('/updateCategory', expressJoi(update_assort_schema), handler.updateCategory)

module.exports = router