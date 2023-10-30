// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const handler = require('../route_handler/user_power_handler')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入验证规则
const {
    update_user_schema,
    edit_password_schema,
    upload_avatar_schema,
    delete_password_schema
} = require('../schema/user')

router.get('/getUserInfo', handler.getUserInfo)
router.get('/getAllUser', handler.getAllUser)
router.post('/updateUserInfo', expressJoi(update_user_schema), handler.updateUserInfo)
router.post('/editPassword', expressJoi(edit_password_schema), handler.editPassword)
router.get('/queryUser', handler.queryUser)
router.post('/deleteUser', expressJoi(delete_password_schema), handler.deleteUser)
router.post('/restoreUser', expressJoi(delete_password_schema), handler.restoreUser)
router.post('/banUser', expressJoi(delete_password_schema), handler.banUser)
router.get('/queryPower', handler.queryPower)
router.post('/editUserInfo', handler.editUserInfo)
router.get('/queryUserSelect', handler.queryUserSelect)
module.exports = router