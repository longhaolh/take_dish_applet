// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/user_power_handler')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入验证规则
const {update_user_schema, edit_password_schema, upload_avatar_schema} = require('../schema/user')

router.get('/getUserInfo', handler.getUserInfo)
router.get('/getAllUser', handler.getAllUser)
router.post('/updateUserInfo', expressJoi(update_user_schema), handler.updateUserInfo)
router.post('/editPassword', expressJoi(edit_password_schema), handler.editPassword)

module.exports = router