// 导入验证规则对象
const joi = require('joi');
const user_schema = require('./user')
const assort_name = joi.string().trim().min(1).max(10)
const assort_alias = joi.string().trim().min(1)
const shop_id = joi.number()


const assort_id = joi.number().min(1)
// 添加分类
exports.add_assort_schema = {
    body: {
        assort_name: assort_name.required(),
        assort_alias: assort_alias.required(),
        shop_id: shop_id.required()
    }
}
// 删除分类
exports.delete_assort_schema = {
    body: {
        assort_id: assort_id.required(),
        shop_id: shop_id.required()
    }
}
// 更新分类
exports.update_assort_schema = {
    body: {
        assort_id: assort_id.required(),
        shop_id: shop_id.required(),
        assort_alias: assort_alias.required(),
        assort_name: assort_name.required()
    }
}
// 查询分类
exports.query_assort_schema = {
    query: {
        shop_id: shop_id.required(),
    }
}
