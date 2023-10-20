// 这是无需验证token的API接口路由
const express = require('express')
const router = express.Router()
const db = require('../utils/dbConnect')
// 导入expressJoi来验证入参
const expressJoi = require('@escook/express-joi')
// 导入验证规则
const { user_schema } = require('../schema/user')
// 导入处理函数模块
const handler = require('../route_handler/user_no_power')
// 注册
router.post('/register',expressJoi(user_schema), handler.register)
// 登录
router.post('/login', handler.login)



module.exports = router