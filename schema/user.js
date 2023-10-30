// 导入验证规则对象
const joi = require('joi');
const multer = require("multer");

// 定义校验规则
const username = joi.string().pattern(/^[A-Za-z0-9]{5,16}$/).required(); // 5~16大小写字母组成,可以含有数字但是首位不能为数字且不能含有任何符号或汉字
const password = joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/).required(); // 长度在6~16位之间且必须同时包含英文、数字
const phone = joi.string().pattern(/^1[3-9]\d{9}$/); // 中国大陆手机号校验
const email = joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/); // 邮箱地址合法性校验
const nickname = joi.string().min(1).max(30).pattern(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/); // 只能由英文字母、汉字、数字组合
const avatarUrl = joi.string().required()
const address = joi.string().min(10).max(60)
const id = joi.number().required()
exports.username = username
// 验证账号和密码的规则
exports.user_schema = {
    body: {
        username,
        password,
        avatarUrl: avatarUrl.allow('', null),
        email: email.allow('', null),
        address: address.allow(null, ''),
        nickname
    }
};

// 更新用户信息的验证规则
exports.update_user_schema = {
    body: {
        phone: phone.allow(null, ''),
        email: email.allow(null, ''),
        nickname: nickname.allow(null, '')
    }
};
//修改密码
exports.edit_password_schema = {
    body: {
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
        oldPwd: password
    }
}
// 删除用户
exports.delete_password_schema = {
    body: {
        id,
    }
}
