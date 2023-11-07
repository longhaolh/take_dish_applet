// 导入验证规则对象
const joi = require('joi');
const user_schema = require('./user')
const shop_id = joi.number()
const shop_name = joi.string().trim().min(5).max(20)
const shop_address = joi.string().trim().min(10)
const shop_host = joi.string().trim().min(2).max(16)
const shop_phone = joi.string().trim().min(6).max(12).pattern(/^(?:\+86-?)?1[0-9]{10}$/)//校验是否为大陆手机号和座机号
const shop_admin = user_schema.username
const shut_reason = joi.string().trim().min(10).max(500).required()
const shop_status = joi.number().max(3).min(0)
const shop_license = joi.string().max(255)
const shop_banner = joi.string().max(2000).allow('', null)
const shop_card = joi.string().max(20)
// 添加店铺
exports.add_shop_schema = {
    body: {
        shop_name: shop_name.required(),
        shop_address: shop_address.required(),
        shop_host: shop_host.required(),
        shop_phone: shop_phone.required(),
        shop_status: shop_status.required(),
        shop_admin,
        shop_license: shop_license.allow(null, ''),
        shop_banner,
        shop_card: shop_card.allow(null, '')
    }
}
//删除店铺信息
exports.delete_shop_schema = {
    body: {
        shop_id: shop_id.required(),
        shut_reason
    }
}
//修改店铺信息
exports.update_shop_schema = {
    body: {
        shop_id: shop_id.required(),
        shop_name,
        shop_address,
        shop_host,
        shop_phone
    }
}
//查询店铺信息
exports.query_shop_schema = {
    query: {
        shop_id: shop_id.required(),
    }
}