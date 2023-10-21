// handle文件
const db = require('../utils/dbConnect')
/**
 * @author longhao
 * @time 2023年10月20日23:58:31
 * @description 添加菜品
 * @param {string} assort_name 分类名 必填
 */
exports.addDish = (req, res) => {
    const pm = req.body
    const sql = ``
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send('ok')
        }
    })
}
// router文件
// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/dish_power_handler')
const expressJoi = require("@escook/express-joi");
const {
    add_dish_schema,
    delete_dish_schema,
    update_dish_schema
} = require('../schema/dish')
// 添加店铺信息
router.post('/addDish', expressJoi(add_dish_schema), handler.addDish)

module.exports = router