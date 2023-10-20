// 导入验证规则对象
const joi = require('joi');
const user_schema = require('./user')
const assort_name = joi.string().trim().min(1).max(10)
const assort_alias = joi.string().trim().min(1)
const shop_id = joi.number()
const shop_name = joi.string().trim().min(5).max(20)
const shop_address = joi.string().trim().min(10)
const shop_host = joi.string().trim().min(2).max(16)
const shop_phone = joi.string().trim().min(6).max(12).pattern(/^(?:\+86-?)?1[0-9]{10}$/)//校验是否为大陆手机号和座机号
const shop_admin = user_schema.username
const assort_id = joi.number().min(1)
const shut_reason = joi.string().trim().min(10).max(500).required()
// 添加分类
exports.add_assort_schema = {
    body:{
        assort_name:assort_name.required(),
        assort_alias:assort_alias.required(),
        shop_id:shop_id.required()
    }
}
// 删除分类
exports.delete_assort_schema = {
    body:{
        assort_id:assort_id.required(),
        shop_id:shop_id.required()
    }
}
// 更新分类
exports.update_assort_schema = {
    body:{
        assort_id:assort_id.required(),
        shop_id:shop_id.required(),
        assort_alias:assort_alias.required(),
        assort_name:assort_name.required()
    }
}
// 查询分类
exports.query_assort_schema = {
    query:{
        shop_id:shop_id.required(),
    }
}
// 添加店铺
exports.add_shop_schema = {
    body:{
        shop_name:shop_name.required(),
        shop_address:shop_address.required(),
        shop_host:shop_host.required(),
        shop_phone:shop_phone.required()
    }
}
//删除店铺信息
exports.delete_shop_schema = {
    body:{
        shop_id:shop_id.required(),
        shut_reason
    }
}
//修改店铺信息
exports.update_shop_schema = {
    body:{
        shop_id:shop_id.required(),
        shop_name,
        shop_address,
        shop_host,
        shop_phone
    }
}
//查询店铺信息
exports.query_shop_schema = {
    query:{
        shop_id:shop_id.required(),
    }
}